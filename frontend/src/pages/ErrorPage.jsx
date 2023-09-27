import { Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";


export default function ErrorPage() {

    const navigate = useNavigate();

    return(
        <div>
            <div className='background-image'>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', alignContent: 'center', flexDirection: 'column', minHeight: '100%'}}>
                <Typography variant="plain"
                    sx={{ fontSize: '60px', fontStyle: 'bold', color: 'black'}}>
                        WE ARE SORRY, PAGE NOT FOUND!
                </Typography>
                <Button variant="contained" onClick={() => {navigate('/homepage')}}>Back to Home</Button>
                </Box>
            </div>
            
        </div>
    )
}