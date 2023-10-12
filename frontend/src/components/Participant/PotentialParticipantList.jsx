import React, {useContext} from 'react';
import {Chip} from '@mui/material';

import { PotentialParticipantContext } from '../../providers/PotentialParticipantProvider';

import { CustomPagination } from '../../styles/CustomPagination';
import { CustomNoRowsOverlay } from '../../styles/CustomNoRowsOverlay';
import { StyledDataGrid } from '../../styles/StyledDataGrid';

export default function PotentialParticipantList() {

    const {studyParticipants, selectedRows, setSelectedRows, loading} = useContext(PotentialParticipantContext);

    // put selected row to the top of the table
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
            field: 'email', 
            headerName: 'Email', 
            flex: 3, 
            headerAlign: 'center',
            align: 'center',
            valueGetter: (params) => params.row.email,
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
            field: 'tags', 
            headerName: 'Tags', 
            flex: 2, 
            headerAlign: 'center',
            align: 'center',
            valueGetter: (params) => {
                const sortedTags = [...params.row.tag].sort();
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
        }
    ];

    return (
            <StyledDataGrid
                sx={{
                    overflowX: 'hidden',
                    overflowY: 'hidden',
                    '&.MuiDataGrid-root--densityCompact .MuiDataGrid-cell': { py: '1px' },
                    '&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell': { py: '8px' },
                    '&.MuiDataGrid-root--densityComfortable .MuiDataGrid-cell': { py: '15px' },
                }} 
                // autoHeight
                rows={reorderRowsBasedOnSelection(studyParticipants, selectedRows)}
                // rows={Array.isArray(studyParticipants) ? studyParticipants : []}
                columns={columns}
                loading={loading}

                // adjust row height by num of tags in each row
                getRowHeight={(params) => {
                    const dpr = window.devicePixelRatio || 1; // get pixel ratio of client
                    const tagsCount = params.model.tag.length;
                    const baseHeight = 40;
                    const extraHeightPerThreeTags = 20;
                    let ratio;
                
                    // set how many tags contained in base height
                    if (dpr <= 1) { // pixel ratio below 100%
                        ratio = 8;
                    } else { // pixel ratio over than 100%
                        ratio = 5;
                    }
  
                    if(tagsCount <= ratio) return baseHeight;
                    return baseHeight + Math.ceil(tagsCount / ratio - 1) * extraHeightPerThreeTags;
                  }}
                getRowId={(row) => row._id}
                density="compact"
                initialState={{
                    pagination: { 
                        paginationModel:  
                        { pageSize: 100 } 
                    },
                }}
                onRowSelectionModelChange={(newRowSelectionModel) => {
                  setSelectedRows(newRowSelectionModel);
                }}
                rowSelectionModel={selectedRows}
                slots={{
                    pagination: CustomPagination,
                    noRowsOverlay: CustomNoRowsOverlay,
                }}
                pageSizeOptions={[25, 50, 100]}
                checkboxSelection={true}          
                disableRowSelectionOnClick
            />
    )
}