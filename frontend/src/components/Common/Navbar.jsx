import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import HomeIcon from '../../assets/The University of Auckland.png';
import { useNavigate } from 'react-router-dom';
import {authService} from "../../services/authService";


export default function Navbar() {

    const navigate = useNavigate();
    
    const settings = ['Profile', 'Logout'];

    const [anchorElUser, setAnchorElUser] = React.useState(null);
    
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
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
           <Box marginLeft={5} marginRight={5}>
                <Toolbar disableGutters>
                    <img src={HomeIcon} alt="" width={100}/>
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        href="/homepage"
                        sx={{
                        mr: 2,
                        display: { xs: 'none', md: 'flex' },
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        color: 'inherit',
                        textDecoration: 'none',
                        flexGrow: 3
                        }}
                    >
                        ResearchFusion
                    </Typography>
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
                            {setting}
                            </MenuItem>
                        ))}
                        </Menu>
                    </Box>
                </Toolbar>
            </Box>                
        </AppBar>
    );
}
