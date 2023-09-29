/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router'
import Button from '@mui/material/Button';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import Dialog from '@mui/material/Dialog';
import { DialogContentText, Divider, IconButton, InputBase, Paper } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SafeItem from '../src/components/SafeItem';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import Link from 'next/link';
import { apiHost } from '../src/utils/constant';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast'; 
import { Props } from '../src/utils/types';



const Safe: React.FC<Props> = ({ role, emissary, connected, address }) => {

    const router = useRouter()
    const [safes, setSafes] = useState([]); 

    useEffect(() => {
        if (address != "" && emissary != "") {
            readSafes(address)
        }
        console.log(">>>emissary", emissary)
    }, [address, emissary])

    const readSafes = async (address: string) => {
        try {
            var res: any;
            if (role == 'Client') {
                res = await axios.post(apiHost + 'safe/getbyrecip', { emissary: emissary, recipient: address })
            } else {
                res = await axios.post(apiHost + 'safe/get', { emissary: emissary, owner: address })
            }

            if (res.status == 201) {
                setSafes(res.data)
            } else {
                toast.error("Error occured while loading data!", { position: 'top-right' })
            }
        } catch (e) {
            toast.error("Error occured!", { position: 'top-right' })
        }
    }

    const getApprover = (c: any[]) => {
        var approver = 0;
        c.forEach((con) => {
            var ap = true;
            con['data'].forEach((d: any) => {
                if (d['approved'] == false) {
                    ap = false
                }
            })
            if (ap) {
                approver++
            }
        })
        return approver
    }

    return (
        <>
            <div className='semi-header'>
                <p className='transfer-btn' >Safe
                    {
                        role == "Controller" &&
                        <Link href="/safe_create">
                            <AddCircleOutlineOutlinedIcon className='font-24 pink-text ml-10 cursor-point' />
                        </Link>
                    }
                </p>
            </div>
            <Divider />
            {
                safes.length > 0 &&
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
                    <div className='list-sect'>
                        {
                            safes.map((item, index) => {
                                return (
                                    <Link key={index} href={"/safe/" + item['_id']} >
                                        <SafeItem
                                            key={index}
                                            name={item['name']}
                                            date={"Created on " + item['created']}
                                            amount={item['lump_check'] ? item['lump_amount']['amount'] : 0}
                                            approval={getApprover(item['controllers']) + ' / ' + item['approver']}
                                            hash={'Created on 30 Jun 2023'}
                                            id={item['_id']} />
                                    </Link>

                                )
                            })
                        }
                    </div>
                </div >
            }
            {
                safes.length == 0 &&
                <div className='semi-body'>
                    <div className='text-center mt-mid'>
                        <img src='/assets/img/noitem.png' alt="" />
                        <p className='font-14 text-color-grey'>There are no safes assigned from your side. Create one!</p>
                        <Link href="/safe_create">
                            <Button variant="outlined" className='pink-btn-outline mt-20' >+ Safe</Button>
                        </Link>
                    </div>
                </div>
            }
            <Toaster />

        </>
    );
}

export default Safe
