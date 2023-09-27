import React, { useState, useContext } from 'react';
import { Box, TextField, Button } from '@mui/material';
import getEmailIds from '../../utils/getEmailIds'; 
import { DataGridContext } from '../../providers/DataGridProvider';

function EmailInputComponent({rows, setSelectedRows, inputEmails, setInputEmails}) {
    const {selectRowsByEmails} = useContext(DataGridContext);

    function handleKeyPress(event) {
        if (event.key === 'Enter') {
            handleSetSelectedRowsByEmails();
            event.preventDefault(); // 阻止默认行为，避免页面刷新
        }
        if (event.key === 'Escape') {
            handleClearInput();
            event.preventDefault();
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
