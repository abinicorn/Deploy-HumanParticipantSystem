import React, {useContext, useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import parseData from "../../utils/parseData";
import OptionPopup from "../Popup/OptionPopup";
import {request} from "../../utils/request";
import {Button} from "@mui/material";
import Paper from "@mui/material/Paper";
import {StyledDataGrid} from "../../styles/StyledDataGrid";
import {CustomNoRowsOverlaySession} from "../../styles/CustomNoRowsOverlay";
import {GridToolbar} from "@mui/x-data-grid";



export default function StudyDetail({data, isClosed}){


    const [studyData, setStudyData] = useState(data);


    const handleCloseStudy = async () => {
        try {
            console.log(studyData.studyId);
            await request.put(`/study/${studyData.studyId}`, {isClosed: true});
            alert("Study closed successfully");

            setStudyData((prevData) => ({
                ...prevData,
                isClosed: true,
            }));

            isClosed();

        } catch (error) {
            alert(error || "Error closing study");
        }

    };



    const [sessionList, setSessionList] = React.useState(null);


    useEffect(() => {

        const fetchData = async () => {
            try {


                const response = await request.get(`/session/list/${studyData.studyId}`);

                setSessionList(response.data);

            } catch (error) {
                console.error('Error fetching session data:', error);
            }
        };
        fetchData();
    }, [studyData]);

    const sessionRows = (sessionList || []).map((sessionInfo, index) => ({
        id: index + 1,
        sessionId: sessionInfo._id,
        sessionCode: sessionInfo.sessionCode,
        date: sessionInfo.date,
        time: sessionInfo.time,
        location: sessionInfo.location,
        participantNum: sessionInfo.participantNum,
        status: sessionInfo.isArchive ? 'Archive' : 'Active'
    }));

    const sessionColumns = [
        { field: 'sessionCode', headerName: 'Session Code', flex: 1, headerAlign: 'center', align:'center'},
        { field: 'date', headerName: 'Date', flex: 1, headerAlign: 'center', align:'center', valueGetter: (params) => (params.value.slice(0,10)) },
        { field: 'time', headerName: 'Time', flex: 1, headerAlign: 'center', align:'center'},
        { field: 'location', headerName: 'Location', flex: 1.5, headerAlign: 'center', align:'center'},
        { field: 'participantNum', headerName: 'Participant Number', flex: 1, headerAlign: 'center', align:'center' },
        { field: 'status', headerName: 'Status', flex: 1, headerAlign: 'center', align:'center' },
    ]


    // Participants
    const [studyParticipants, setStudyParticipants] = useState([]);


    useEffect(() => {
        const fetchData = async () => {
            await fetchStudyParticipants();
        };

        fetchData();

    }, [studyData]);



    async function fetchStudyParticipants() {
        const response = await request.get(`/study-participants/${studyData.studyId}`);
        setStudyParticipants(response.data);
    };


    const participantsRows = (studyParticipants || []).map((participantInfo, index) => ({
        id: index + 1,
        participantId: participantInfo._id,
        serialNo: participantInfo.serialNum,
        email: participantInfo.participantInfo.email,
        tag: participantInfo.participantInfo.tagsInfo.join('; '),
        winGift: participantInfo.isGift ? 'Yes' : 'No',
        willingToReceiveReport: participantInfo.isWIllReceiveReport ? 'Yes' : 'No'
    }));

    const participantsColumns = [
        { field: 'serialNo', headerName: 'Serial No.', flex: 0.5, headerAlign: 'center', align:'center'},
        { field: 'email', headerName: 'Email', flex: 2, headerAlign: 'center', align:'center'},
        { field: 'tag', headerName: 'Tag', flex: 1, headerAlign: 'center', align:'center'},
        { field: 'winGift', headerName: 'Win Gift', flex: 1, headerAlign: 'center', align:'center'},
        { field: 'willingToReceiveReport', headerName: ' Receive the final report', flex: 1, headerAlign: 'center', align:'center'},
    ];


    const exportData = () => {

        const studyInfo = {
            studyName: studyData.name,
            studyCode: studyData.studyCode,
            creator: studyData.creator,
            researcherList: studyData.researcherList.map((researcher, index) => (
                `${researcher.firstName} ${researcher.lastName}`
            )).join(', '),
            description: studyData.description,
            experimentType: studyData.studyType,
            date: parseData(studyData.createdAt),
            location: studyData.location.join('; ')
        }

        const sessionInfo = (sessionList || []).map((sessionInfo, index) => ({
            sessionCode: sessionInfo.sessionCode,
            date: sessionInfo.date,
            time: sessionInfo.time,
            location: sessionInfo.location,
            participantNum: sessionInfo.participantNum
        }));

        const participantsInfo = (studyParticipants || []).map((participantInfo, index) => ({
            serialNo: participantInfo.serialNum,
            email: participantInfo.participantInfo.email,
            tag: participantInfo.tagsInfo,
            winGift: participantInfo.isGift,
            willingToReceiveReport: participantInfo.isWIllReceiveReport
        }));


        const exportedData = {
            studyInformation: studyInfo,
            sessionList: sessionInfo,
            participantList: participantsInfo,
        };

        const jsonData = JSON.stringify(exportedData, null, 2);

        const blob = new Blob([jsonData], { type: 'studyReport/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'exported_data.json';
        a.click();

        URL.revokeObjectURL(url);
    };





    return (
        <Paper style={{ padding: '40px', width: '100%' }}>



        <Grid container spacing={2} alignItems="center" justifyContent="flex-start" 
        // style={{ maxWidth: '100%' }}
        >
            <Grid item xs={12} align="right">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginRight: '10px', width:'23vw' }}>
                    {!studyData.isClosed ? (
                        <OptionPopup
                            buttonText={"Close Study"}
                            onClick={handleCloseStudy}
                            popupText={'Are you sure you want to close this study?'}
                        />
                    ) : null}


                    <Button variant="contained" onClick={exportData}>Export JSON</Button>
                </div>
            </Grid>


            <Grid item xs={12} align="center">
                <Typography variant="h3" style={{ color: '#19467B' }}>{studyData.name} ({studyData.studyCode})</Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <Typography variant="h5" >By {studyData.creator}</Typography>
            </Grid>

            <Grid item xs={12} align="left">
                <Typography variant="h5">
                    <span style={{ fontWeight: 'bold', display: 'inline-block', color: '#19467B' }}>Researcher List:</span>
                </Typography>
            </Grid>

            <Grid item xs={12} align="left">
                <Typography variant="h5">
                    &nbsp;&nbsp; &nbsp;
                    {studyData.researcherList.map((researcher, index) => (
                        <span key={index} style={{ display: 'inline-block', textDecoration: 'underline'}}>
                                    {researcher.firstName + ' ' + researcher.lastName}
                            {index < studyData.researcherList.length - 1 && '；'}
                                </span>
                    ))}
                </Typography>
            </Grid>

            <Grid item xs={12} align="left">
                <Typography variant="h5" style={{ fontWeight: 'bold', color: '#19467B' }}>Description:</Typography>
                <Box sx={{ padding: '10px', borderRadius: '4px' }}>
                    <Typography variant="h6">{studyData.description}</Typography>
                </Box>
            </Grid>

            <Grid item xs={12} align="h5">
                <Typography variant="h5" style={{ marginBottom: '10px', display: 'flex'}}>
                            <span>
                                <span style={{ fontWeight: 'bold', display: 'inline-block', color: '#19467B' }}>Experiment Type:</span>
                                &nbsp; &nbsp; &nbsp;

                                <span style={{ textDecoration: 'underline' }}>
                                  {studyData.studyType}
                                </span>
                            </span>
                </Typography>
            </Grid>

            <Grid item xs={12} align="h5">
                <Typography variant="h5" style={{ marginBottom: '10px', display: 'flex'}}>
                            <span>
                                <span style={{ fontWeight: 'bold', display: 'inline-block', color: '#19467B' }}>Project Start Date:</span>
                                &nbsp; &nbsp; &nbsp;

                                <span style={{ textDecoration: 'underline' }}>
                                  {parseData(studyData.recruitmentStartDate)}
                                </span>

                            </span>
                </Typography>
            </Grid>

            <Grid item xs={12} align="h5">
                <Typography variant="h5" style={{ marginBottom: '10px', display: 'flex'}}>
                            <span>
                                <span style={{ fontWeight: 'bold', display: 'inline-block', color: '#19467B' }}>Project Close Date:</span>
                                &nbsp; &nbsp; &nbsp;
                                <span style={{ textDecoration: 'underline' }}>
                                  {parseData(studyData.recruitmentCloseDate)}
                                </span>

                            </span>
                </Typography>
            </Grid>

            <Grid item xs={12} align="h5">
                <Typography variant="h5" style={{ marginBottom: '10px' }}>
                    <span style={{ fontWeight: 'bold', display: 'inline-block', color: '#19467B' }}>Location:</span>
                </Typography>
            </Grid>

            <Grid item xs={12} align="h5">
                <Typography variant="h5" style={{ marginBottom: '10px' }}>
                    &nbsp; &nbsp; &nbsp;
                    <span style={{ textDecoration: 'underline' }}>
                              {studyData.location.join("; \u00A0")}
                            </span>

                </Typography>
            </Grid>


            <Grid item xs={12} align="left">
                <Typography variant="h5" style={{ marginBottom: '10px' }}>
                    <span style={{ fontWeight: 'bold', display: 'inline-block', color: '#19467B' }}>Survey Link:</span>
                    &nbsp; &nbsp; &nbsp;

                    <span style={{ textDecoration: 'underline', color: '#4299C3' }}>
                                  {studyData.surveyLink}
                                </span>
                </Typography>
            </Grid>

            <Grid item xs={12} align="left">
                <Typography variant="h5" style={{ marginBottom: '10px' }}>
                    <span style={{ fontWeight: 'bold', display: 'inline-block', color: '#19467B' }}>Drive Link:</span>
                    &nbsp; &nbsp; &nbsp;
                    <span style={{ textDecoration: 'underline', color: '#4299C3' }}>
                                  {studyData.driveLink}
                                </span>
                </Typography>
            </Grid>

            {/*<Grid item xs={12} align="left">*/}
            {/*    <Typography variant="h5" style={{ marginBottom: '10px' }}>*/}
            {/*        <span style={{ fontWeight: 'bold', display: 'inline-block', color: '#19467B' }}>Status:</span>*/}
            {/*        &nbsp; &nbsp; &nbsp;*/}

            {/*        <span style={{ textDecoration: 'underline' }}>*/}
            {/*                    {studyData.isClosed ? 'Close' : 'Active'}*/}
            {/*                    </span>*/}
            {/*    </Typography>*/}

            {/*    {!studyData.isClosed ? (*/}
            {/*        <OptionPopup*/}
            {/*            buttonText={"Close Study"}*/}
            {/*            onClick={handleCloseStudy}*/}
            {/*            popupText={'Are you sure you want to close this study?'}*/}
            {/*        />*/}
            {/*    ) : null}*/}
            {/*</Grid>*/}

            <Grid item xs={12} align="left" style={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="h5" style={{ marginBottom: '10px' }}>
                    <span style={{ fontWeight: 'bold', display: 'inline-block', color: '#19467B' }}>Status:</span>
                    &nbsp; &nbsp; &nbsp;

                    <span style={{ textDecoration: 'underline' }}>
                                {studyData.isClosed ? 'Close' : 'Active'}
                                </span>
                    &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp;
                </Typography>
            </Grid>

            {/*<Grid item xs={12} align="right">*/}
            {/*    {!studyData.isClosed ? (*/}
            {/*        <OptionPopup*/}
            {/*            buttonText={"Close Study"}*/}
            {/*            onClick={handleCloseStudy}*/}
            {/*            popupText={'Are you sure you want to close this study?'}*/}
            {/*        />*/}
            {/*    ) : null}*/}

            {/*</Grid>*/}


            <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '50px', width: '100%' }}>
                <Paper sx={{ flex: 1, width: '100%' }}>
                    <Grid container alignItems="center" justifyContent="center">
                        <Typography variant="h5" style={{ marginTop: '10px', fontWeight: 'bold', display: 'inline-block', color: '#19467B'}}>Session List</Typography>
                    </Grid>

                    <StyledDataGrid
                        sx={{
                            height: "65vh",
                            maxWidth: '100vw',
                            overflowY: 'auto',
                            overflowX: 'hidden',
                            marginTop: 2,
                            '&.MuiDataGrid-root--densityCompact .MuiDataGrid-cell': { py: '8px' },
                            '&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell': { py: '15px' },
                            '&.MuiDataGrid-root--densityComfortable .MuiDataGrid-cell': { py: '22px' }
                        }}
                        rows={sessionRows}
                        columns={sessionColumns}
                        initialState={{
                            pagination: {
                                paginationModel: { page: 0, pageSize: 10 },
                            },
                        }}
                        pageSizeOptions={[10, 25, 50]}
                        slots={{
                            noRowsOverlay: CustomNoRowsOverlaySession,
                            toolbar: GridToolbar
                        }}
                        disableSelectionOnClick
                        hideFooterSelectedRowCount
                        checkboxSelection
                    />

                </Paper>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                <Paper sx={{ flex: 1, width: '100%' }}>
                    <Grid container alignItems="center" justifyContent="center">
                        <Typography variant="h5" style={{ marginTop: '10px', fontWeight: 'bold', display: 'inline-block', color: '#19467B' }}>
                            Participant List
                        </Typography>
                    </Grid>

                    <StyledDataGrid
                        sx={{
                            height: "65vh",
                            maxWidth: '100vw',
                            overflowY: 'auto',
                            overflowX: 'hidden',
                            marginTop: 2,
                            '&.MuiDataGrid-root--densityCompact .MuiDataGrid-cell': { py: '8px' },
                            '&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell': { py: '15px' },
                            '&.MuiDataGrid-root--densityComfortable .MuiDataGrid-cell': { py: '22px' }
                        }}
                        rows={participantsRows}
                        columns={participantsColumns}
                        initialState={{
                            pagination: {
                                paginationModel: { page: 0, pageSize: 10 },
                            },
                        }}
                        pageSizeOptions={[10, 25, 50]}
                        slots={{
                            noRowsOverlay: CustomNoRowsOverlaySession,
                            toolbar: GridToolbar
                        }}
                        disableSelectionOnClick
                        hideFooterSelectedRowCount
                        checkboxSelection
                    />

                </Paper>
            </div>






        </Grid>

        </Paper>

    );






}