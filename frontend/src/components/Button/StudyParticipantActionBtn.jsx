import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

import GiftOrReportList from '../Participant/GiftOrReportList'
import DescriptionIcon from '@mui/icons-material/Description';
import RedeemIcon from '@mui/icons-material/Redeem';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import MailingList from '../Participant/MailingList';
import FullscreenIcon from '@mui/icons-material/Fullscreen'
import StudyParticipantTablePopUp from '../Participant/StudyParticipantTablePopUp'
import { DataGridContext } from '../../providers/DataGridProvider';
import CheckIcon from '@mui/icons-material/Check';
import { StudyParticipantContext } from '../../providers/StudyPaticipantsProvider';

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity,
        ),
      },
    },
  },
}));

export default function StudyParticipantActionBtn({ context, selectedRows }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openGiftList, setOpenGiftList] = React.useState(false);
  const [openReportList, setOpenReportList] = React.useState(false);
  const [openMailingList, setOpenMailingList] = React.useState(false);
  const [openTablePopUp, setOpenTablePopUp] = React.useState(false);
  const {selectRowsByEmails, setSelectRowsByEmails} = React.useContext(DataGridContext);
  const {studyParticipants} = React.useContext(StudyParticipantContext);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOpenGiftList = () => {
    setOpenGiftList(true);
  };

  const handleOpenReportList = () => {
    setOpenReportList(true);
  };
  
  const handleOpenMailingList = () => {
    setOpenMailingList(true);
  };

  const handleOpenTablePopUp = () => {
    setOpenTablePopUp(true);
    openFullscreen(document.documentElement);
    handleClose();
  }

  // open fullscreen set up
  function openFullscreen(element) {
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.webkitRequestFullscreen) { /* Safari */
      element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) { /* IE11 */
      element.msRequestFullscreen();
    }
  }

  return (
    <div>
      <Button
        id="demo-customized-button"
        aria-controls={open ? 'demo-customized-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        variant="contained"
        disableElevation
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
      >
        Actions
      </Button>
      <StyledMenu
        id="demo-customized-menu"
        MenuListProps={{
          'aria-labelledby': 'demo-customized-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={handleOpenGiftList}>
          <RedeemIcon />
          Show Gift List
        </MenuItem>
        <MenuItem onClick={handleOpenReportList}>
          <DescriptionIcon />
          Show Report Recipients
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        <MenuItem onClick={handleOpenMailingList}>
          <MailOutlineIcon />
          Show Mailing List
        </MenuItem>
        {studyParticipants.length > 0 && [
            <Divider key="divider-key" sx={{ my: 0.5 }} />,
            <MenuItem key="menu-key" onClick={() => {setSelectRowsByEmails(!selectRowsByEmails)}}>
            <CheckIcon key="icon-key" style={{ visibility: selectRowsByEmails ? 'visible' : 'hidden' }}/>
            Select Rows by Emails
            </MenuItem>
        ]}
        <Divider sx={{ my: 0.5 }} />
        <MenuItem onClick={handleOpenTablePopUp}>
          <FullscreenIcon />
          View in FullScreen
        </MenuItem>
      </StyledMenu>
      {openGiftList && <GiftOrReportList type='gift' open={() => handleOpenGiftList} onClose={() => setOpenGiftList(false)}/>}
      {openReportList && <GiftOrReportList type='report' open={() => handleOpenReportList} onClose={() => setOpenReportList(false)}/>}
      {openMailingList && <MailingList context={context} selectedRows={selectedRows} open={() => handleOpenMailingList} onClose={() => setOpenMailingList(false)}/>}
      {openTablePopUp && <StudyParticipantTablePopUp open={() => handleOpenTablePopUp} onClose={() => setOpenTablePopUp(false)}/>}
    </div>
  );
}