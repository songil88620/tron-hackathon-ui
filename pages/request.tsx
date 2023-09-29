/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router'
import Button from '@mui/material/Button';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import Dialog from '@mui/material/Dialog';
import { DialogContentText, Divider, IconButton, InputBase, Paper } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import ReqItem from '../src/components/ReqItem';
import Link from 'next/link';
import { apiHost } from '../src/utils/constant';
import axios from 'axios';
import { beatifyAddress } from '../src/utils/helper'; 
import { Props } from '../src/utils/types';


 



const Index: React.FC<Props> = ({ role, emissary, connected, address }) => {

    const router = useRouter() 
    const { id } = router.query
    const [load, setLoad] = useState(false);
    const [open, setOpen] = React.useState(false);
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        if (address != "" && emissary != "") {
            readRequest()
        }
    }, [address, emissary])

    const readRequest = async () => {
        try {
            if (role == "Client") {
                const res = await axios.post(apiHost + 'request/get', { emissary: emissary, owner: address })
                setRequests(res.data)
            } else {
                const res = await axios.get(apiHost + 'request/emissary/' + emissary)
                setRequests(res.data)
            }
        } catch (e) {

        }
    }

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <div className='semi-header'>
                <p className='transfer-btn' >Transfer Requests
                    {
                        role == "Client" &&
                        <Link href="/request_create"> <AddCircleOutlineOutlinedIcon className='font-24 pink-text ml-10 cursor-point' /></Link>
                    }
                </p>
            </div >
            <Divider />
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
                    {/* <Button variant="outlined" className='pink-btn' onClick={() => handleClickOpen()}>Filter</Button> */}
                </div>
                <div className='list-sect'>
                    {
                        requests.map((item, index) => {
                            return (
                                <ReqItem state={item['state']} key={index} amount={item['amount']['amount'] + " " + item['amount']['token']} address={beatifyAddress(item['owner'])} hashDate={'Created on ' + item['created']} byDate={item['program']['program']} by={item['name']} id={item['_id']} />
                            )
                        })
                    }
                </div>

            </div>
            <Dialog
                maxWidth="sm"
                fullWidth={true}
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <div className='p-diag-header '>
                    <p className='p-diag-titles'>Filter</p>
                    <CloseOutlinedIcon onClick={() => handleClose()} />
                </div>
                <Divider />
                <div className='diag-body'>
                    <div className='diag-input-item'>
                        <p className='p-diag-titles'>Transfer Request Number</p>
                        <input className='diag-input' />
                    </div>
                    <div className='diag-input-item'>
                        <p className='p-diag-titles'>Status</p>
                        <input className='diag-input' />
                    </div>
                    <div className='diag-input-item'>
                        <p className='p-diag-titles'>Program</p>
                        <input className='diag-input' />
                    </div>
                    <div className='diag-input-item'>
                        <p className='p-diag-titles'>Project Name</p>
                        <input className='diag-input' />
                    </div>
                    <div className='diag-input-item'>
                        <p className='p-diag-titles'>Applier Wallet Address</p>
                        <input className='diag-input' />
                    </div>
                    <div className='diag-input-item'>
                        <p className='p-diag-titles'>Transaction Hash</p>
                        <input className='diag-input' />
                    </div>
                    <div className='diag-input-item'>
                        <p className='p-diag-titles'>IPFS CID of Transfer Memo</p>
                        <input className='diag-input' />
                    </div>

                    <div className='status-item-active'>Approved</div>
                    <div className='status-item'>Approved</div>
                    <div className='btn-group mt-30'>
                        <Button variant="outlined" className='pink-btn-outline mr-10'>Clear</Button>
                        <Button variant="outlined" className='pink-btn'>Apply</Button>
                    </div>
                </div>
            </Dialog>
        </>
    );
}

export default Index
