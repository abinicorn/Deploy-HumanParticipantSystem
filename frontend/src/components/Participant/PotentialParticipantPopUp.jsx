import React, { useContext, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, Typography, Button, Box, DialogActions } from '@mui/material';
import PotentialParticipantList from './PotentialParticipantList';
import MailingList from './MailingList';
import MailOutlineIcon from '@mui/icons-material/MailOutline';

import { PotentialParticipantContext } from '../../providers/PotentialParticipantProvider';

export default function PotentialParticipantPopUp({open, onClose}) {

    const {selectedRows} = useContext(PotentialParticipantContext);
    const [openMailingList, setOpenMailingList] = useState(false);

    const handleOpenMailingList = () => {
        setOpenMailingList(true);
    };

    const handleCloseMailingList = () => {
        setOpenMailingList(false);
    };
    
    return (
        <div >

            <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
                <DialogTitle align="center">
                        <Typography variant="h5" color="primary"><strong>Potential Participants</strong></Typography>
                </DialogTitle>
                <DialogContent style={{ maxHeight: '80vh', overflowY: 'auto' }}>
                    <Box height="70vh">
                        <PotentialParticipantList />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Box marginRight={8}>
                            <Button variant="contained" color="primary" size="small" onClick={handleOpenMailingList} startIcon={<MailOutlineIcon />}>
                                Show Mailing List
                            </Button>
                            <MailingList context={PotentialParticipantContext} selectedRows={selectedRows} open={openMailingList} onClose={handleCloseMailingList}/>
                    </Box>
                    <Button variant="contained" color="primary" size="small" onClick={onClose}>
                            Close
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
