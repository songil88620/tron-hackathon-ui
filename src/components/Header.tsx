/* eslint-disable @next/next/no-img-element */
/* eslint-disable @next/next/no-html-link-for-pages */
import * as React from 'react';
import { styled } from '@mui/material/styles';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import { useRouter } from 'next/router';
import Box from '@mui/material/Box'; 
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import MenuIcon from '@mui/icons-material/Menu';
import { TextField, Typography } from '@mui/material'; 
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { useEffect } from 'react';  

interface AppBarProps extends MuiAppBarProps {
}

const AppBar = styled(MuiAppBar, {})<AppBarProps>(({ theme }) => ({
    transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
})); 
  
interface Props {
    openSide:any
}  

const Header: React.FC<Props> = ({openSide}) => { 

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);   
    const [isLib, setIsLib] = React.useState(false)
    const router = useRouter()   

    useEffect(()=>{ 
        if(router.route.includes('library')){
            setIsLib(true)
        }
    },[router])
     
    const openLibrary = () => { 
        if(router.pathname == "/"){
            window.location.href = '/library' 
        }else{
            window.location.href = '/' 
        }   
    };   
    
    return (
        <AppBar id="appbar" position="fixed" sx={{ backgroundColor: 'var(--background)', color: '#000' }}>
            <Grid container  spacing={2} sx={{ justifyContent: "space-between", margin:"-16px auto 0", height:'80px' }}>
                <Grid item sx={{ width: '80px', paddingLeft: '30px !important', display: 'flex', alignItems: 'center' }} xs={1} md={2}>
                    <a href='/'>
                        <div style={{display:'flex', alignItems:'center'}}>
                            <img
                                src="/assets/logo.png"
                                alt="ForestPoint"
                                style={{ objectFit: 'cover', width: '35px' }}                                
                            />
                            <Typography sx={{ display: { xs: 'none', md: 'flex' } }} style={{margin:'0', fontSize:'22px', fontWeight:'700', marginLeft:'5px'}}><span>ForestPoint</span></Typography> 
                        </div>  
                    </a> 
                </Grid>
                 
                <Grid item xs={1} md={3} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '20px' }}> 
                    <Box sx={{ display: { xs: 'flex', md: 'flex' }, alignItems:'center'  }} >
                        {isLib && <MenuIcon  sx={{fontSize:'30px', display:{xs:'block', sm:'none', md:'none'}}} onClick={openSide} />} 
                        <Button 
                            onClick={()=>openLibrary()}
                            style={{color:'#333333', height:'38px', marginRight:'10px',  width:'max-content !important'}}                            
                            >  
                            <span style={{fontWeight:'600', textTransform: 'capitalize', fontSize:'18px'}}>{router.pathname == "/"?"PCD Data Library":"Home"} </span>
                            <KeyboardArrowRightIcon style={{marginLeft:'5px', color:'#C1C1C1'}}  />
                        </Button>   
                    </Box>
                </Grid>
            </Grid>
        </AppBar>
    );
}

export default Header;
