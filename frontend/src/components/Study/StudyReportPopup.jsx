import * as React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import parseData from "../../utils/parseData";
import {DataGrid, GridToolbar} from "@mui/x-data-grid";
import {useEffect, useState} from "react";
import {request} from "../../utils/request";


export default function StudyReportPopup({currentStudy, studyId}) {


    const [study, setStudy] = React.useState(currentStudy);


    const [open, setOpen] = React.useState(false);
    const scroll ='paper';


    // Session
    const [sessionList, setSessionList] = React.useState(null);



    useEffect(() => {

        const fetchData = async () => {
            try {
                const response = await request.get(`/session/list/${studyId}`);

                setSessionList(response.data);




            } catch (error) {
                console.error('Error fetching session data:', error);
            }
        };
        fetchData();
    }, [study]);



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

    }, [study]);



    async function fetchStudyParticipants() {
        const response = await request.get(`/study-participants/${studyId}`);
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






    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };


    const exportData = () => {

        const studyInfo = {
            studyName: study.name,
            studyCode: study.studyCode,
            creator: study.creator,
            researcherList: study.researcherList.map((researcher, index) => (
                `${researcher.firstName} ${researcher.lastName}`
            )).join(', '),
            description: study.description,
            experimentType: study.studyType,
            date: parseData(study.createdAt),
            location: study.location.join('; ')
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
            <Typography textAlign="center" onClick={handleClickOpen}>Generate Report</Typography>
            <Dialog
                open={open}
                onClose={handleClose}
                scroll={scroll}
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"
                maxWidth="lg"
                fullWidth
            >
                <DialogTitle id="scroll-dialog-title">Summary Report</DialogTitle>


                <DialogContent dividers={scroll === 'paper'}>

                    <Paper sx={{ padding: '20px', width: '100%' }} elevation={3} className="study-info-popup">
                        <Grid container spacing={2} alignItems="center" justifyContent="flex-start">
                            <Grid item xs={12} align="center">
                                <Typography variant="h3">{study.name} ({study.studyCode})</Typography>
                            </Grid>
                            <Grid item xs={12} align="center">
                                <Typography variant="h4">By {study.creator}</Typography>
                            </Grid>
                            <Grid item xs={12} align="left">
                                <Typography variant="h5">Researcher List: &nbsp;
                                    {study.researcherList.map((researcher, index) => (
                                        <span key={index}>{researcher.firstName + ' ' + researcher.lastName}；</span>
                                    ))}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} align="left">
                                <Typography variant="h5">Description:</Typography>
                                <Paper elevation={0} sx={{ padding: '10px' }}>
                                    <Box sx={{ padding: '10px', borderRadius: '4px' }}>
                                        <Typography variant="body1">{study.description}</Typography>
                                    </Box>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} align="h5">
                                <Typography variant="h5" style={{ marginBottom: '10px', display: 'flex'}}>
                            <span>
                                Experiment Type: &nbsp;{study.studyType}
                                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                                Date: &nbsp;{parseData(study.createdAt)}
                            </span>
                                </Typography>
                                <Typography variant="h5" style={{ marginBottom: '10px' }}>Location: &nbsp;{study.location.join('; ')}</Typography>
                            </Grid>


                            <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '50px', width: '100%' }}>
                                <Paper sx={{ flex: 1, width: '100%' }}>
                                    <Grid item xs={12} align="center">
                                        <div style={{ height: '100%' }}>
                                            <Typography variant="h5" style={{ marginBottom: '10px' }}>Session List</Typography>
                                            <DataGrid
                                                rows={sessionRows}
                                                columns={sessionColumns}
                                                pageSize={5}
                                                rowsPerPageOptions={[5, 10, 20]}
                                                components={{
                                                    Toolbar: GridToolbar,
                                                }}
                                                checkboxSelection
                                            />
                                        </div>
                                    </Grid>
                                </Paper>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                                <Paper sx={{ flex: 1, width: '100%' }}>
                                    <Grid item xs={12} align="center">
                                        <div style={{ height: '100%' }}>
                                            <Typography variant="h5" style={{ marginBottom: '10px' }}>Participant List</Typography>
                                            <DataGrid
                                                rows={participantsRows}
                                                columns={participantsColumns}
                                                pageSize={5}
                                                rowsPerPageOptions={[5, 10, 20]}
                                                components={{
                                                    Toolbar: GridToolbar,
                                                }}
                                                checkboxSelection
                                            />
                                        </div>
                                    </Grid>
                                </Paper>
                            </div>


                        </Grid>
                    </Paper>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" onClick={exportData}>Export JSON</Button>
                    <Button variant="contained" onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog>
        </div>
    )

}