import React, {useContext } from 'react';
import { Dialog, DialogTitle, DialogContent, Typography, Button, Box } from '@mui/material';

export default function MailingList({ context, selectedRows, open, onClose }) {
    const {studyParticipants} = useContext(context);

    //The default message is that the mailing list is empty
    let emails = 'Mailing list is empty. Select participants to get their mailing list.'

    // If there are study participants and there is a selected row, build the mailing list
    if (studyParticipants && studyParticipants.length > 0 && selectedRows && selectedRows.length > 0) {
        // Filter out participants who are selected and map to their emails
        // If the participant has an email field, use it
        if (studyParticipants[0].email) {
            emails = studyParticipants
                    .filter(sp => selectedRows.includes(sp._id))  // Assuming _id is a unique identifier for each participant
                    .map(sp => sp.email)
                    .join(', ');
        } else {
            // Otherwise, use the email field from the participant information
            emails = studyParticipants
                    .filter(sp => selectedRows.includes(sp._id))  // Assuming _id is a unique identifier for each participant
                    .map(sp => sp.participantInfo.email)
                    .join(', ');
        }
        
    }

    return (
        <div>

            <Dialog open={open} onClose={onClose} fullWidth>
                <DialogTitle align="center">
                    <Typography variant="h5" component="div" color="primary" style={{ marginBottom: '20px' }}>
                        <strong>Mailing List</strong>
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <textarea 
                        value={emails} 
                        readOnly 
                        style={{ 
                            width: '96%',
                            height: '400px',
                            padding: '8px',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            resize: 'none',
                            // overflowY: 'auto',
                            // whiteSpace: 'pre-wrap',
                            // wordBreak: 'break-word'
                        }}
                    />
                </DialogContent>
                <Box display="flex" justifyContent="center" marginTop={2} style={{ padding: '20px'}}>
                    <Button variant="contained" color="primary" onClick={onClose}>
                        Close
                    </Button>
                </Box>
            </Dialog>
        </div>
    );
}
