/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router'
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import { Button, Divider, IconButton, InputBase, Paper } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ProgramItem from '../src/components/ProgramItem';
import Link from 'next/link';
import axios from 'axios';
import { apiHost } from '../src/utils/constant'; 
import { Props } from '../src/utils/types';


const Index: React.FC<Props> = ({ role, emissary, address }) => {

    const router = useRouter() 
    const [load, setLoad] = useState(false);
    const [programs, setPrograms] = useState([])

    useEffect(() => {
        if (address != "" && emissary != "") {
            readPrograms(address)
        }
    }, [address, emissary])

    const readPrograms = async (adr: string) => {
        try {
            const res = await axios.post(apiHost + 'program/get', { emissary: emissary, owner: adr })
            console.log(">>>>Hg", res)
            setPrograms(res.data.reverse())
        } catch (e) {
            console.log("...")
        }
    }

    return (
        <>
            <div className='semi-header'>
                <p className='transfer-btn' >Programs
                    {
                        role == "Controller" &&
                        <Link href="/program_create">
                            <AddCircleOutlineOutlinedIcon className='font-24 pink-text ml-10 cursor-point' />
                        </Link>
                    }
                </p>
            </div>
            <Divider />
            {
                programs.length > 0 &&
                <div className='semi-body'>
                    <div className='filter-sect'>
                        <Paper component="form" className='search-box' >
                            <IconButton sx={{ p: '10px' }} aria-label="menu">
                                <SearchIcon />
                            </IconButton>
                            <InputBase
                                sx={{ ml: 1, flex: 1 }}
                                placeholder="Search request number, program, project name, applier wallet address"
                                inputProps={{ 'aria-label': 'Search request number, program, project name, applier wallet address' }}
                            />
                        </Paper>
                    </div>

                    <p className='processing-stamp mt-20'>Drag and reorder the programs to change how they order in the transfer request form. Click to edit the program info and settings.</p>

                    <div className='list-sect'>
                        {
                            programs.map((item, index) => {
                                return (
                                    <Link key={index} href={"/program/" + item['_id']}>
                                        <ProgramItem hashDate={''} byDate={"Created on " + item['created']} by={item['name']} id={item['_id']} nft={item['program']['program']} />
                                    </Link>
                                )
                            })
                        }
                    </div>
                </div>
            }
            {
                programs.length == 0 &&
                <div className='semi-body'>
                    <div className='text-center mt-mid'>
                        <img src='/assets/img/noitem.png' alt="" />
                        <p className='font-14 text-color-grey'>There are no programs for your emissary. Create one!</p>
                        <Link href="/program_create">
                            <Button variant="outlined" className='pink-btn-outline mt-20' >+ Program</Button>
                        </Link>
                    </div>
                </div>
            }


        </>
    );
}

export default Index
