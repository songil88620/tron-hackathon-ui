/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router'
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import { Divider, IconButton, InputBase, MenuItem, Paper, Select, SelectChangeEvent } from '@mui/material';
import ArrowCircleLeftOutlinedIcon from '@mui/icons-material/ArrowCircleLeftOutlined';
import TaskOutlinedIcon from '@mui/icons-material/TaskOutlined';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import { apiHost, tokenList } from '../src/utils/constant';
import axios from 'axios';
import { getCurrentDate } from '../src/utils/helper'; 
import { Props } from '../src/utils/types';
  

const Request: React.FC<Props> = ({ role, emissary, connected, address }) => {

    const router = useRouter()
    const { id } = router.query 
    const [programs, setPrograms] = useState([])
    const [pid, setPid] = useState('')
    const [program, setProgram] = useState("")
    const [name, setName] = useState("")
    const [amount, setAmount] = useState("0")
    const [token, setToken] = useState("GAS")

    const handleProgram = (event: SelectChangeEvent) => {
        const p = event.target.value
        setPid(p);
        const pn = programs.filter((pr) => pr['_id'] == p)
        setProgram(pn[0]['name']) 
    };

    useEffect(() => { 
        if (emissary) {
            readPrograms(emissary)
        }
    }, [emissary])

    const readPrograms = async (emissary: string) => {
        const res = await axios.get(apiHost + 'program/emissary/' + emissary) 
        setPrograms(res.data)
    }

    const handleToken = (event: SelectChangeEvent) => {
        setToken(event.target.value)
    };

    const createRequest = async () => {
        try {
            const data = {
                emissary,
                owner: address,
                name,
                program: {
                    pid,
                    program
                },
                amount: {
                    amount,
                    token
                },
                state: 'Approved',
                hash: '',
                created: getCurrentDate()
            }  
            const res = await axios.post(apiHost + 'request', data); 
            if (res.status == 201) {
                toast.success("Created Successfully!", { position: 'top-right' })
                router.push('/request');
            } else {
                toast.error("Create Failed!", { position: 'top-right' })
            }
        } catch (e) { 
            toast.error("Error occured!", { position: 'top-right' })
        }
    }

    return (
        <>
            <div className='semi-header'>
                <Link href="/request">
                    <p className='transfer-btn '><ArrowCircleLeftOutlinedIcon className='icon-btn' />Transfer Requests</p>
                </Link>
            </div>
            <Divider /> 
            <div className='semi-body'>
                <div className='filter-sect'>
                    <div className=''>
                        <p className='m0 number-pink-big mt-10'>Create transfer request</p>
                    </div>
                    <Button variant="outlined" className='grey-btn inter-font font-light '><img className='mr-10' src="/assets/img/nft-icon.png" alt="" />Auto Request Submission</Button>
                </div>
                <div className='diag-input-item mt-30'>
                    <p className='p-diag-titles'>Program</p>
                    <Select
                        value={pid}
                        onChange={handleProgram}
                        displayEmpty
                        inputProps={{ 'aria-label': 'Without label' }}
                        className='sel-asset'
                    >
                        {
                            programs.map((pro, idx) => {
                                return (
                                    <MenuItem key={idx} value={pro['_id']} className='pro-item font-14'>
                                        {pro['name']}
                                        {pro['program']['program'] && <img className='mr-10' src="/assets/img/nft-icon.png" alt="" />}
                                    </MenuItem>
                                )
                            })
                        }
                    </Select>
                </div>
                <div className='diag-input-item'>
                    <p className='p-diag-titles'>Project name</p>
                    <input className='pol-input' value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className='diag-input-item w-600'>
                    <p className='p-diag-titles'>Request amount</p>
                    <div className='flex-start'>
                        <OutlinedInput
                            className='ador-input-2 font-light'
                            value={amount}
                            onChange={(e) => { setAmount(e.target.value) }}
                            endAdornment={
                                <InputAdornment position="end">
                                    <Select
                                        displayEmpty
                                        inputProps={{ 'aria-label': 'Without label' }}
                                        className='sel-asset-mid font-14 left-in-sel'
                                        value={token}
                                        onChange={(e) => handleToken(e)}
                                    >
                                        {
                                            tokenList.map((r, idx) => {
                                                return (
                                                    <MenuItem className='font-14' key={idx} value={r.name}>{r.name}</MenuItem>
                                                )
                                            })
                                        }
                                    </Select>
                                </InputAdornment>}
                            inputProps={{
                                'aria-label': 'weight',
                            }}
                        />
                    </div>
                </div>
                <div className='diag-input-item'>
                    <p className='p-diag-titles'>Tax Documents</p>
                    <p className='m0 processing-stamp'>Upload <span className='pink-text text-underline'>required tax document(s)</span> to be associated with requests.<br />
                        Any update to tax documents will be verified to make sure you can legally receive the payout.</p>
                    <Button className='pink-btn mt-20'>Upload</Button>
                </div>
                <Divider className='mt-15' />
                <div className='btn-group-start mt-30'>
                    <Button variant="outlined" className='pink-btn-outline mr-10'>Clear</Button>
                    <Button variant="outlined" className='pink-btn' onClick={() => createRequest()}>Submit</Button>
                </div>
            </div>
            <Toaster />
        </>
    );
}

export default Request
