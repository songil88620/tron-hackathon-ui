/* eslint-disable @next/next/no-img-element */
import { Grid } from '@mui/material';
import useEnhancedEffect from '@mui/material/utils/useEnhancedEffect';
import * as React from 'react';
import { useEffect, useState } from 'react';

interface Props {
    activeIdx: any,
    actived: number
}

const color_theme = [
    'pink',
    'red',
    'yellow',
    'green',
    'sky',
    'blue',
    'purple',
    'black'
]

const ColorPad: React.FC<Props> = ({ activeIdx, actived }) => {
    const [active, setActive] = useState(actived)

    useEffect(() => {
        setActive(actived)
    }, [actived])

    const selectColor = (i: number) => {
        setActive(i)
        activeIdx(i)
    }
    return (
        <Grid container>
            <Grid item xs={12} sm={12} md={12} className=' '>
                <div className='color-wrap'>
                    {
                        color_theme.map((c, idx) => {
                            return (
                                <img key={idx} className={active == idx ? "cursor-point mb-15 mr-20 color-active" : "cursor-point mb-15 mr-20"} src={'/assets/img/color-' + idx + '.png'}
                                    onClick={() => selectColor(idx)}
                                    alt=""
                                />
                            )
                        })
                    }
                </div>
            </Grid>
        </Grid>
    )
}

export default ColorPad