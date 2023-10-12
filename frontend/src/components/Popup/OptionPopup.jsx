import React from 'react';
import Button from '@mui/material/Button';
import OptonDialog from './OptonDialog';

export default function OptionPopup({ buttonText, popupText, onClick }) {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    const handleYesClick = () => {
        onClick();
        handleClose();
    }

    return (
        <div>
            <Button variant="contained" color="secondary" onClick={handleClickOpen}>
                {buttonText}
            </Button>

            <OptonDialog
                open={open}
                onClose={handleClose}
                popupText={popupText}
                onClick={handleYesClick}
            />
        </div>
    );
}