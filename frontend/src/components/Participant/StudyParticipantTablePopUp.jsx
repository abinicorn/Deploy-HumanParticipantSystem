import React, { useContext, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, Typography, Button, Box, DialogActions } from '@mui/material';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import ParticipantsTable from './StudyParticipantTable'
import EmailInputComponent from '../DataGrid/EmailInputComponent';

import { DataGridContext } from '../../providers/DataGridProvider';
import { StudyParticipantContext } from '../../providers/StudyPaticipantsProvider';

export default function StudyParticipantTable({open, onClose}) {

    const {inputEmails, setInputEmails} = useContext(DataGridContext);
    const {studyParticipants, setSelectedRows} = useContext(StudyParticipantContext);

    return (
        <div >

            <Dialog open={open} onClose={onClose} fullWidth maxWidth="xl" fullScreen>
                <DialogContent style={{ height: '90vh', width: '99vw' }}>
                    <Box sx={{height: '86vh'}}>
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
                            <Button variant="contained" color="primary" onClick={onClose} startIcon={<FullscreenExitIcon/>}>
                                Exit fullscreen
                            </Button>
                        </Box>
                    </Box>
                </DialogActions>
            </Dialog>
        </div>
    );
}
