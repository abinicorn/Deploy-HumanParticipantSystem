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
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import DescriptionIcon from '@mui/icons-material/Description';
import TopicIcon from '@mui/icons-material/Topic';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import { useParams } from 'react-router-dom';
import { StudyResearcherContextProvider } from '../providers/StudyResearcherContextProvider';
import ResearcherManagePopup from '../components/Researcher/ResearcherManagePopup'; 
import SessionContextProvider from '../providers/SessionContextProvider';
import SessionManagePage from './SessionManagePage';
import EditStudyPage from './EditStudyPage';
import StudyParticipantProvider from '../providers/StudyPaticipantsProvider';
import ParticipantManagePage from './ParticipantManagePage';
import HomeIcon from '../assets/The University of Auckland.png';
import { useNavigate } from 'react-router-dom';
import { authService } from "../services/authService";
import StudyDetail from "../components/Study/StudyDetail";
import { useLocation } from 'react-router-dom';
import StudyReport from "../components/Study/StudyReport";
import { DataGridProvider } from '../providers/DataGridProvider';

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

    const location = useLocation();
    const { state } = location;
    const [studyData, setStudyData] = React.useState(state.study);

    const { studyId } = useParams();
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const [component, setComponent] = React.useState('general');

    const navigate = useNavigate();
    const settings = ['Profile', 'Logout'];
    const [anchorElUser, setAnchorElUser] = React.useState(null);

    function createData(icon, title) {
        return { icon, title };
    }

    const actionList = [
        createData(<TopicIcon/>, 'Study Detail'),
        createData(<EditIcon/>, 'Edit Study Detail'),
        createData(<PeopleOutlineIcon/>, 'Manage Researchers'),
        createData(<PeopleIcon/>, 'Manage Participants'),
        createData(<CalendarMonthIcon/>, 'Manage Sessions'),
        createData(<DescriptionIcon/>, 'Generate Report'),
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
          navigate('/researcher/profile')
      } else if (setting === 'Logout') {
          await authService.signOut();
          navigate('/')
      }
      handleCloseUserMenu();
    };

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
              <Typography variant="h6" noWrap component="a" href="/homepage" 
                sx={{
                      mr: 2,
                      display: { xs: 'none', md: 'flex' },
                      fontFamily: 'monospace',
                      fontWeight: 700,
                      color: 'inherit',
                      textDecoration: 'none',
                      flexGrow: 3
                    }}>ResearchFusion</Typography>
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
              <ListItem key={0} disablePadding sx={{ display: 'block' }} onClick={() => setComponent('general')}>
                <ListItemButton sx={{ minHeight: 48, justifyContent: open ? 'initial' : 'center', px: 2.5,}}>
                  <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center'}}>{actionList[0].icon}</ListItemIcon>
                  <ListItemText sx={{ opacity: open ? 1 : 0 }}>{actionList[0].title}</ListItemText>
                </ListItemButton>
              </ListItem>
              {studyData.status ? (
                      <ListItem key={1} disablePadding sx={{ display: 'block' }} onClick={() => setComponent('detail')}>
                <ListItemButton sx={{ minHeight: 48, justifyContent: open ? 'initial' : 'center', px: 2.5,}}>


                        <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center' }}>
                            {actionList[1].icon}
                        </ListItemIcon>

                  <ListItemText sx={{ opacity: open ? 1 : 0 }}>{actionList[1].title}</ListItemText>
                </ListItemButton>
              </ListItem>
              ) : null}

              {studyData.status ? (
              <ListItem key={2} disablePadding sx={{ display: 'block' }} onClick={() => setComponent('general')}>
                <ListItemButton sx={{ minHeight: 48, justifyContent: open ? 'initial' : 'center', px: 2.5,}}>
                  <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center'}}>{actionList[2].icon}</ListItemIcon>
                  <ListItemText sx={{ opacity: open ? 1 : 0 }}>
                    <StudyResearcherContextProvider pageItemId={studyId}><ResearcherManagePopup/></StudyResearcherContextProvider> 
                  </ListItemText>
                </ListItemButton>
              </ListItem>
              ) : null}


                  {studyData.status ? (
              <ListItem key={3} disablePadding sx={{ display: 'block' }} onClick={() => setComponent('participant')}>
                <ListItemButton sx={{ minHeight: 48, justifyContent: open ? 'initial' : 'center', px: 2.5,}}>
                  <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center'}}>{actionList[3].icon}</ListItemIcon>
                  <ListItemText sx={{ opacity: open ? 1 : 0 }}>{actionList[3].title}</ListItemText>
                </ListItemButton>
              </ListItem>
                  ) : null}

                          {studyData.status ? (
              <ListItem key={4} disablePadding sx={{ display: 'block' }} onClick={() => setComponent('session')}>
                <ListItemButton sx={{ minHeight: 48, justifyContent: open ? 'initial' : 'center', px: 2.5,}}>
                  <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center'}}>{actionList[4].icon}</ListItemIcon>
                  <ListItemText sx={{ opacity: open ? 1 : 0 }}>{actionList[4].title}</ListItemText>
                </ListItemButton>
              </ListItem>
                          ) : null}



              <ListItem key={5} disablePadding sx={{ display: 'block' }} onClick={() => setComponent('report')}>
                <ListItemButton sx={{ minHeight: 48, justifyContent: open ? 'initial' : 'center', px: 2.5,}}>
                  <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center'}}>{actionList[5].icon}</ListItemIcon>
                  <ListItemText sx={{ opacity: open ? 1 : 0 }}>{actionList[5].title}</ListItemText>
                </ListItemButton>
              </ListItem>

              <ListItem key={6} disablePadding sx={{ display: 'block' }} onClick={() => navigate('/homepage')}>
                <ListItemButton sx={{ minHeight: 48, justifyContent: open ? 'initial' : 'center', px: 2.5,}}>
                  <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center'}}>{actionList[6].icon}</ListItemIcon>
                  <ListItemText sx={{ opacity: open ? 1 : 0 }}>{actionList[6].title}</ListItemText>
                </ListItemButton>
              </ListItem>
          </List>
        </Drawer>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <DrawerHeader />
              <div>
                {
                  component === 'general' ?
                      <StudyDetail data={studyData}/>
                  :
                  component === 'detail' ?
                  <EditStudyPage/>
                  :
                  component === 'session' ? 
                    <StudyResearcherContextProvider>
                      <SessionContextProvider>
                        <SessionManagePage/>
                      </SessionContextProvider>
                    </StudyResearcherContextProvider>
                  : 
                  component === 'participant' ?
                  <StudyResearcherContextProvider>
                    <StudyParticipantProvider>
                      <DataGridProvider>
                        <ParticipantManagePage/>
                      </DataGridProvider>
                    </StudyParticipantProvider>
                  </StudyResearcherContextProvider> 
                  :
                  <StudyReport data={studyData}/>
                }
              </div>
        </Box>
      </Box>
    )
}