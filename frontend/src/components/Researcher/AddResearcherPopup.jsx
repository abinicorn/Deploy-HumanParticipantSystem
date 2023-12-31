import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { StudyResearcherContext } from '../../providers/StudyResearcherContextProvider';
import { checkEmailValidation } from '../../utils/checkEmailValidation';


export default function AddResearcherPopup() {

    const{ studyInfo, addResearcher } = React.useContext(StudyResearcherContext);

    const [open, setOpen] = React.useState(false);
    const [firstName, setFirstName] = React.useState('');
    const [lastName, setLastName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [username, setUsername] = React.useState('');



    const handleClose = () => {
        setOpen(false);
    };

    

    const handleAdd = async () => {
        if (!firstName || !lastName || !email) {
            alert("Please fill in all required fields.");
            return;
        }

        if (!checkEmailValidation(email)) {
            alert("Please enter a valid email address.");
            return;
        }
        const response= await addResearcher({ firstName, lastName, email });
        if(response){
            setUsername(response.username);
            alert(`The researcher has been added! Username is ${response.username}, the default password is 123456`);
            handleClose();
        }
    };


    const handleAddClick = () => {
        setOpen(true);
        setEmail('');
    }


    return (
        <div>
        <Button variant="outlined" onClick={handleAddClick}> Add New Researcher</Button>


        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Add New Reseracher to the System</DialogTitle>
            <DialogContent>
            <DialogContentText>
                Please enter the full name and the email address:
            </DialogContentText>
            <TextField
                required
                autoFocus
                margin="dense"
                id="firstName"
                label="First Name"
                inputProps={{ 'data-testid': 'First Name' }}
                type="text"
                fullWidth
                variant="standard"
                onKeyDown = {(e) => {
                    e.stopPropagation();
                    }}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
            />
            <TextField
                required
                autoFocus
                margin="dense"
                id="lastName"
                label="Last Name"
                inputProps={{ 'data-testid': 'Last Name' }}
                type="text"
                fullWidth
                variant="standard"
                onKeyDown = {(e) => {
                    e.stopPropagation();
                    }}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
            />
            <TextField
                required
                autoFocus
                margin="dense"
                id="emailAddress"
                label="Email Address"
                inputProps={{ 'data-testid': 'Email Address' }}
                type="email"
                fullWidth
                variant="standard"
                onKeyDown = {(e) => {
                    e.stopPropagation();
                    }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            </DialogContent>
            <DialogActions>
            <Button onClick={handleAdd} variant="contained">Add</Button>
            <Button onClick={handleClose} variant="contained">Cancel</Button>
            </DialogActions>
        </Dialog>
        </div>
    );
}
