import * as React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { SessionContext } from '../../providers/SessionContextProvider';
import { DataGrid, GridToolbar  } from '@mui/x-data-grid';
import {styled} from '@mui/material/styles'
import SessionParticipantList from './SessionParticipantList';

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
    '& .MuiDataGrid-columnHeader': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white,
      fontWeight: 'bold',
      fontSize: 15,
    },
    '& .MuiDataGrid-columnHeaderTitle': {
        whiteSpace: 'pre-line',
        lineHeight: '1.4',
        textAlign: 'center'
    },
    '& .MuiDataGrid-cell:focus': {
        outline: 'none'
    }
  }));

export default function SessionArchive() {

    const scroll ='paper';
    const [open, setOpen] = React.useState(false);
    const { sessions } = React.useContext(SessionContext);
    const archivedSessions = sessions.filter(function(item) {return item.isArchive === true});

    const columns = [
        { field: 'sessionCode', headerName: 'Session Code', width: 180, headerAlign: 'center', align:'center'},
        { field: 'date', headerName: 'Date', width: 180, headerAlign: 'center', align:'center', valueGetter: (params) => (params.value.slice(0,10)) },
        { field: 'time', headerName: 'Time', width: 180, headerAlign: 'center', align:'center'},
        { field: 'location', headerName: 'Location', width: 200, headerAlign: 'center', align:'center'},
        { field: 'participantNum', headerName: 'Participant Number', width: 180, headerAlign: 'center', align:'center' },
        { field: '_id', headerName: 'Participant List', width: 230, headerAlign: 'center', align:'center', renderCell: (params) => (<Button variant="contained"><SessionParticipantList targetSessionId={params.value}/></Button>)},
    ]

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };


    return(
        <div>
            <Button variant="contained" onClick={handleClickOpen} sx={{marginLeft: 3}}>Archived Sessions</Button>
            <Dialog
                open={open}
                onClose={handleClose}
                scroll={scroll}
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"
                maxWidth="lg"
                fullWidth      
            >
                <DialogTitle id="scroll-dialog-title">View Archived Sessions</DialogTitle>
                <DialogContent dividers={scroll === 'paper'}>
                    <StyledDataGrid
                        sx={{
                            marginTop: 2,
                            '&.MuiDataGrid-root--densityCompact .MuiDataGrid-cell': { py: '8px' },
                                '&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell': { py: '15px' },
                                '&.MuiDataGrid-root--densityComfortable .MuiDataGrid-cell': { py: '22px' }
                        }}
                        getRowId={(row) => row._id}
                        rows={archivedSessions}
                        columns={columns}
                        initialState={{
                            pagination: {
                            paginationModel: { page: 0, pageSize: 10 },
                            },
                        }}
                        pageSizeOptions={[10, 25, 50]}
                        slots={{
                            toolbar: GridToolbar
                        }}
                        disableSelectionOnClick
                        hideFooterSelectedRowCount
                    />
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" onClick={handleClose} sx={{marginLeft: 1}}>Close</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}