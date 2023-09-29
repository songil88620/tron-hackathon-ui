/* eslint-disable @next/next/no-img-element */
import { Button, Grid } from '@mui/material';
import Link from 'next/link';
import * as React from 'react';

interface Props {
    name: string,
    date: string,
    approval: string,
    amount: number,
    hash: string,
    id: string,
}

const SafeItem: React.FC<Props> = (prop) => {




    return (
        <div className='req-item'>
            <Grid container>
                <Grid item xs={12} sm={12} md={12} className='flex-between'> 
                    <div>
                        <p className='m0 item-by'>{prop.name}</p>
                        <p className='m0 item-by-date'>{prop.date}</p>
                    </div>
                    <div> 
                        <p className='m0 item-by-date'>Approval:</p>
                        <p className='m0 item-by'>{prop.approval}</p>
                    </div>
                    <div>
                        <p className='m0 pink-text'>{prop.amount} GAS</p>
                        <p className='m0 item-hash'>{prop.hash}</p>
                    </div>
                </Grid>
            </Grid>
        </div>
    )

}

export default SafeItem