/* eslint-disable @next/next/no-img-element */
import { Button, Grid } from '@mui/material';
import Link from 'next/link';
import * as React from 'react';

interface Props {
    address: string,
    byDate: string,
    state1: string,
    state2: string
}

const ProcessItem: React.FC<Props> = (prop) => {
    return (
        <div className='process-item'>
            <p className='m0 processing-stamp '>{prop.address}</p>
            <p className='m0 processing-stamp '>Changed status from <span className='pink-text'>{prop.state1}</span> to <span className='pink-text'>{prop.state2}</span></p>
            <p className='m0 processing-stamp '>{prop.byDate}</p>
        </div>
    )
}

export default ProcessItem