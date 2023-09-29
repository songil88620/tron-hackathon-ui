/* eslint-disable @next/next/no-img-element */
import { Button, Grid } from '@mui/material';
import Link from 'next/link';
import * as React from 'react';

interface Props {
    amount: number,
    address: string,
    hashDate: string,
    byDate: string,
    by: string,
    id: string,
}

const NFTItem: React.FC<Props> = (prop) => {




    return (
        <div className='req-item'>
            <Grid container>
                <Grid item xs={12} sm={12} md={12} className='flex-between'>
                    <div>
                        <p className='m0 item-by'>{prop.by}</p>
                        <p className='m0 item-by-date'>{prop.byDate}</p>
                    </div>
                    <Link href={'/nft_mint/' + prop.id}>
                        <Button className='pink-btn-outline mr-10'>Mint</Button>
                    </Link>
                </Grid>

            </Grid>
        </div>
    )

}

export default NFTItem