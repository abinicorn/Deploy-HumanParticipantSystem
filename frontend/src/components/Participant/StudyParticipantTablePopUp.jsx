import React, { useContext, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, Typography, Button, Box, DialogActions } from '@mui/material';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import ParticipantsTable from './StudyParticipantTable'
import EmailInputComponent from '../DataGrid/EmailInputComponent';

import { DataGridContext } from '../../providers/DataGridProvider';
import { StudyParticipantContext } from '../../providers/StudyPaticipantsProvider';

export default function StudyParticipantTable({open, onClose}) {

    const {inputEmails, setInputEmails} = useContext(DataGridContext);
    const {studyParticipants, setSelectedRows} = useContext(StudyParticipantContext);


    function closeFullscreen() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) { /* Safari */
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { /* IE11 */
            document.msExitFullscreen();
        }
    }

    const handleFullscreenChange = () => {
        if (!document.fullscreenElement && !document.webkitIsFullScreen && !document.mozFullScreen && !document.msFullscreenElement) {
            // not in fullscreen status
            onClose();
        }
    };

    useEffect(() => {
        document.addEventListener("fullscreenchange", handleFullscreenChange);
        document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
        document.addEventListener("mozfullscreenchange", handleFullscreenChange);
        document.addEventListener("MSFullscreenChange", handleFullscreenChange);

        return () => {
            // clear event listeners
            document.removeEventListener("fullscreenchange", handleFullscreenChange);
            document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
            document.removeEventListener("mozfullscreenchange", handleFullscreenChange);
            document.removeEventListener("MSFullscreenChange", handleFullscreenChange);
        };
    }, []);

    return (
        <div >

            <Dialog open={open} onClose={onClose} fullWidth maxWidth="xl" fullScreen>
                <DialogContent style={{ height: '90vh', width: '99vw' }}>
                    <Box class= 'participant-Table-Pop-Up'>
                        <ParticipantsTable />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Box display='flex' flexDirection='row' justifyContent='space-between' alignItems='center'>
                        <Box sx={{width: '70vw'}}>
                                <EmailInputComponent 
                                    rows={studyParticipants}
                                    setSelectedRows={setSelectedRows}
                                    inputEmails={inputEmails}
                                    setInputEmails={setInputEmails}
                                />
                        </Box>
                        <Box>
                            <Button variant="contained" color="primary" onClick={() => {
                                onClose();
                                closeFullscreen();
                            }} startIcon={<FullscreenExitIcon/>}>
                                Exit fullscreen
                            </Button>
                        </Box>
                    </Box>
                </DialogActions>
            </Dialog>
        </div>
    );
}
