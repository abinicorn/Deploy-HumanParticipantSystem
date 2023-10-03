import {useEffect, useState} from "react";
import * as React from "react";
import {request} from "../../utils/request";
import parseData from "../../utils/parseData";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography} from "@mui/material";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import {DataGrid, GridToolbar} from "@mui/x-data-grid";
import {CustomNoRowsOverlaySession} from "../../styles/CustomNoRowsOverlay";
import {StyledDataGrid} from "../../styles/StyledDataGrid";


export default function StudyReport({data}){

    const [studyData, setStudyData] = useState(data);



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
        <div>


            <Grid container spacing={2} alignItems="center" justifyContent="flex-start">
                <Grid item xs={12} align="right">
                    <Button variant="contained" onClick={exportData}>Export JSON</Button>
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
                                <span style={{ fontWeight: 'bold', display: 'inline-block', color: '#19467B' }}>Start Date:</span>
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
                                <span style={{ fontWeight: 'bold', display: 'inline-block', color: '#19467B' }}>Close Date:</span>
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

                <Grid item xs={12} align="left">
                    <Typography variant="h5" style={{ marginBottom: '10px' }}>
                        <span style={{ fontWeight: 'bold', display: 'inline-block', color: '#19467B' }}>Status:</span>
                        &nbsp; &nbsp; &nbsp;

                        <span style={{ textDecoration: 'underline' }}>
                                {studyData.isClosed ? 'Close' : 'Active'}
                                </span>
                    </Typography>
                </Grid>


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


        </div>
    )
}