import * as React from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import {CssBaseline, Grid} from "@mui/material";
import { Chip, Button} from '@mui/material';
import {useEffect, useState} from "react";
import '../styles/App.css';
import StudyDetailPopup from "../components/Study/StudyDetailPopup"
import {useCurrentUser} from "../hooks/useCurrentUser";
import HomeActionButton from '../components/Button/HomeActionButton';
import { useNavigate } from 'react-router-dom';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Navbar from '../components/Navbar';
import {request} from "../utils/request";
import { Link } from 'react-router-dom';
import {CustomNoRowsOverlayDashboard} from "../styles/CustomNoRowsOverlay";
import {StyledDataGrid} from "../styles/StyledDataGrid";





export default function ResearcherDashboardPage() {

    const {user} = useCurrentUser();
    const navigate= useNavigate();


    useEffect(() => {



        const fetchData = async () => {

                    try {
                        const studyInfoList = await request.get(`https://participant-system-server-68ca765c5ed2.herokuapp.com/researcher/studyList/${user.userId}`);

                        setStudyList(studyInfoList.data);
                    } catch (error) {
                        console.error('Error fetching study data:', error);
                    }

        };

        fetchData();

    },[user])


    const [studyList, setStudyList] = useState(null);

    const handleNameClick = (item) => {
        setSelectedStudy(item);
        setIsStudyDetailPopupOpen(true);
    };


    const rows = (studyList || []).map((studyInfo, index) => ({
        id: index + 1,
        studyId: studyInfo.studyId,
        studyCode: studyInfo.studyCode,
        name: studyInfo.studyName,
        participantProgress: { value: studyInfo.participantCurrentNum, maxValue: studyInfo.participantNum},
        status: !studyInfo.status,
        description: studyInfo.description,
        creator: studyInfo.creator.firstName + ' ' + studyInfo.creator.lastName,
        researcherList: studyInfo.researcherList,
        studyType: studyInfo.studyType,
        recruitmentStartDate: studyInfo.recruitmentStartDate,
        recruitmentCloseDate: studyInfo.recruitmentCloseDate,
        location: studyInfo.location,
        driveLink: studyInfo.driveLink,
        createdAt: studyInfo.createdAt,
        updatedAt: studyInfo.updatedAt,
        surveyLink: studyInfo.surveyLink
    }));




    const [selectedStudy, setSelectedStudy] = useState(null);

    const [isStudyDetailPopupOpen, setIsStudyDetailPopupOpen] = useState(false);

    const handleStudyDetailClosePopup = () => {
        setSelectedStudy(null);
        setIsStudyDetailPopupOpen(false);
    };


    function LinearProgressWithLabel(props) {
        return (
                <Box sx={{ width: '100%', mr: 1 }}>
                    <LinearProgress variant="determinate" {...props} />
                </Box>
        );
    }




    const columns = [
        { field: 'studyCode', headerName: 'Study Code', flex: 0.5, headerClassName: 'App-Font', width: '10%' },
        {
            field: 'name',
            headerName: 'Name',
            flex: 1,
            headerClassName: 'App-Font',
            renderCell: (params) => (
                // <a href="#/" onClick={() => handleNameClick(params.row)}> {params.row.name} </a>
                //  <a href={`/studyInfo/${params.row.studyId}`}>{params.row.name}</a>

                // <Link to={{
                //     pathname: `/studyInfo/${params.row.studyId}`,
                //
                //     state: '111'
                // }}>{params.row.name}</Link>
                <div
                    onClick={() => {
                        navigate(`/studyInfo/${params.row.studyId}`, {
                            state: { study: params.row },
                        });
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
            renderCell: (params) => (
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
            ),
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
        },
        // {
        //     field: 'studyId',
        //     headerName: 'Action',
        //     flex: 1,
        //     headerClassName: 'App-Font',
        //     renderCell: (params) =>
        //             <HomeActionButton
        //                 pageItemId={params.row.studyId}
        //                 currentStudy={params.row}
        //                 setStudyList={setStudyList}
        //                 studyList={studyList}
        //             />
        //
        // },
    ];


    const handleCreateStudy = () =>{
        
        navigate('/studyDetail/create');

    }

    // Component where you want to navigate from


        // const handleButtonClick = () => {
        //     // Assuming you want to send an object as a prop
        //     const objToSend = { name: 'John Doe', age: 25 };
        //
        //     // Navigate to PageTwo and send the object as a prop
        //
        //     navigate(url, {
        //         state: { objToSend } }
        //     })
        //
        // };





    return (

        <div>    
            <Navbar/> 
            <CssBaseline />
            <div style={{marginLeft:'5%', marginRight: '5%'}}>
                <Grid container spacing={-20}
                        alignItems="center"
                        marginTop='5%'
                        marginBottom = '0.5%'
                        justifyContent="flex-end"
                >
                    <Button sx={{
                        marginRight: '-7%',
                        fontSize: '16px',
                    }} disableElevation
                            variant="contained"
                            aria-label="Disabled elevation buttons"
                            onClick={handleCreateStudy}

                    >Create Study</Button>
                </Grid>

                <div style={{ height: '100vh' }}>
                <StyledDataGrid
                    sx={{
                        height: "80vh",
                        maxWidth: '100vw',
                        overflowY: 'auto',
                        overflowX: 'hidden',
                        marginTop: 2,
                        '&.MuiDataGrid-root--densityCompact .MuiDataGrid-cell': { py: '8px' },
                        '&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell': { py: '15px' },
                        '&.MuiDataGrid-root--densityComfortable .MuiDataGrid-cell': { py: '22px' }
                    }}
                    rows={rows}
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
                    disableSelectionOnClick
                    hideFooterSelectedRowCount
                />
                </div>



                {isStudyDetailPopupOpen && (
                    <StudyDetailPopup study={selectedStudy} onClose={handleStudyDetailClosePopup} open={isStudyDetailPopupOpen}/>
                )}



            </div>
        </div>

    );
}