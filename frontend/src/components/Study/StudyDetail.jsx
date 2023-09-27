import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Dialog from "@mui/material/Dialog";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import parseData from "../../utils/parseData";
import Button from "@mui/material/Button";
import OptionPopup from "../Popup/OptionPopup";
import {ListItemIcon, MenuItem} from "@mui/material";
import {request} from "../../utils/request";




export default function StudyDetail({data}){


    const [studyData, setStudyData] = useState(data);


    const handleCloseStudy = async () => {
        try {
            const response = await request.put(`https://participant-system-server-68ca765c5ed2.herokuapp.com/study/${studyData.studyId}`, {isClosed: true});
            // setCurrentStudyStatus(false);
            // const updatedStudies = studyList.map(study => {
            //     if (study.studyId === pageItemId) {
            //         return {...study, status: true};
            //     }
            //     return study;
            // });
            // console.log('updatedStudies: ', updatedStudies);
            //
            // setStudyList(updatedStudies);
            alert("Study closed successfully");

            setStudyData((prevData) => ({
                ...prevData,
                status: false, // 设置为关闭状态
            }));
            alert("Study closed successfully");
            // setOpen(false);
            // handleClose();
        } catch (error) {
            alert(error.response.data.message || "Error closing study");
        }

    };


        return (

                <Grid container spacing={2} alignItems="center" justifyContent="flex-start">
                    <Grid item xs={12} align="center">
                        <Typography variant="h3">{studyData.name} ({studyData.studyCode})</Typography>
                    </Grid>
                    <Grid item xs={12} align="center">
                        <Typography variant="h4">By {studyData.creator}</Typography>
                    </Grid>
                    <Grid item xs={12} align="left">
                        <Typography variant="h5">Researcher List: &nbsp;
                            {studyData.researcherList.map((researcher, index) => (
                                <span key={index}>{researcher.firstName + ' ' + researcher.lastName}；</span>
                            ))}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} align="left">
                        <Typography variant="h5">Description:</Typography>
                        <Paper elevation={0} sx={{ padding: '10px' }}>
                            <Box sx={{ padding: '10px', borderRadius: '4px' }}>
                                <Typography variant="body1">{studyData.description}</Typography>
                            </Box>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} align="h5">
                        <Typography variant="h5" style={{ marginBottom: '10px', display: 'flex'}}>
                            <span>
                                Experiment Type: &nbsp;{studyData.studyType}
                                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                                Date: &nbsp;{parseData(studyData.createdAt)}
                            </span>
                        </Typography>
                    </Grid>
                    <Grid item xs={12} align="h5">
                        <Typography variant="h5" style={{ marginBottom: '10px' }}>Location: &nbsp;{studyData.location.join('; ')}</Typography>
                    </Grid>
                    <Grid item xs={12} align="left">
                        <Typography variant="h5" style={{ marginBottom: '10px' }}>Survey Link: &nbsp;{studyData.surveyLink}</Typography>
                    </Grid>
                    <Grid item xs={12} align="left">
                        <Typography variant="h5" style={{ marginBottom: '10px' }}>Drive Link: &nbsp;{studyData.driveLink}</Typography>
                    </Grid>
                    <Grid item xs={12} align="left">
                        <Typography variant="h5" style={{ marginBottom: '10px' }}>Status: &nbsp;{studyData.status ? 'Active' : 'Close'}</Typography>
                    </Grid>
                    <Grid item xs={12} align="right">
                        {studyData.status ? (
                            <OptionPopup
                                buttonText={"Close Study"}
                                onClick={handleCloseStudy}
                                popupText={'Are you sure you want to close this study?'}
                            />
                        ) : null}

                    </Grid>
                </Grid>


        );





}