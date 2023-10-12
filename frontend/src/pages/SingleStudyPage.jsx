import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { Box, Toolbar, List, CssBaseline, Typography, Divider, IconButton, 
    ListItem, ListItemButton, ListItemIcon, ListItemText, Tooltip, Avatar, Menu, MenuItem } from '@mui/material';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import EditIcon from '@mui/icons-material/Edit';
import PeopleIcon from '@mui/icons-material/People';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import DescriptionIcon from '@mui/icons-material/Description';
import TopicIcon from '@mui/icons-material/Topic';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import SessionManagePage from './SessionManagePage';
import EditStudyPage from './EditStudyPage';
import ParticipantManagePage from './ParticipantManagePage';
import {StudyResearcherContext} from '../providers/StudyResearcherContextProvider';
import HomeIcon from '../assets/The University of Auckland.png';
import { useNavigate } from 'react-router-dom';
import { authService } from "../services/authService";
import StudyDetail from "../components/Study/StudyDetail";
import { DataGridProvider } from '../providers/DataGridProvider';
import {useEffect} from "react";

const drawerWidth = 240;


const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);


export default function SingleStudyPage() {


    const {
        studyDetailInfo,
        refreshStudyDetailContext
    } = React.useContext(StudyResearcherContext);

    const [isClosed, setIsClosed] = React.useState(true);

    useEffect(()=>{
        setIsClosed(studyDetailInfo.isClosed);
    },[studyDetailInfo])

    const updateStudyStatus = () => {
        setIsClosed(true);
    }

    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    // const [openResearcher, setOpenResearcher] = React.useState(false);

    const navigate = useNavigate();
    const settings = ['Profile', 'Logout'];
    const [anchorElUser, setAnchorElUser] = React.useState(null);

    // const {user}= useCurrentUser();
    const {studyInfo}=React.useContext(StudyResearcherContext);

    function createData(icon, title) {
        return { icon, title };
    }

    const actionList = [
        createData(<DescriptionIcon/>, 'Study Detail'),
        createData(<EditIcon/>, 'Edit Study Detail'),
        // createData(<PeopleOutlineIcon/>, 'Manage Researchers'),
        createData(<PeopleIcon/>, 'Manage Participants'),
        createData(<CalendarMonthIcon/>, 'Manage Sessions'),
        createData(<HomeOutlinedIcon/>, 'Back to Dashboard')
      ];
  
    const handleDrawerOpen = () => {
      setOpen(true);
    };
  
    const handleDrawerClose = () => {
      setOpen(false);
    };

    const handleOpenUserMenu = (event) => {
      setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
      setAnchorElUser(null);
    };

    const handleSettingClick = async (setting) => {
      if (setting === 'Profile') {
        setComponent('general');
        navigate('/researcher/profile')
      } else if (setting === 'Logout') {
        setComponent('general');
        await authService.signOut();
          navigate('/')
      }
      handleCloseUserMenu();
    };


  // Function to get the current component state from local storage
    const getCurrentComponentFromLocalStorage = () => {
      const storedComponent = localStorage.getItem('currentComponent');
      return storedComponent || 'general'; // Default to 'general' if not found
    };

  // Function to save the current component state to local storage
    const saveCurrentComponentToLocalStorage = (componentName) => {
      localStorage.setItem('currentComponent', componentName);
    };

  // Initialize the component state from local storage or default to 'general'
    const [component, setComponent] = React.useState(getCurrentComponentFromLocalStorage()); 
  
  // When the component state changes, save it to local storage
    React.useEffect(() => {
      saveCurrentComponentToLocalStorage(component);
    }, [component]);

    const handleBackToHome = () => {
      saveCurrentComponentToLocalStorage('general');
      navigate('/homepage');
      
    }

    return (
        <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="fixed" open={open}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{
                marginRight: 5,
                ...(open && { display: 'none' }),
              }}
            >
              <MenuIcon />
            </IconButton>
              <img src={HomeIcon} alt="" width={100}/>
              <Typography variant="h6" noWrap component="a" href="/homepage" onClick={() => setComponent('general')}
                sx={{
                      mr: 2,
                      display: { xs: 'none', md: 'flex' },
                      fontFamily: 'monospace',
                      fontWeight: 700,
                      color: 'inherit',
                      textDecoration: 'none',
                      flexGrow: 3
                    }}
                    >ResearchFusion</Typography>
            <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar/>
                </IconButton>
                </Tooltip>
                <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
                >
                {settings.map((setting) => (
                    <MenuItem key={setting} onClick={() => handleSettingClick(setting)}>
                    <Typography textAlign="center">{setting}</Typography>
                    </MenuItem>
                ))}
              </Menu>
            </Box>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <DrawerHeader>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
          </DrawerHeader>
          <Divider />
          <List>
              <ListItem key={0} disablePadding sx={{ display: 'block', ...(component === 'general' && {backgroundColor: '#e0e0e0'})}} onClick={() => setComponent('general')}>
                <ListItemButton sx={{ minHeight: 48, justifyContent: open ? 'initial' : 'center', px: 2.5,}}>
                  <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center'}}>{actionList[0].icon}</ListItemIcon>
                  <ListItemText sx={{ opacity: open ? 1 : 0 }}>{actionList[0].title}</ListItemText>
                </ListItemButton>
              </ListItem>
              {!isClosed ? (
                <ListItem key={1} disablePadding sx={{ display: 'block', ...(component === 'detail' && {backgroundColor: '#e0e0e0'})}} onClick={() => setComponent('detail')}>
                  <ListItemButton sx={{ minHeight: 48, justifyContent: open ? 'initial' : 'center', px: 2.5,}}>
                    <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center' }}>
                        {actionList[1].icon}
                    </ListItemIcon>
                    <ListItemText sx={{ opacity: open ? 1 : 0 }}>{actionList[1].title}</ListItemText>
                  </ListItemButton>
              </ListItem>
              ) : null}

              {!isClosed ? (
              <ListItem key={2} disablePadding sx={{ display: 'block', ...(component === 'participant' && {backgroundColor: '#e0e0e0'}) }} onClick={() => setComponent('participant')}>
                <ListItemButton sx={{ minHeight: 48, justifyContent: open ? 'initial' : 'center', px: 2.5,}}>
                  <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center'}}>{actionList[2].icon}</ListItemIcon>
                  <ListItemText sx={{ opacity: open ? 1 : 0 }}>{actionList[2].title}</ListItemText>
                </ListItemButton>
              </ListItem>
              ) : null}

              {!isClosed && studyInfo.isAnonymous !== true ?  (
              <ListItem key={3} disablePadding sx={{ display: 'block', ...(component === 'session' && {backgroundColor: '#e0e0e0'}) }} onClick={() => setComponent('session')}>
                <ListItemButton sx={{ minHeight: 48, justifyContent: open ? 'initial' : 'center', px: 2.5,}}>
                  <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center'}}>{actionList[3].icon}</ListItemIcon>
                  <ListItemText sx={{ opacity: open ? 1 : 0 }}>{actionList[3].title}</ListItemText>
                </ListItemButton>
              </ListItem>
              ) : null}

              <ListItem key={4} disablePadding sx={{ display: 'block' }} onClick={handleBackToHome}>
                <ListItemButton sx={{ minHeight: 48, justifyContent: open ? 'initial' : 'center', px: 2.5,}}>
                  <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center'}}>{actionList[4].icon}</ListItemIcon>
                  <ListItemText sx={{ opacity: open ? 1 : 0 }}>{actionList[4].title}</ListItemText>
                </ListItemButton>
              </ListItem>
          </List>
        </Drawer>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <DrawerHeader />
            { studyDetailInfo.creator !== undefined &&
            <div>
                {
                  component === 'general' ?
                    <StudyDetail data={studyDetailInfo} isClosed={updateStudyStatus}/>
                  :
                  component === 'detail' ?
                    <EditStudyPage/>
                  :
                  component === 'session' ? 
                    <SessionManagePage/>
                  :
                  component === 'participant' ?
                    <DataGridProvider>
                      <ParticipantManagePage/>
                    </DataGridProvider>
                  :
                  null
                }
              </div>
              }

        </Box>
      </Box>
    )
}