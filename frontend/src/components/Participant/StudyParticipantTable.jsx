import React, {useState, useContext} from 'react';
import {Chip, Typography, Box, Button} from '@mui/material';
import {GridToolbar} from '@mui/x-data-grid';

import EditParticipant from './EditParticipant';
import CloseCircleButton from '../Button/CloseCircleButton';
import OptionDialog from '../Popup/OptonDialog';

import { combineCodeSerialNum } from '../../utils/combineCodeSerialNum';
import { StudyParticipantContext } from '../../providers/StudyPaticipantsProvider';
import { StudyResearcherContext } from '../../providers/StudyResearcherContextProvider';
import { DataGridContext } from '../../providers/DataGridProvider';

import { CustomPagination } from '../../styles/CustomPagination';
import { CustomNoRowsOverlay } from '../../styles/CustomNoRowsOverlay';
import { StyledDataGrid } from '../../styles/StyledDataGrid';

import '../../styles/DataGrid.css';


export default function ParticipantsTable() {

  // Get status and methods from context
    const {studyParticipants, tags, finalUpdateStudyParticipant, toggleStudyParticipantsProperty, 
          toggleParticipantsProperty, handleAddTagToSelectedRows, handleRemoveTagFromSelectedRows,
          isAnonymous, selectedRows, setSelectedRows, loading, setLoading, setStudyParticipantNotActive
    } = useContext(StudyParticipantContext);
    const {
      sortModel, setSortModel,
      filterModel, setFilterModel,
      pageModel, setPageModel,
      columnVisibility, setColumnVisibility
    } = useContext(DataGridContext);  
    const {studyInfo} = useContext(StudyResearcherContext);

    //Initialize local state
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [newTag, setNewTag] = useState('');

    // Define the style of the grid based on the number of participants
    const gridStyle = studyParticipants.length === 0
    ? { height: '55vh',
  }
    : { height: '100%',
  };

  // Function to update participant information
    const handleUpdateParticipant = async (updatedParticipant) => {
      const response = await finalUpdateStudyParticipant(updatedParticipant);
      return response;
    };

    // Function to delete participants
    const handleDelete = async (studyParticipant) => {
        const response = await setStudyParticipantNotActive(studyParticipant)
        console.log(response);
    };
    
    const [selectedProperty, setSelectedProperty] = useState("");

    // store the toogle property selected by user
    const handlePropertyChange = (event) => {
      setSelectedProperty(event.target.value);
    };

    // multiple update boolean value
    const handleToggleSelectedRows = () => {
      const updatedParticipants = studyParticipants.filter(participant => selectedRows.includes(participant._id))
      .map(participant => {
        if (selectedProperty) {
          if (selectedProperty === "isWillContact") {
            return {
              ...participant,
              participantInfo: {
                ...participant.participantInfo,
                isWillContact: !participant.participantInfo.isWillContact,
              },
            };
          } else {
            return {
              ...participant,
              [selectedProperty]: !participant[selectedProperty],
            };
          }
        }
        return participant;
      });

      const dataToSend = assembleData(updatedParticipants, selectedProperty);
      console.log(dataToSend);

      updateToggleStudyParticipants(dataToSend, selectedProperty)
    };

    //Function to combine data
    function assembleData(participants, property) {
      if (property  === "isWillContact") {
        const ids = participants.map(participant => participant.participantInfo._id);
        return {
          ids: ids,
          propertyName: property
        };

      } else {
        const ids = participants.map(participant => participant._id);
        return {
          ids: ids,
          propertyName: property
        };
      }
    }

    async function updateToggleStudyParticipants(participants, property) {
      if (property  === "isWillContact") {
        await toggleParticipantsProperty(participants)
      } else {
        await toggleStudyParticipantsProperty(participants);
      }
    }

    const handleDeleteSelectedRows = () => {
      const dataToSend = {
          ids: selectedRows,
          propertyName: "isActive"
      };
  
      deleteSelectedStudyParticipants(dataToSend);
  };
  
  async function deleteSelectedStudyParticipants(data) {
      try {
          await toggleStudyParticipantsProperty(data);
      } catch (error) {
          console.error("Error deleting selected participants:", error);
      }
  }

  // put selected rows to the top of the table
  // Achieved by changing the weight of sorting, then resorting
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
  

  // Define the basic structure of the column
    let baseColumns = [
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
      }
    ];

    //Add or delete some columns based on whether they are anonymous or not
    if (!isAnonymous) {
      baseColumns = [
          ...baseColumns,
          { 
            field: 'name', 
            headerName: 'Name', 
            flex: 1.5,
            headerAlign: 'center',
            align: 'center',
            valueGetter: (params) => {
              const firstName = params.row.participantInfo?.firstName || "";
              const lastName = params.row.participantInfo?.lastName || "";
          
              return `${firstName} ${lastName}`.trim();
            }
          }
      ];
    };

    // Define the basic structure of the column
    baseColumns = [
      ...baseColumns,
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
      }
    ];

    //Add or delete some columns based on whether they are anonymous or not
    if (!isAnonymous) {
      baseColumns = [
          ...baseColumns,
          { 
            field: 'phoneNum', 
            headerName: 'Phone\nNumber', 
            flex: 1.5,
            headerAlign: 'center',
            align: 'center',
            valueGetter: (params) => `${params.row.participantInfo.phoneNum}`
          }
      ];
    };
    
    // Define the whole structure of the column
    const columns = [
        ...baseColumns,
        { 
            field: 'isComplete', 
            headerName: 'Status', 
            flex: 1, 
            headerAlign: 'center',
            align: 'center',
            valueGetter: (params) => params.row.isComplete ? 'Completed' : 'Processing', 
            renderCell: (params) => params.row.isComplete ? 
                <Chip label="Completed" color="success" size="small"/> : 
                <Chip label="Processing" color="success" variant="outlined" size="small" /> 
        },
        { 
            field: 'isGift', 
            headerName: 'Gift', 
            flex: 1, 
            headerAlign: 'center', 
            align: 'center',
            valueGetter: (params) => params.row.isGift ? 'Yes' : 'No', 
            renderCell: (params) => {
                return params.row.isGift ? 
                    <Typography variant="body1" style={{ color: 'green', fontWeight: 'bold' }}>Yes</Typography> : 
                    <Typography variant="body1" style={{ color: 'red', fontWeight: 'bold' }}>No</Typography>;
            }
        },
        { 
            field: 'isWIllReceiveReport', 
            headerName: 'Report\nRequested', 
            flex: 1.2, 
            headerAlign: 'center',
            align: 'center',
            valueGetter: (params) => params.row.isWIllReceiveReport ? 'Yes' : 'No',
            renderCell: (params) => {
                return params.row.isWIllReceiveReport ? 
                    <Typography variant="body1" style={{ color: 'green', fontWeight: 'bold' }}>Yes</Typography> : 
                    <Typography variant="body1" style={{ color: 'red', fontWeight: 'bold' }}>No</Typography>;
            }
        },
        { 
            field: 'isWillContact', 
            headerName: 'Future\nContact', 
            flex: 1, 
            headerAlign: 'center',
            align: 'center',
            valueGetter: (params) => params.row.participantInfo.isWillContact ? 'Yes' : 'No',
            renderCell: (params) => {
                return params.row.participantInfo.isWillContact ? 
                    <Typography variant="body1" style={{ color: 'green', fontWeight: 'bold' }}>Yes</Typography> : 
                    <Typography variant="body1" style={{ color: 'red', fontWeight: 'bold' }}>No</Typography>;
            }
        },
        { 
            field: 'tags', 
            headerName: 'Tags', 
            flex: 2, 
            headerAlign: 'center',
            align: 'center',
            valueGetter: (params) => {
                const sortedTags = [...params.row.participantInfo.tagsInfo].sort();
                return sortedTags.join(', ');
            },
            renderCell: (params) => {
              // Split tags from value
              const tags = params.value ? params.value.split(', ').filter(tag => tag) : [];
              return (
                  <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      overflow: 'hidden',
                      flexWrap: 'wrap'
                  }}>
                      {tags.map((tag, index) => (
                          <Chip key={index} label={tag} size="small" style={{ marginRight: '2px', marginTop: '2px', marginBottom: '2px' }} />
                      ))}
                  </div>
              );
            }
        },
        {
            field: 'note',
            headerName: 'Note',
            headerAlign: 'center',
            align: 'center',
            valueGetter: (params) => params.row.note,
            flex: 3,
            wrapText: true
        },
        {
            field: 'edit', 
            headerName: 'Edit', 
            flex: 1, 
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) => (
                <EditParticipant 
                    participant={params.row} 
                    onSave={handleUpdateParticipant}
                    isAnonymous={isAnonymous}
                    allTags={tags}
                />
            )
        },
        {
            field: 'delete',
            headerName: 'Delete',
            flex: 1, 
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) => (
                <CloseCircleButton 
                    popupText={'Are you sure you want to delete this participant?'}
                    onClick={() => handleDelete(params.row)} 
                    size='25px'/>
            )
        }
    ];

    return (
      <div style={gridStyle} >
  
          <Box mb={1} display='flex' justifyContent='space-between' height="35px"  alignItems='center'>
            {selectedRows.length > 0 && 
              <>
                <div style={{ display: 'flex', alignItems: 'flex-end'}}>
                  <select value={selectedProperty} onChange={handlePropertyChange}>
                    <option value="">Select a property</option>
                    <option value="isComplete">Status</option>
                    <option value="isGift">Gift</option>
                    <option value="isWIllReceiveReport">Report Requested</option>
                    <option value="isWillContact">Future Contact</option>
                  </select>
                    <Button style={{ 
                        maxHeight: '20px',
                        minWidth: '30px',
                        fontSize: '10px',
                        }} 
                        variant="outlined" 
                        onClick={handleToggleSelectedRows}
                      >Toggle Selected Rows</Button>


                </div>
                <div style={{display: 'flex', alignItems: 'flex-end'}}>
                  <input 
                    type="text" 
                    value={newTag} 
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="New Tag"
                    list="tags-datalist"
                  />
                  <datalist id="tags-datalist">
                    {tags.map((tag, index) => (
                      <option key={index} value={tag.tagName} />
                    ))}
                  </datalist>
                <Button 
                  style={{ 
                    maxHeight: '20px',
                    minWidth: '30px',
                    fontSize: '10px',
                    }} 
                  variant="outlined"
                  onClick={() => handleAddTagToSelectedRows(newTag)}
                  >  Add Tag to Selected Rows </Button>

                <Button 
                  style={{ 
                    maxHeight: '20px',
                    minWidth: '30px',
                    fontSize: '10px',
                    }} 
                  variant="outlined"
                  color='error'
                  onClick={() => handleRemoveTagFromSelectedRows(newTag)}
                  >  Delete Tag from Selected Rows </Button>

                </div>
                <Button 
                  variant="outlined"
                  color='error'
                  size='small'
                  onClick={() => setDeleteDialogOpen(true)}>
                    Delete Selected Participants
                </Button>
                <OptionDialog 
                  open={deleteDialogOpen} 
                  onClose={() => setDeleteDialogOpen(false)}
                  popupText="This action will delete the selected StudyParticipants. Are you sure you want to proceed?"
                  onClick={() => {
                      handleDeleteSelectedRows();
                      setDeleteDialogOpen(false);
                  }}
                  />
                </>
              }
            </Box>

            <StyledDataGrid
                sx={{
                    overflowX: 'hidden',
                    overflowY: 'hidden',
                    '&.MuiDataGrid-root--densityCompact .MuiDataGrid-cell': { py: '1px' },
                    '&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell': { py: '8px' },
                    '&.MuiDataGrid-root--densityComfortable .MuiDataGrid-cell': { py: '15px' },
                }} 

                rows={reorderRowsBasedOnSelection(studyParticipants, selectedRows)}

                columns={columns}
                loading={loading}

                // adjust row height by num of tags in each row
                getRowHeight={(params) => {
                  const dpr = window.devicePixelRatio || 1; // get pixel ratio of client
                  const tagsCount = params.model.participantInfo.tagsInfo.length;
                  const baseHeight = 40;
                  const extraHeightPerThreeTags = 20;
                  let ratio;
              
                  // set how many tags contained in base height
                  if (dpr <= 1) { // pixel ratio below 100%
                      ratio = 3;
                  } else { // pixel ratio over than 100%
                      ratio = 2;
                  }

                  if(tagsCount <= ratio) return baseHeight;
                  return baseHeight + Math.ceil(tagsCount / ratio - 1) * extraHeightPerThreeTags;
                }}
            
                getRowId={(row) => row._id}
                paginationModel={pageModel}
                density="compact"
                columnVisibilityModel={columnVisibility}
                initialState={{
                    columns: {
                        columnVisibilityModel: {
                          // Hide columns status and traderName, the other columns will remain visible
                          note: false,
                          delete: false
                        },
                      },
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
                pagination
                slots={{
                    pagination: CustomPagination,
                    noRowsOverlay: CustomNoRowsOverlay,
                    toolbar: GridToolbar
                }}
                pageSizeOptions={[25, 50, 100]}
                checkboxSelection={true}

                onSortModelChange={(newModel) => {
                  setSortModel(newModel);
                }}
                sortModel={sortModel}
                onFilterModelChange={(newModel) => {
                    setFilterModel(newModel);
                }}
                filterModel={filterModel}

                onPaginationModelChange={(newModel) => {
                  setPageModel(newModel);
                }}
                onColumnVisibilityModelChange={(newModel) => {
                    setColumnVisibility(newModel);
                }}
            
                disableRowSelectionOnClick

            />
        </div>

    )
}