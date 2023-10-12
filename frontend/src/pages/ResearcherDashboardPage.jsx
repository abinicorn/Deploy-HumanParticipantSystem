import * as React from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import {CssBaseline, Grid} from "@mui/material";
import { Chip, Button} from '@mui/material';
import {useEffect, useState} from "react";
import '../styles/App.css';
import {useCurrentUser} from "../hooks/useCurrentUser";
import { useNavigate } from 'react-router-dom';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Navbar from '../components/Common/Navbar';
import {request} from "../utils/request";
import {CustomNoRowsOverlayDashboard} from "../styles/CustomNoRowsOverlay";
import {StyledDataGrid} from "../styles/StyledDataGrid";
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import { PotentialParticipantProvider } from '../providers/PotentialParticipantProvider';
import PotentialParticipantPopUp from '../components/Participant/PotentialParticipantPopUp';



export default function ResearcherDashboardPage() {

    // Get user_id from current user,
    const {user} = useCurrentUser();
    const navigate= useNavigate();
    const [loading, setLoading] = React.useState(false)

    useEffect(() => {


        // Get StudyList under current user
        const fetchData = async () => {

                    try {
                        setLoading(true)
                        const studyInfoList = await request.get(`/researcher/studyList/${user.userId}`);

                        setAllStudyList(getStudyList(studyInfoList.data));

                        setCurrentRows(getStudyList(studyInfoList.data));

                        const currentTime = new Date().getTime();

                        // Display expired and active study to remind user
                        const expiredProjects = studyInfoList.data.filter(study => {
                            const closeDate = new Date(study.recruitmentCloseDate).getTime();
                            return closeDate < currentTime && !study.status;
                        });

                        setExpiredStudyList(getStudyList(expiredProjects));


                    } catch (error) {
                        console.error('Error fetching study data:', error);
                    } finally {
                        setLoading(false)
                    }

        };

        fetchData();

    },[user])



    const [expiredStudyList, setExpiredStudyList] = useState([]);

    const [allStudyList, setAllStudyList] = useState(null);

    // CurrentRows dispalys allStudyList or expiredStudyList
    const [currentRows, setCurrentRows] = useState([]);
    const [isAlternateRows, setIsAlternateRows] = useState(false);


    // Switch rows
    const toggleRows = () => {
        if (isAlternateRows) {
            setCurrentRows(allStudyList);
        } else {
            setCurrentRows(expiredStudyList);
        }
        setIsAlternateRows(!isAlternateRows);
    };






    function getStudyList  (data) {

        const parseData = (data || []).map((studyInfo, index) => ({
            id: index + 1,
            studyId: studyInfo.studyId,
            studyCode: studyInfo.studyCode,
            name: studyInfo.studyName,
            participantProgress:  { value: studyInfo.participantCurrentNum, maxValue: studyInfo.participantNum},
            status: !studyInfo.status,
            recruitmentCloseDate: studyInfo.recruitmentCloseDate,
            isCleared: studyInfo.isCleared
        }))

        return parseData;
    }






    function LinearProgressWithLabel(props) {
        return (
                <Box sx={{ width: '100%', mr: 1 }}>
                    <LinearProgress variant="determinate" {...props} />
                </Box>
        );
    }

    const [openParticipantPopUp, setOpenParticipantPopUp] = React.useState(false);


    const columns = [
        { field: 'studyCode', headerName: 'Study Code', flex: 0.5, headerClassName: 'App-Font', width: '10%' },
        {
            field: 'name',
            headerName: 'Name',
            flex: 1,
            headerClassName: 'App-Font',
            renderCell: (params) => (

                <div
                    onClick={() => {
                        navigate(`/studyInfo/${params.row.studyId}`);
                    }}
                    style={{ textDecoration: 'underline', cursor: 'pointer' }}
                >
                    {params.row.name}
                </div>

            ),
            width: 200,
        },
        {
            field: 'participantProgress',
            headerName: 'Participant Progress',
            flex: 1,
            headerClassName: 'App-Font',
            valueGetter: (params) => `${params.value.value} / ${params.value.maxValue}`,
            renderCell: (params) => {
                if (params.row.isCleared) {
                    return (
                        <Typography variant="body2" color="text.secondary">
                            Participants information has been cleared.
                        </Typography>
                    );
                } else {
                    return (
                        <Box sx={{ width: '100%' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <LinearProgressWithLabel value={params.row.participantProgress.value >= params.row.participantProgress.maxValue ? 100 : (params.row.participantProgress.value / params.row.participantProgress.maxValue) * 100} />
                                <Box sx={{ minWidth: 35 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        {params.value}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    );
                }
            },
            width: 250,
        },
        {
            field: 'status',
            headerName: 'Status',
            flex: 0.3,
            headerClassName: 'App-Font',
            renderCell: (params) => (
                <div>
                    {params.value ? (
                        <Chip label="Active" color="primary" />
                    ) : (
                        <Chip label="Closed" color="secondary" />
                    )}
                </div>
            ),
            width: 120,
        }
    ];

    // Create study button
    const handleCreateStudy = () =>{
        
        navigate('/studyDetail/create');

    }



    const buttonText = isAlternateRows ? 'All Study' : 'Expired Study';


    return (

        <div>    
            <Navbar/> 
            <CssBaseline />
        <div style={{marginLeft:'5%', marginRight: '5%'}}>

            <Box component="main" marginTop='6%' marginLeft={5} marginRight={0}>
                <Box sx={{ display: 'flex', justifyContent: "flex-end", flexDirection: 'row', alignItems: 'center' }}>
                    {expiredStudyList.length !== 0 &&
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <WarningAmberOutlinedIcon />
                            <div style={{ margin: '0 3px' }}></div>
                            <Typography variant="contained"> You have expired {expiredStudyList.length} studies.</Typography>
                        </div>
                         }


                        <div style={{ margin: '0 20px' }}></div>

                    {expiredStudyList.length !== 0 &&
                        <Button variant="contained" sx={{
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                padding: '10px',
                                lineHeight: 'normal',
                            }} onClick={toggleRows}>{buttonText}</Button> }

                        <div style={{ margin: '0 30px' }}></div>

                        <Button variant="contained" sx={{
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            padding: '10px',
                            lineHeight: 'normal',
                        }} onClick={() => {setOpenParticipantPopUp(true)}}>Potential Participants</Button>
                        <PotentialParticipantProvider>
                            <PotentialParticipantPopUp open={openParticipantPopUp} onClose={() => setOpenParticipantPopUp(false)}/>
                        </PotentialParticipantProvider>

                        <div style={{ margin: '0 30px' }}></div>

                        <Button variant="contained" sx={{
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            padding: '10px',
                            lineHeight: 'normal',
                        }} onClick={handleCreateStudy}>Create Study</Button>
                    </Box>
            </Box>

            <div style={{ height: '100vh'}}>
            <StyledDataGrid
                sx={{
                    height: "80vh",
                    maxWidth: '100vw',
                    overflowY: 'hidden',
                    overflowX: 'hidden',
                    marginTop: 2,
                    '&.MuiDataGrid-root--densityCompact .MuiDataGrid-cell': { py: '8px' },
                    '&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell': { py: '15px' },
                    '&.MuiDataGrid-root--densityComfortable .MuiDataGrid-cell': { py: '22px' }
                }}
                rows={currentRows}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 10 },
                    },
                }}
                pageSizeOptions={[10, 25, 50]}
                slots={{
                    noRowsOverlay: CustomNoRowsOverlayDashboard,
                    toolbar: GridToolbar
                }}
                loading={loading}
                disableSelectionOnClick
                hideFooterSelectedRowCount
            />
            </div>







        </div>
        </div>
    );
}
