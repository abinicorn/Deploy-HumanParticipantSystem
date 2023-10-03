import * as React from 'react';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Avatar from '@mui/material/Avatar';
import AddRsearcherPopup from './AddResearcherPopup';
import CloseCircleButton from '../Button/CloseCircleButton';
import {
    Typography,
    TextField,
    Button,
    Stack,
    Alert
} from '@mui/material';
import "../../styles/App.css";
import { StudyResearcherContext } from '../../providers/StudyResearcherContextProvider';
import { request } from '../../utils/request';
import OptionPopup from '../Popup/OptionPopup';
import MsgPopup from '../Popup/MsgPopup';
import DeletePopupButton from '../Button/DeletePopupButton';
import Autocomplete from '@mui/material/Autocomplete';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';




const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));



export default function ResearcherManagePopup({open, onClose}) {
    const [researcherId, setResearcherId] = React.useState();
    const [disabledOptions, setDisabledOptions] = React.useState([]);


    const {
        researcherList,
        studyInfo,
        allResearchers,
        removeResearcher,
        fetchResearcherbyEmail,
        refreshResearcherContext
    } = React.useContext(StudyResearcherContext);

    //const [open, setOpen] = React.useState(false);
    const [email, setEmail] = React.useState();
    const [msgOpen, setMsgOpen] = React.useState(false);

    /*
    const handleClickOpen= () => {
        setOpen(true);

    };
    */
    const handleDeleteResearcher = (researcherId) => {
        removeResearcher(studyInfo._id, researcherId);
        setDisabledOptions(prevOptions => prevOptions.filter(id => id !== researcherId));
    }
    /*
    const handleClose = () => {
        setOpen(false);
    };
    */

    const handleSearchClick = async () => {
        const response = await request.get(`/researcher/email/${email}`);
        if (response.status === 200) {
            setMsgOpen(true);
            const newResearcherId=response.data._id;
            setResearcherId(newResearcherId);
            setDisabledOptions([...disabledOptions, newResearcherId]);
        } else{
            alert("The Researcher is not found in the system. Please add the researcher to the system first.");
        }
    };

    const handleAddRsearcher = async () => {
        try {
            console.log(researcherId);
            const data = await request.put(`/study/associateResearcher/${studyInfo._id}/${researcherId}`);
            if (data.status === 200) {
                console.log("success");
                refreshResearcherContext();
            }
        } catch (error) {
            console.log(error);
        }

    }

    const listResearcher = researcherList ? researcherList.map(researcher =>
        <Stack direction="row" spacing={2} margin="20px" key={researcher._id}>
            <Avatar/>
            <Typography variant="subtitle1" sx={{ ml: 1 }}>
                {researcher.username}
            </Typography>

            {researcher._id !== studyInfo.creator && <DeletePopupButton
                popupText={"Do you want to remove this researcher from the study?"}
                onClick={() =>{handleDeleteResearcher(researcher._id)}}
                size={'10px'}
            />}
        </Stack>
    ) : null;


    return (
        <>
            
            <BootstrapDialog
                onClose={onClose}
                aria-labelledby="customized-dialog-title"
                open={open}
            >
                <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                    Manage Researchers
                </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
                <DialogContent dividers>

                    <Typography gutterBottom>
                        <h3> Current Reseracher for this Study</h3>
                        {listResearcher}
                    </Typography>

                    <Typography gutterBottom>
                        <h3>Add New Researcher to the Study by Searching Email Address</h3>

                    </Typography>


{/* Change this input into other */}
                        {/* <Paper
                            component="form"
                            sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 500 }}
                        >
                            <InputBase
                                sx={{ ml: 1, flex: 1 }}
                                placeholder="Search existing researchers by email address"
                                inputProps={{ 'aria-label': 'search by Email Address' }}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                }}
                            />


                        </Paper> */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Autocomplete
                        id="Existing Researcher Email Address"
                        options={allResearchers}
                        getOptionLabel={(option) => option.email || ''}
                        getOptionDisabled={
                            (option) => !option.isActive || studyInfo.researcherList.includes(option._id) || disabledOptions.includes(option._id)

                        }
                        sx={{ width: 500 }}
                        value={email} // Set the value to control the input
                        onChange={(e, newValue) => {
                            setEmail(newValue?.email || ''); // Set email from selected option
                        }}
                        renderInput={(params) => <TextField
                            onKeyDown = {(e) => {
                                e.stopPropagation();
                                }}
                            {...params}
                        label="Existing Researcher Email Address"
                        />}
                    />


                    <IconButton type="button" sx={{ p: '10px' }} aria-label="search" onClick={handleSearchClick}>
                        <AddCircleOutlineOutlinedIcon />
                    </IconButton>
                    </div>



                    <Typography gutterBottom>
                        <h3>Add New Researcher to the System</h3>

                    </Typography>
                    {/* <div
                    // className='align-right'
                    > */}
                            <AddRsearcherPopup />
                    {/* </div> */}



                    <MsgPopup isOpen={msgOpen} setOpen={setMsgOpen} popupText="Do you want to add the researcher?" onClick={() => {
                        handleAddRsearcher(researcherId);
                    }} />







                </DialogContent>
                {/* <DialogActions>
                    <Button autoFocus variant="contained" onClick={handleClose}>
                        Save changes
                    </Button>
                </DialogActions> */}
            </BootstrapDialog>
        </>
    );
}