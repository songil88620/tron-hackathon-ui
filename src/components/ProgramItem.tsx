/* eslint-disable @next/next/no-img-element */
import { Button, Grid } from '@mui/material';
import Link from 'next/link';
import * as React from 'react';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';

interface Props {
    hashDate: string,
    byDate: string,
    by: string,
    id: string,
    nft: boolean
}

const ProgramItem: React.FC<Props> = (prop) => {




    return (
        <div className='req-item'>
            <Grid container>
                <Grid item xs={12} sm={6} md={6} className='flex-start'>
                    <div>
                        <p className='m0 item-by'>{prop.by}</p>
                        <p className='m0 item-by-date'>{prop.byDate}</p>
                    </div>
                </Grid>
                <Grid item xs={12} sm={6} md={6} className='flex-end'>
                    <div className='mr-15'>
                        {prop.nft && <img className='mr-10' src="/assets/img/nft-icon.png" alt='' />}
                    </div>
                    <div>
                        <MenuOutlinedIcon className='cursor-point' />
                    </div>
                </Grid>
            </Grid>
        </div>
    )

}

export default ProgramItem