import React, {useState} from "react";
import {
    Box,
    Button,
    Container,
    Typography,
    Grid,
    TextField,
    Paper,
    CssBaseline,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Fade, Alert
} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {useCurrentUser} from "../hooks/useCurrentUser";
import Navbar from "../components/Common/Navbar";
import {request} from "../utils/request";
export default function ResearcherProfilePage() {

    const {user} = useCurrentUser();


    const [currentUserInfo, setCurrentUserInfo] = useState({
        currentFirstName: user.firstName,
        currentLastName: user.lastName,
        currentEmail: user.email
    })

    const handleFirstNameChange = (event) => {
        setCurrentUserInfo((prevUserInfo) => ({
            ...prevUserInfo,
            currentFirstName: event.target.value,
        }));
    }

    const handleLastNameChange = (event) => {
        setCurrentUserInfo((prevUserInfo) => ({
            ...prevUserInfo,
            currentLastName: event.target.value,
        }));
    }

    const [isEmailUpdate, setIsEmailUpdate] = useState(false);

    const handEmailChange = (event) => {

        setIsEmailUpdate(currentUserInfo.currentEmail !== event.target.value);
        setCurrentUserInfo((prevUserInfo) => ({
            ...prevUserInfo,
            currentEmail: event.target.value,
        }));
    }


    const updateInfo = async () => {
        const url = '/researcher/update/info';
        let req;

        if (isEmailUpdate){
            const isEmailExist = await checkEmailExist(currentUserInfo.currentEmail);

            if (isEmailExist) {
                alert('This email is existed, please try another one!');
                return;
            }


            req = {
                firstName: currentUserInfo.currentFirstName,
                lastName: currentUserInfo.currentLastName,
                id: user.userId
            }
        } else {
            req = {
                firstName: currentUserInfo.currentFirstName,
                lastName: currentUserInfo.currentLastName,
                email: currentUserInfo.currentEmail,
                id: user.userId
            }
        }



        request.put(url, req)
            .then(response => {
                alert(response.data.message);
            })
            .catch(error => {
                console.error('Error updating user info', error);
            });

    }

    // Email is unique in database
    const checkEmailExist = async (email) => {

            const res = await request.get(`/researcher/email/${email}`);

            return res.status === 200;

    };


    const navigate = useNavigate();
    const handleButtonClick = () => {
        navigate('/homepage')
    };



    const [open, setOpen] = useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const handleOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    };

    const handleOldPasswordChange = (event) => {
        setOldPassword(event.target.value);
    };

    const handleNewPasswordChange = (event) => {
        setNewPassword(event.target.value);
    };

    const handleConfirmNewPasswordChange = (event) => {
        setConfirmNewPassword(event.target.value);
    };

    const handleSave = () => {

        if (newPassword !== confirmNewPassword) {
            alert('New Passwords do not match!');
            return;
        }

        if (newPassword.length < 6){
            alert('NewPassword must be longer than or equal to 6')
            return;
        }

        try{
            resetPassword(oldPassword, newPassword)
        }catch (e){
            console.log(e);
        }

        handleClose();
    };

    const resetPassword = (currentPwd, newPwd) => {
        const url = '/researcher/resetPwd';

        const req = {
            currentPwd: currentPwd,
            newPwd: newPwd,
            id: user.userId
        }


        request.put(url, req)
            .then(response => {
                alert(response.data.message);
            })
            .catch(error => {
                alert('Current password error');
                console.error(error);
            });


    }

    return (

        <div>
            <Navbar/>
            <CssBaseline />

            <div style={{ paddingTop: '80px'}}>
            <Container sx={{
                marginTop: '30',
                width:"1500"
            }}
            >
                <Box sx={{

                    display:"flex",
                    flexDirection:"column",
                    justifyContent:"center",
                    alignItems:"center",
                }}>


                    <Paper sx={{
                        width:'100%'
                    }} elevation={5}>
                        <Grid sx={{
                            marginLeft: '3%',
                            marginTop: '3%'
                        }}>
                            <Typography component="h1" variant="h5">Researcher Profile</Typography>
                        </Grid>

                        <Grid container spacing={10}
                              alignItems="center"
                        >

                            <Grid  item xs={2}
                                   sx={{
                                       align:"left",
                                       marginLeft: '3%'
                                   }} >
                                <Typography>First Name </Typography>
                            </Grid>
                            <Grid item xs={3}
                                  sx={{
                                      align:"center"
                                  }}>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="firstName"
                                    defaultValue={user.firstName}
                                    onChange={handleFirstNameChange}
                                />
                            </Grid>

                            <Grid  item xs={2}
                                   sx={{
                                       marginLeft: '5%'
                                   }}
                            >
                                <Typography>Last Name </Typography>
                            </Grid>

                            <Grid item xs={3}>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    id="lastName"
                                    defaultValue={user.lastName}
                                    onChange={handleLastNameChange}
                                />

                            </Grid>


                        </Grid>

                        <Grid container spacing={10}
                              alignItems="center"
                        >
                            <Grid  item xs={2}
                                   sx={{
                                       align:"left",
                                       marginLeft: '3%'
                                   }} >
                                <Typography>Email </Typography>
                            </Grid>
                            <Grid item xs={4}
                                  sx={{
                                      align:"center"
                                  }}>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="email"
                                    defaultValue={user.email}
                                    onChange={handEmailChange}

                                />
                            </Grid>

                        </Grid>

                        <Grid container spacing={-20}
                              alignItems="center"
                              marginBottom='1%'
                              justifyContent="flex-end"
                        >
                            <Button sx={{
                                marginLeft: '5%',
                            }} disableElevation
                                    variant="contained"
                                    aria-label="Disabled elevation buttons"
                                    onClick={updateInfo}

                            >Update</Button>
                        </Grid>
                    </Paper>


                    <Paper sx={{width:'100%', marginTop:'3%'}} elevation={5}>
                        <Grid sx={{
                            marginLeft: '3%',
                            marginTop: '3%'
                        }}>
                            <Typography component="h1" variant="h5">Security</Typography>
                        </Grid>

                        <Grid container spacing={-2}
                              alignItems="center"
                              sx={{
                                  my:'3%'
                              }}
                        >
                            <Grid
                                item xs={3}
                                sx={{
                                    align:"left",
                                    marginLeft: '3%'
                                }} >
                                <Typography>Password</Typography>
                            </Grid>


                            <Button
                                sx={{
                                    marginLeft: '5%'
                                }} disableElevation
                                variant="contained"
                                aria-label="Disabled elevation buttons"
                                onClick={handleOpen}
                            >Reset
                            </Button>

                            <Dialog open={open} onClose={handleClose}

                                    TransitionComponent={Fade}
                            >
                                <DialogTitle>  Update Password</DialogTitle>
                                <DialogContent>
                                    <TextField
                                        label="Current Password"
                                        type="password"
                                        value={oldPassword}
                                        onChange={handleOldPasswordChange}
                                        fullWidth
                                        margin="normal"
                                    />
                                    <TextField
                                        label="New Password"
                                        type="password"
                                        value={newPassword}
                                        onChange={handleNewPasswordChange}
                                        fullWidth
                                        margin="normal"
                                    />
                                    <TextField
                                        label="Confirm New Password"
                                        type="password"
                                        value={confirmNewPassword}
                                        onChange={handleConfirmNewPasswordChange}
                                        fullWidth
                                        margin="normal"
                                    />

                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={handleClose} color="primary">
                                        Cancel
                                    </Button>
                                    <Button onClick={handleSave} color="primary">
                                        Save
                                    </Button>
                                </DialogActions>
                            </Dialog>
                        </Grid>

                    </Paper>


                    <Button variant="contained" color="primary"
                            sx={{marginTop:'1%',
                                marginRight: '-85%',
                                marginBottom: '1%'
                            }}
                            onClick={handleButtonClick}>
                        Back to home
                    </Button>


                </Box>

            </Container>
            </div>
        </div>
    );
}