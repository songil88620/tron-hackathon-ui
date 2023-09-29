/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router'
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import DriveFileRenameOutlineOutlinedIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined';
import LinearProgress from '@mui/material/LinearProgress';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { Divider, DialogContentText, IconButton, InputBase, MenuItem, Paper, Select, SelectChangeEvent } from '@mui/material';
import ArrowCircleLeftOutlinedIcon from '@mui/icons-material/ArrowCircleLeftOutlined';
import Link from 'next/link';
import { apiHost } from '../../src/utils/constant';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast'; 
import { Props } from '../../src/utils/types';
 

interface Program {
    _id: string,
    owner: string,
    name: string,
    created: string,
    program: {
        program: boolean,
        contract_p: string,
        network_p: string
    },
    redemption: {
        redemption: boolean,
        title: string,
        desc: string,
        symbol: string,
        network_r: string,
        img: string
    },
    submission: {
        submission: boolean,
        contract_s: string,
        network_s: string,
        amount: string
    }
}

const Request: React.FC<Props> = ({ }) => {

    const router = useRouter()
    const { id } = router.query
    const [open, setOpen] = useState(false);
    const [edit, setEdit] = useState(false)
    const [load, setLoad] = useState(false);
    const [programs, setPrograms] = useState<Program>(
        {
            _id: "",
            owner: "",
            name: "",
            created: "",
            program: {
                program: false,
                contract_p: "",
                network_p: ""
            },
            redemption: {
                redemption: false,
                title: "",
                desc: "",
                symbol: "",
                network_r: "",
                img: "",
            },
            submission: {
                submission: false,
                contract_s: "",
                network_s: "",
                amount: "0"
            }
        }
    )

    useEffect(() => {
        if (id != "" && id != undefined) {
            readProgram(id);
        }
    }, [id])

    const readProgram = async (id: any) => {
        try {
            const res = await axios.get(apiHost + 'program/one/' + id)
            setPrograms(res.data)
        } catch (e) {
            console.log("err")
        }
    }

    const update = async () => {
        try {
            const res = await axios.put(apiHost + 'program', programs)
            if (res.status == 200) {
                toast.success("Updated Successfully!", { position: 'top-right' })
            } else {
                toast.error("Update Failed!", { position: 'top-right' })
            }
        } catch (e) {
            toast.error("Error occured!", { position: 'top-right' })
        }
    }

    const deleteProgram = async () => {
        try {
            const res = await axios.delete(apiHost + 'program/' + id)
            if (res.status) {
                toast.success("Deleted Successfully!", { position: 'top-right' })
                router.push('/programs')
            }
        } catch (e) {

        }
    }

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <div className='semi-header'>
                <Link href="/programs">
                    <p className='transfer-btn'><ArrowCircleLeftOutlinedIcon className='icon-btn' />Programs</p>
                </Link>
            </div>
            <Divider />
            <div className='semi-body'>
                <div className='filter-sect'>
                    <div className=''>
                        <p className='m0 number-pink'>Program</p>
                        <p className='m0 number-pink-big mt-10'>{programs?.name}</p>
                        <p className='m0 item-hash mt-15'>Created on {programs?.created}</p>
                    </div>
                </div>
                <Divider className='mt-15' />
                <div className='flex-end mt-15'>
                    <DeleteOutlinedIcon className='pink-text cursor-point mr-5' onClick={() => setOpen(true)} />
                    <DriveFileRenameOutlineOutlinedIcon className='pink-text cursor-point' onClick={() => setEdit(true)} />
                </div>
                <div className='diag-input-item '>
                    <div>
                        <p className='p-diag-titles'>
                            <label className='custom-check'>
                                <input type="checkbox"
                                    checked={programs?.program.program}
                                    onChange={(e) => {
                                        var p = programs;
                                        p.program.program = e.target.checked;
                                        setPrograms({ ...p })
                                    }}
                                />
                                <span>Set as token-gated (NFT) program</span>
                            </label>
                        </p>
                        <p className='processing-stamp w-600 ml-25 font-12'>Only certain NFT holder can create a transfer request of this program. You can perfectly restrict clients who are not related to this program to create a transfer request.</p>
                    </div>
                    <div className='ml-25 mt-15 inputs-wrap'>
                        <div className='flex-start custom-input mt-10'>
                            <p className='mp0 input-title font-14'>Contract Address</p>
                            <input type='text' value={programs?.program.contract_p}
                                onChange={(e) => {
                                    var p = programs;
                                    p.program.contract_p = e.target.value;
                                    setPrograms({ ...p })
                                }}
                            />
                        </div>
                        <div className='flex-start custom-input mt-10'>
                            <p className='mp0 input-title font-14'>Network</p>
                            <input value={programs?.program.network_p}
                                onChange={(e) => {
                                    var p = programs;
                                    p.program.network_p = e.target.value;
                                    setPrograms({ ...p })
                                }}
                            />
                        </div>
                    </div>
                </div>
                <div className='diag-input-item'>
                    <div>
                        <p className='p-diag-titles'>
                            <label className='custom-check'>
                                <input type="checkbox"
                                    checked={programs?.redemption.redemption}
                                    onChange={(e) => {
                                        var p = programs;
                                        p.redemption.redemption = e.target.checked;
                                        setPrograms({ ...p })
                                    }}
                                />
                                <span>Setup NFT redemption</span>
                            </label>
                        </p>
                        <p className='processing-stamp w-600 ml-25 font-12'>By enabling this, you can create an NFT collection for this program. If your client create a transfer request for this program and successfully get paid, they can go to the NFT redemption tab to claim their NFT. Perfect for event related programs! </p>
                    </div>
                    <div className='ml-25 mt-15 inputs-wrap'>
                        <div className='flex-start custom-input mt-10'>
                            <p className='mp0 input-title font-14'>Contract Address</p>
                            <input />
                        </div>

                    </div>
                </div>
                <div className='diag-input-item'>
                    <div>
                        <p className='p-diag-titles'>
                            <label className='custom-check'>
                                <input type="checkbox"
                                    checked={programs?.submission.submission}
                                    onChange={(e) => {
                                        var p = programs;
                                        p.submission.submission = e.target.checked;
                                        setPrograms({ ...p })
                                    }}
                                />
                                <span>Setup NFT Auto Request Submission</span>
                            </label>
                        </p>
                        <p className='processing-stamp w-600 ml-25 font-12'>By enabling this, you can bond an NFT collection to this program. When your client is an holder of this NFT collection and creating a transfer request, he/she can choose to use Auto Request Submission where all the info of the transfer request will automatically fill in for him/her. Perfect to a program where the amount of transfer request is the same!</p>
                    </div>
                    <div className='ml-25 mt-15 inputs-wrap'>
                        <div className='flex-start custom-input mt-10'>
                            <p className='mp0 input-title font-14'>Contract Address</p>
                            <input value={programs?.submission.contract_s}
                                onChange={(e) => {
                                    var p = programs;
                                    p.submission.contract_s = e.target.value;
                                    setPrograms({ ...p })
                                }}
                            />
                        </div>
                        <div className='flex-start custom-input mt-10'>
                            <p className='mp0 input-title font-14'>Network</p>
                            <input value={programs?.submission.network_s}
                                onChange={(e) => {
                                    var p = programs;
                                    p.submission.network_s = e.target.value;
                                    setPrograms({ ...p })
                                }}
                            />
                        </div>
                        <div className='flex-start custom-input mt-10'>
                            <p className='mp0 input-title font-14'>Request Amount</p>
                            <input value={programs?.submission.amount}
                                onChange={(e) => {
                                    var p = programs;
                                    p.submission.amount = e.target.value;
                                    setPrograms({ ...p })
                                }}
                            />
                        </div>
                    </div>
                </div>
                {
                    edit &&
                    <>
                        <Divider className='mt-40' />
                        <div className='btn-group-start mt-30'>
                            <Button variant="outlined" className='pink-btn' onClick={() => update()}>Update</Button>
                        </div>
                    </>
                }

            </div>
            <Dialog
                maxWidth="sm"
                fullWidth={true}
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <div className='p-diag-header flex-end'>
                    <CloseOutlinedIcon onClick={() => handleClose()} />
                </div>

                <div className='diag-body'>
                    <div className='text-center'>
                        <p className='text-color-black font-24'>Delete program with NFT redemption?</p>
                        <p className='text-color-grey font-14'>This program is bonded with a NFT collection redemption for your clients who being paid in this program. If you deleted it, you will no longer able to reopen the minting for this NFT collection again.</p>
                    </div>
                    <div className='btn-group mt-30 mb-15'>
                        <Button variant="outlined" className='pink-btn-outline mr-10' onClick={() => setOpen(false)}>No</Button>
                        <Button variant="outlined" className='pink-btn' onClick={() => deleteProgram()}>Yes</Button>
                    </div>
                </div>
            </Dialog>
            <Toaster />
        </>
    );
}

export default Request
