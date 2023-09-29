/* eslint-disable @next/next/no-img-element */
/* eslint-disable @next/next/no-html-link-for-pages */
import * as React from 'react'; 
import Grid from '@mui/material/Grid';   

const Footer: React.FC  = ( ) => {    
    return ( 
        <Grid container spacing={2} style={{borderTop:'solid 1px #dddddd', marginTop:'0px', height:'80px'}}>
            <Grid item sx={{  display: 'flex', alignItems: 'center', justifyContent:'center', paddingTop:'6px !important' }} xs={12} md={12}>
                 <p style={{color:"#333333", fontWeight:'800'}}>Trained with love @ GRP-L</p>
            </Grid>  
        </Grid> 
    );
} 
export default Footer;
