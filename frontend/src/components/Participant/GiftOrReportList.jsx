import React, { useState, useContext } from 'react';
import { Dialog, DialogTitle, DialogContent, Button, Typography, Box, DialogActions } from '@mui/material';
import CustomCheckbox from '../Button/CustomCheckbox';
import '../../styles/GiftList.css';
import MailingList from './MailingList';
import { StudyResearcherContext } from '../../providers/StudyResearcherContextProvider';
import { StudyParticipantContext } from '../../providers/StudyPaticipantsProvider';
import { CustomNoRowsOverlay } from '../../styles/CustomNoRowsOverlay';
import { StyledDataGrid } from '../../styles/StyledDataGrid';
import { combineCodeSerialNum } from '../../utils/combineCodeSerialNum';
import EmailInputComponent from '../DataGrid/EmailInputComponent';
import MailOutlineIcon from '@mui/icons-material/MailOutline';

//Define the gift list component to display the gift list or report the recipient list according to the type
export default function GiftList({ type, open, onClose }) {

    //Define state and context variables
    const [selectedRows, setSelectedRows] = useState([]);
    const [inputEmails, setInputEmails] = useState('');
    const {studyParticipants, updateSentStatus, toggleStudyParticipantsProperty} = useContext(StudyParticipantContext);
    const {studyInfo} = useContext(StudyResearcherContext);
    const [openMailingList, setOpenMailingList] = useState(false);
    const [loading, setLoading] = useState(false);

    // Handle the open mailing list dialog box
    const handleOpenMailingList = () => {
        setOpenMailingList(true);
    };

    // Handle the close mailing list dialog box
    const handleCloseMailingList = () => {
        setOpenMailingList(false);
    };

    // Toggle the sending status of the selected participant
    const handleToggleSentStatus = async (_id) => {
        setLoading(true);
        const participantToUpdate = studyParticipants.find(p => p._id === _id);
        let updatedParticipant;

        if (type === 'gift') {
            updatedParticipant = { ...participantToUpdate, isSentGift: !participantToUpdate.isSentGift };
        } else if (type === 'report') {
            updatedParticipant = { ...participantToUpdate, isSentReport: !participantToUpdate.isSentReport };
        }

        console.log(updatedParticipant);
        try {
            await updateSentStatus(updatedParticipant);
        } catch (error) {
            console.error("Error changing participant:", error);
        } finally {
            setLoading(false);
        }
        
    };

    // Get the title of the dialog box
    const getTitle = () => {
        return type === 'gift' ? 'Gift List' : 'Report Recipients List';
    }

    // Determine if participants should be included
    const shouldIncludeParticipant = (participant) => {
        return type === 'gift' ? participant.isGift : participant.isWIllReceiveReport;
    }

    // Get the status of the checkbox
    const getCheckboxState = (participant) => {
        return type === 'gift' ? participant.isSentGift : participant.isSentReport;
    }

    //toggle selected rows
    const handleToggleSelectedRows = () => {
        const dataToSend = {
            ids: selectedRows,
            propertyName: type === 'gift' ? "isSentGift" : "isSentReport"
        };
    
        updateSelectedStudyParticipants(dataToSend);
    };

    // Update selected study participants
    async function updateSelectedStudyParticipants(data) {
        setLoading(true);
        try {
            await toggleStudyParticipantsProperty(data);
        } catch (error) {
            console.error("Error changing selected participants:", error);
        } finally {
            setLoading(false);
        }
    }

    // Reorder rows based on selection
    const reorderRowsBasedOnSelection = (rows, selectedRows) => {
        return [...rows].sort((a, b) => {
          const aIsSelected = selectedRows.includes(a._id);
          const bIsSelected = selectedRows.includes(b._id);
          
          if (aIsSelected && bIsSelected) return 0; // both rows are selected, keep existing order
          if (aIsSelected) return -1; // a is selected, b is not, a should come first
          if (bIsSelected) return 1; // b is selected, a is not, b should come first
          return 0; // neither is selected, keep existing order
        });
      };

    const columns = [
        { 
            field: 'serialNum', 
            headerName: 'Serial No.', 
            flex: 1.5,
            headerAlign: 'center',
            align: 'center',
            valueGetter: (params) => params.row.serialNum,
            valueFormatter: (params) => {
                if (studyInfo && studyInfo.studyCode) {
                    return combineCodeSerialNum(studyInfo.studyCode, params.value);
                }
                return params.value;
            }
        },
        { 
            field: 'email', 
            headerName: 'Email', 
            flex: 3, 
            headerAlign: 'center',
            align: 'center',
            valueGetter: (params) => params.row.participantInfo.email,
            renderCell: (params) => (
                <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    overflow: 'hidden',
                    flexWrap: 'wrap',
                    wordBreak: 'break-all'
                }}>
                    <a href={`mailto:${params.value}`} style={{ padding: '8px' }}>
                    {params.value}
                    </a>
                </div>
            )
        },
        { 
            field: 'status', 
            headerName: type === 'gift' ? 'Sent Gift' : 'Sent Report', 
            flex: 1, 
            headerAlign: 'center',
            align: 'center',
            valueGetter: (params) => params.row.status, 
            renderCell: (params) => (
                <CustomCheckbox 
                    checked={params.value} 
                    onChange={() => handleToggleSentStatus(params.row._id)} 
                />
            )
        }
    ];

    const rows = studyParticipants.filter(shouldIncludeParticipant).map(participant => {
        return {
            _id: participant._id,
            serialNum: participant.serialNum,
            participantInfo: {email: participant.participantInfo.email},
            status: getCheckboxState(participant),
        };
    });

    return (
        <div>

            <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
                <Box marginLeft={8} marginRight={8}>
                    <DialogTitle align="center">
                        <Typography variant="h5" color="primary" style={{ marginBottom: '20px'}}><strong>{getTitle()}</strong></Typography>
                    </DialogTitle>

                    <DialogContent style={{ maxHeight: '80vh', overflowY: 'auto' }}>
                        {rows.length > 0 && 
                            <EmailInputComponent 
                                rows={rows}
                                setSelectedRows={setSelectedRows}
                                inputEmails={inputEmails}
                                setInputEmails={setInputEmails}
                            />
                        }
                        <Box height='35px'>
                            {selectedRows.length > 0 && 
                                <Button style={{ 
                                            maxHeight: '20px',
                                            minWidth: '30px',
                                            fontSize: '10px',
                                        }} 
                                        variant="outlined" 
                                        onClick={handleToggleSelectedRows}
                                >Toggle Selected Rows</Button>
                            }
                        </Box>
                        <Box height="60vh">
                            <StyledDataGrid
                                loading={loading}
                                rows={reorderRowsBasedOnSelection(rows, selectedRows)}
                                columns={columns}
                                getRowId={(row) => row._id}
                                initialState={{
                                    pagination: { 
                                        paginationModel:  
                                        { pageSize: 100 } 
                                    },
                                }}
                                onRowSelectionModelChange={(newRowSelectionModel) => {
                                console.log('newSelection', newRowSelectionModel);
                                setSelectedRows(newRowSelectionModel);
                                }}
                                rowSelectionModel={selectedRows}
                                slots={{
                                    noRowsOverlay: CustomNoRowsOverlay,
                                }}
                                pageSizeOptions={[25, 50, 100, 200, 500]}
                                checkboxSelection={true}  
                                disableRowSelectionOnClick
                            />
                        </Box>
                    </DialogContent>

                    <DialogActions>
                        <Box marginRight={8}>
                            <Button variant="contained" color="primary" size="small" onClick={handleOpenMailingList} startIcon={<MailOutlineIcon />}>
                                Show Mailing List
                            </Button>
                            <MailingList context={StudyParticipantContext} selectedRows={selectedRows} open={openMailingList} onClose={handleCloseMailingList}/>
                        </Box>
                        <Button variant="contained" color="primary" size="small" onClick={onClose}>
                            Close
                        </Button>
                    </DialogActions>
                </Box>
            </Dialog>
        </div>
    );
}