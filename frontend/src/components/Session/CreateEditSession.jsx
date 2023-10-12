import * as React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Box, TextField, Typography, 
  Grid, List, Card, CardHeader, ListItem, ListItemText, ListItemIcon, Checkbox, Divider } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useParams } from 'react-router-dom';
import ConfirmPopup from '../Popup/ConfirmPopup';
import OptionPopup from '../Popup/OptionPopup';
import { SessionContext } from '../../providers/SessionContextProvider';
import { combineCodeSerialNum } from '../../utils/combineCodeSerialNum';
import { StudyResearcherContext } from '../../providers/StudyResearcherContextProvider';
import { StudyParticipantContext } from '../../providers/StudyPaticipantsProvider';

function not(a, b) {
  return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a, b) {
  return a.filter((value) => b.indexOf(value) !== -1);
}

function union(a, b) {
  return [...a, ...not(b, a)];
}

export default function CreateEditSession({create, targetSessionId}) {
  
  const scroll ='paper';
  const { studyInfo } = React.useContext(StudyResearcherContext);
  const { studyParticipants } = React.useContext(StudyParticipantContext);
  const { sessions, addSession, updateSession, refreshSession} = React.useContext(SessionContext);
  const targetSession = sessions.find(s => s._id === targetSessionId);
  const studyId = useParams();
  const [sessionContent, setSessionContent] = React.useState({
    studyId: studyId,
    sessionCode: '',
    date:'', 
    time:'', 
    location:'',
    note: '', 
    participantNum: 0,
    isArchive: 'false'
  })

  const [open, setOpen] = React.useState(false);
  const [checked, setChecked] = React.useState([]);
  const [left, setLeft] = React.useState([]);
  const [right, setRight] = React.useState([]);

  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const numberOfChecked = (items) => intersection(checked, items).length;

  const handleToggleAll = (items) => () => {
    if (numberOfChecked(items) === items.length) {
      setChecked(not(checked, items));
    } else {
      setChecked(union(checked, items));
    }
  };

  const handleCheckedRight = () => {
    setRight(right.concat(leftChecked))
    setLeft(not(left, leftChecked));
    setChecked(not(checked, leftChecked));
  };
  
  const handleCheckedLeft = () => {
    setLeft(left.concat(rightChecked));
    setRight(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
  };

  // Generate random number for session code  
  const generateRandomNum = (min, max) => {
    return Math.round(Math.random()*(max-min)+min)
  }

  // Check if session code is duplicated
  const sessionCodeIsDuplicate = (code, list) => {
    return list.includes(code);
  }

  // Generate unique session code
  const generateUniqueCode = () => {
    
    let randomNum; 
    let randomSessionCode;
    let sessionCodeList = [];
    for (let index = 0; index < sessions.length; index++) {
      sessionCodeList.push(sessions[index].sessionCode);
    }

    do {
      randomNum = generateRandomNum(999, 99999);
      randomSessionCode = `SE${randomNum.toString()}`
    } while (sessionCodeIsDuplicate(randomNum, sessionCodeList))
    
    return randomSessionCode;

  }
  
  // Handle session input change
  const handleSessionChange = (e) => {
    setSessionContent({...sessionContent, [e.target.name]: e.target.value})
  }

  // Handle click open the create new session
  const handleNewClickOpen = () => {
    setSessionContent({
      studyId: studyId,
      sessionCode: '',
      date:'', 
      time:'', 
      location:'',
      note: '', 
      participantNum: 0,
    isArchive: 'false'
    })
    setRight([])
    if(studyParticipants) {
      studyParticipants.sort((a,b) => a.serialNum - b.serialNum);
      setLeft(studyParticipants);
    }
    setOpen(true);
  };

  // Handel click open the edit session
  const handleEditClickOpen = () => {
    
    setSessionContent({
      _id: targetSession._id,
      studyId: targetSession.studyId,
      sessionCode: targetSession.sessionCode,
      date: targetSession.date, 
      time: targetSession.time, 
      location: targetSession.location,
      note: targetSession.note, 
      participantNum: targetSession.participantNum,
    })

    let editParticipantList =[]
    if(studyParticipants) {
      editParticipantList = studyParticipants.reduce(
        (result, item) =>
        targetSession.participantList.some(el => el._id === item.participantInfo._id)
            ? [...result, item]
            : result,
        []
      );
      editParticipantList.sort((a,b) => a.serialNum - b.serialNum)
    }
    setRight(editParticipantList);
    
    let editStudyParticipantList = []
    if(studyParticipants) {
      editStudyParticipantList = studyParticipants.filter(function(el) {return !editParticipantList.includes(el)});
      editStudyParticipantList.sort((a,b) => a.serialNum - b.serialNum)
    }
    setLeft(editStudyParticipantList);
    setOpen(true);
  };
  
  const handleClose = () => {
    setOpen(false);
  };

  // Handle create a new session after clicking the SAVE button
  const handleCreate = () => {
    
    if (!sessionContent.date|| !sessionContent.participantNum) {
      alert("Please fill in all required fields.");
      return
    }

    const newSessionCode = generateUniqueCode();
    sessionContent['sessionCode'] = newSessionCode

    let participantInfo = []
    for (let index = 0; index < right.length; index++) {
      participantInfo.push(right[index].participantInfo);
    }
    sessionContent.participantList = participantInfo;

    const newSession = addSession(sessionContent);
    console.log(newSession);
    refreshSession();
    return true //For ConfirmPopup
  };

  // Handle update a session after clicking the SAVE button
  const handleUpdate = () => {
    let updatedParticipantInfo = []
    for (let index = 0; index < right.length; index++) {
      updatedParticipantInfo.push(right[index].participantInfo);
    }
    sessionContent.participantList = updatedParticipantInfo;
    const updatedSession = updateSession(sessionContent);
    console.log(updatedSession);
    refreshSession();
    return true //For ConfirmPopup
  }

  React.useEffect(() => {
    //console.log(right)
    //console.log(left)
  }, [right])

  // Layout for the participant list
  const customList = (title, items) => (
    <Card>
      <CardHeader
        sx={{ px: 2, py: 1 }}
        avatar={
          <Checkbox
            onClick={handleToggleAll(items)}
            checked={numberOfChecked(items) === items.length && items.length !== 0}
            indeterminate={
              numberOfChecked(items) !== items.length && numberOfChecked(items) !== 0
            }
            disabled={items.length === 0}
            inputProps={{
              'aria-label': 'all items selected',
            }}
          />
        }
        title={title}
        subheader={`${numberOfChecked(items)}/${items.length} selected`}
      />
      <Divider />
      <List
        sx={{
          width: 400,
          height: 230,
          bgcolor: 'background.paper',
          overflow: 'auto',
        }}
        dense
        component="div"
        role="list"
      >
        {items.map((value) => {
          const labelId = `transfer-list-all-item-${value.participantId}-label`;

          return (
            <ListItem
              key={value._id}
              role="listitem"
              onClick={handleToggle(value)}             
            >
              <ListItemIcon>
                <Checkbox
                  checked={checked.indexOf(value) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{
                    'aria-labelledby': labelId,
                  }}
                />
              </ListItemIcon>
                <ListItemText id={labelId} 
                  primary = {`Serial Number: ${combineCodeSerialNum( studyInfo.studyCode, value.serialNum)}`}
                  secondary =  {`Email: ${value.participantInfo.email}`}
                />
            </ListItem>
          );
        })}
      </List>
    </Card>
  );

  return (
    <div>      
      {create ? <Button variant="contained" startIcon={<AddIcon />} onClick={handleNewClickOpen}>New Session</Button> 
              : <Typography textAlign="center" onClick={handleEditClickOpen}>Edit Session</Typography>}
      <Dialog
        open={open}
        onClose={handleClose}
        scroll={scroll}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        maxWidth="lg"
        fullWidth     
      >
        <DialogTitle id="scroll-dialog-title">{create ? 'Create New Session' : `Edit Session (Session Code: ${targetSession ? targetSession.sessionCode: null})`}</DialogTitle>
        <DialogContent dividers={scroll === 'paper'}>
          <Box 
            component="form"
            noValidate
            autoComplete="off"
            display={'flex'}
            flexDirection={'row'}
          >
            <Box display={'flex'} flexDirection={'column'} sx={{marginLeft: 15, marginRight: 5}}>
              <h3 style={{margin: 0}}>Date</h3>
              <TextField required id="outlined-required" type="date" name="date" variant="outlined" margin="normal" onChange={handleSessionChange} value={sessionContent.date.slice(0, 10)}/>
              <h3 style={{margin: 0, marginTop:5}}>Time</h3>
              <TextField id="outlined-required" type='time' name="time" variant="outlined" margin="normal" onChange={handleSessionChange} value={sessionContent.time}/>
              <h3 style={{margin: 0, marginTop:5}}>Location/Online Link</h3>
              <TextField id="outlined-required" name="location" variant="outlined" margin="normal" onChange={handleSessionChange} value={sessionContent.location}/>
              <h3 style={{margin: 0, marginTop:5}}>Expected number of Participants</h3>
              <TextField required id="outlined-required" name="participantNum" variant="outlined" margin="normal" onChange={handleSessionChange} value={sessionContent.participantNum}/>
              <h3>Participant List</h3>
              <Box display={'flex'} flexDirection={'row'} >
                <Grid container spacing={2} justifyContent="center" alignItems="center">
                  <Grid item>{customList('Participant Choices', left)}</Grid>
                  <Grid item>
                    <Grid container direction="column" alignItems="center">
                      <Button
                        sx={{ my: 0.5 }}
                        variant="outlined"
                        size="small"
                        onClick={handleCheckedRight}
                        disabled={leftChecked.length === 0}
                        aria-label="move selected right"
                      >
                        &gt;
                      </Button>
                      <Button
                        sx={{ my: 0.5 }}
                        variant="outlined"
                        size="small"
                        onClick={handleCheckedLeft}
                        disabled={rightChecked.length === 0}
                        aria-label="move selected left"
                      >
                        &lt;
                      </Button>
                    </Grid>
                  </Grid>
                  <Grid item>{customList('Chosen Participants', right)}</Grid>
                </Grid>
              </Box>
              <h3 style={{margin: 0, marginTop:10}}>Notes</h3>
              <TextField
                fullWidth
                id="outlined-multiline-static"
                label="Write your notes here"
                name="note"
                value={sessionContent.note}
                onChange={handleSessionChange}
                multiline
                rows={5}
                variant="outlined"
                margin="dense"
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <ConfirmPopup 
            buttonText={'Save'} 
            popupText={create ? `Session ${sessionContent.sessionCode} created!`: `Session ${targetSession ? targetSession.sessionCode: null} changes saved!`}
            onClick={create ? handleCreate : handleUpdate} 
            onConfirm={handleClose} sx={{marginRight: 5}}/>
          <OptionPopup 
            buttonText={'Cancel'} 
            popupText={'Do you want to cancel?'} 
            onClick={handleClose}/>
        </DialogActions>
      </Dialog>
    </div>
  );
}
