/* eslint-disable @next/next/no-img-element */
import { Button, Grid } from '@mui/material';
import Link from 'next/link';
import * as React from 'react';

interface Props {
    amount: string,
    address: string,
    hashDate: string,
    byDate: string,
    by: string,
    id: string,
    state: string
}

const ReqItem: React.FC<Props> = (prop) => {
    return (
        <div className='req-item'>
            <Grid container>
                <Grid item xs={12} sm={6} md={6} className='flex-start'>
                    <div className='mr-25'>
                        <p className='m0 text-color-black font-bold'>#{prop.id.substring(12, 24)}</p>
                        <Link href={"/request/" + prop.id}>
                            <Button className='hold-btn' >{prop.state}</Button>
                        </Link>
                    </div>
                    <div>
                        <p className='m0 item-by'>{prop.by}</p>
                        <p className='m0 item-by-date'>{prop.byDate}</p>
                    </div>
                </Grid>
                <Grid item xs={12} sm={6} md={6} className='flex-end'>
                    <div className='mr-35'>
                        <p className='m0 item-hash'>{prop.address}</p>
                        <p className='m0 item-hash'>{prop.hashDate}</p>
                    </div>
                    <div>
                        <p className='m0 item-dot'>{prop.amount}</p>
                    </div>
                </Grid>
            </Grid>
        </div>
    )
}

export default ReqItem