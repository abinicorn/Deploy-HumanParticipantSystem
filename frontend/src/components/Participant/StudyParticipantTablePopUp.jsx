import React, { useContext, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, Button, Box, DialogActions } from '@mui/material';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import ParticipantsTable from './StudyParticipantTable'
import EmailInputComponent from '../DataGrid/EmailInputComponent';

import { DataGridContext } from '../../providers/DataGridProvider';
import { StudyParticipantContext } from '../../providers/StudyPaticipantsProvider';

export default function StudyParticipantTable({open, onClose}) {

    const {inputEmails, setInputEmails} = useContext(DataGridContext);
    const {studyParticipants, setSelectedRows} = useContext(StudyParticipantContext);

    // Function to exit the full screen mode
    function closeFullscreen() {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitExitFullscreen) { /* Safari */
          document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { /* IE11 */
          document.msExitFullscreen();
        }
    }

    // Handler to manage behavior when the fullscreen state changes
    const handleFullscreenChange = useCallback(() => {
        if (!document.fullscreenElement && !document.webkitIsFullScreen && !document.mozFullScreen && !document.msFullscreenElement) {
            // If not in fullscreen status, close the dialog
            onClose();
        }
    }, [onClose]);

    // Add and remove event listeners for fullscreen changes when the component mounts and unmounts
    useEffect(() => {
        document.addEventListener("fullscreenchange", handleFullscreenChange);
        document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
        document.addEventListener("mozfullscreenchange", handleFullscreenChange);
        document.addEventListener("MSFullscreenChange", handleFullscreenChange);
    
        return () => {
            // clear event listeners upon component unmount
            document.removeEventListener("fullscreenchange", handleFullscreenChange);
            document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
            document.removeEventListener("mozfullscreenchange", handleFullscreenChange);
            document.removeEventListener("MSFullscreenChange", handleFullscreenChange);
        };
    }, [handleFullscreenChange]);
    
    

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
