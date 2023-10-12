import React, { useContext } from 'react';
import { Box, TextField, Button } from '@mui/material';
import getEmailIds from '../../utils/getEmailIds'; 
import { DataGridContext } from '../../providers/DataGridProvider';

function EmailInputComponent({rows, setSelectedRows, inputEmails, setInputEmails}) {
    const {selectRowsByEmails} = useContext(DataGridContext);

    // allow user to press enter or esc to submit or clear
    function handleKeyPress(event) {
        if (event.key === 'Enter') {
            handleSetSelectedRowsByEmails();
            event.preventDefault(); // prevent page refresh
        }
        if (event.key === 'Escape') {
            handleClearInput();
            event.preventDefault(); // prevent page refresh
        }
    }

    function handleSetSelectedRowsByEmails() {
        const emailRows = getEmailIds(rows, inputEmails);
        setSelectedRows(emailRows);
    }

    
    function handleClearInput() {
        setInputEmails('');
        setSelectedRows([]);
    }

    return (
        rows.length > 0 && selectRowsByEmails ? (
            <Box display='flex' flexDirection='row' width='100%'>
                <Box flex={5} marginRight='10px'>
                    <TextField 
                        fullWidth 
                        label="Input Emails" 
                        variant="outlined" 
                        size="small"
                        value={inputEmails}
                        onChange={(e) => setInputEmails(e.target.value)}
                        onKeyDown={handleKeyPress}
                        style={{ marginBottom: '5px', marginTop: '5px' }}
                    />
                </Box>
                <Box flex={2} display='flex' flexDirection='row' alignItems='center'>
                    <Box marginRight='20px'>
                        <Button 
                            variant="contained"
                            color='primary'
                            size='small'
                            onClick={handleSetSelectedRowsByEmails}>
                                Find Rows
                        </Button>
                    </Box>
                    <Box>
                        <Button 
                        variant="outlined"
                        color='secondary'
                        size='small'
                        onClick={handleClearInput}>
                            Clear
                        </Button>
                    </Box>
                </Box>
            </Box>
        
    ): null )
}

export default EmailInputComponent;
