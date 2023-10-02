/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router'
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import LinearProgress from '@mui/material/LinearProgress';
import Drawer from '@mui/material/Drawer';
import { Divider, IconButton, InputBase, Paper } from '@mui/material';
import ArrowCircleLeftOutlinedIcon from '@mui/icons-material/ArrowCircleLeftOutlined';
import TaskOutlinedIcon from '@mui/icons-material/TaskOutlined';
import Link from 'next/link';
import { NET, apiHost } from '../../src/utils/constant';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { Approver, Props, Safe } from '../../src/utils/types';
import { getCurrentDate } from '../../src/utils/helper';
import { tronWeb, tronWebTest } from '../../src/utils/TronWeb';
import { useWallet } from '@tronweb3/tronwallet-adapter-react-hooks';



const Request: React.FC<Props> = ({ emissary, connected, address, role, provider }) => {
    const { signMessage, signTransaction } = useWallet();
    const router = useRouter()
    const { id } = router.query

    const [safe, setSafe] = useState<Safe>({
        emissary: emissary,
        owner: "",
        name: "",
        desc: "",
        asset: "",
        recipient: "",
        controllers: [],
        approver: "1",
        lump_check: false,
        lump_amount: {
            amount: '0',
            token: 'GAS',
            hash: "",
            approved: 0
        },
        mile_check: false,
        milestones: [],
        created: ""
    })
    const [controllers, setControllers] = useState<Approver[]>([])
    const [midx, setMidx] = useState(0)

    useEffect(() => {
        if (id != "" && id != undefined) {
            readSafe()
        }
    }, [id])

    const readSafe = async () => {
        try {
            const res = await axios.get(apiHost + 'safe/one/' + id);
            setSafe(res.data)
            setControllers(res.data.controllers)
        } catch (e) {

        }
    }

    const approveSig = async (idx: number) => {
        try {
            var ctr = controllers;
            var d = ctr[idx].data;
            d[midx] = {
                approved: true,
                at: getCurrentDate()
            }
            ctr[idx] = {
                address: ctr[idx].address,
                data: d
            }
            if (safe.lump_check) {
                var lm = safe.lump_amount
                lm.approved++
                const data = {
                    _id: id,
                    controllers: ctr,
                    lump_amount: lm
                }
                const res = await axios.put(apiHost + 'safe', data)
                if (res.status == 200) {
                    var s = safe
                    s.controllers = ctr;
                    setSafe({ ...s })
                    toast.success("Approved Successfully!", { position: 'top-right' })
                } else {
                    toast.error("Approve Failed!", { position: 'top-right' })
                }
            } else {
                var ml = safe.milestones
                ml[midx].approved++
                const data = {
                    _id: id,
                    controllers: ctr,
                    milestones: ml,
                }
                const res = await axios.put(apiHost + 'safe', data)
                if (res.status == 200) {
                    var s = safe
                    s.controllers = ctr;
                    setSafe({ ...s })
                    toast.success("Approved Successfully!", { position: 'top-right' })
                } else {
                    toast.error("Approve Failed!", { position: 'top-right' })
                }
            }


        } catch (e) {
            toast.error("Error occured!", { position: 'top-right' })
        }
    }

    const deposite = async () => {
        try {
            if (safe.lump_check) {
                var lm = safe.lump_amount
                var sNet = NET;
                const TronWeb = sNet == "1" ? tronWeb : tronWebTest;
                const transaction = await TronWeb.transactionBuilder.sendTrx(safe.recipient, TronWeb.toSun(safe.lump_amount.amount), address);
                const signedTransaction = await signTransaction(transaction);
                const response = await TronWeb.trx.sendRawTransaction(signedTransaction)
                lm.hash = response.txid
                const data = {
                    _id: id,
                    lump_amount: lm
                }
                const res = await axios.put(apiHost + 'safe', data)
                if (res.status == 200) {
                    var s = safe
                    s.lump_amount = lm;
                    setSafe({ ...s })
                    toast.success("Deposited Successfully!", { position: 'top-right' })
                } else {
                    toast.error("Deposite Failed!", { position: 'top-right' })
                }
            } else {
                var ml = safe.milestones
                // call the smart contract here and get the hash
                ml[midx].hash = '0x12345';
                const data = {
                    _id: id,
                    milestones: ml,
                }
                const res = await axios.put(apiHost + 'safe', data)
                if (res.status == 200) {
                    var s = safe
                    s.milestones = ml;
                    setSafe({ ...s })
                    toast.success("Deposited Successfully!", { position: 'top-right' })
                } else {
                    toast.error("Deposite Failed!", { position: 'top-right' })
                }
            }
        } catch (e) {
            console.log(">>E", e)
        }
    }

    const canDeopsite = () => {
        if (safe.lump_check) {
            if (safe.lump_amount.approved >= Number(safe.approver) && safe.lump_amount.hash == "") {
                return true
            } else {
                return false
            }
        } else {
            if (safe.milestones.length > 0) {
                if (safe.milestones[midx].approved >= Number(safe.approver) && safe.milestones[midx].hash == "") {
                    return true
                } else {
                    return false
                }
            } else {
                return false
            }
        }
    }

    return (
        <>
            <div className='semi-header'>
                <Link href="/safe">
                    <p className='transfer-btn'><ArrowCircleLeftOutlinedIcon className='icon-btn' />Safes</p>
                </Link>
            </div>
            <Divider />
            <div className='semi-body'>
                <div className='filter-sect'>
                    <div className=''>
                        <p className='m0 number-pink'>Safe</p>
                        <p className='m0 number-pink-big mt-10'>{safe.name}</p>
                        <p className='m0 item-hash mt-15'>Created on {safe.created}</p>
                    </div>
                    <Button className='grey-btn inter-font inter-font'>0x1f2...55369</Button>
                </div>
                <Divider className='mt-15' />
                <div className='flex-end mt-15'>
                    {
                        canDeopsite() && <Button variant="outlined" className='pink-btn-outline mr-10 ' onClick={() => deposite()} >Deposit</Button>
                    }
                </div>
                <div className='mt-30'>
                    <p className='part-title'>About this safe</p>
                    <p className='inter-font font-14 w-900 text-color-black'>{safe.desc}</p>
                </div>
                <div className='inputs-wrap mt-30'>
                    <div className='flex-start custom-input mt-10'>
                        <p className='mp0 input-title font-14'>Recipient</p>
                        <input value={safe.recipient} readOnly />
                    </div>
                    {
                        safe.lump_check &&
                        <div className='flex-start'>
                            <div className='flex-start custom-input mt-10'>
                                <p className='mp0 input-title font-14'>Lump sum payout amount</p>
                                <input className='pink-text' value={safe.lump_amount.amount + " " + safe.lump_amount.token} readOnly />
                            </div>
                            {
                                safe.lump_amount.approved >= Number(safe.approver) && safe.lump_amount.hash != "" &&
                                <Link href={'https://tronscan.org/#/transaction/' + safe.lump_amount.hash} target="_blank" passHref>
                                    <div className='ml-10 text-underline pink-text font-14 no-wrap'>View Transfer Memo</div>
                                </Link>
                            }
                        </div>
                    }
                    {
                        safe.mile_check &&
                        safe.milestones.map((mile, idx) => {
                            return (
                                <div key={idx} className='flex-start'>
                                    <div className={midx == idx ? "flex-start custom-input mt-10 cursor-point selected" : "flex-start custom-input mt-10 cursor-point"} onClick={() => setMidx(idx)}>
                                        <p className='mp0 input-title font-14'>Milestone {idx + 1} payout amount</p>
                                        <input className='pink-text cursor-point' value={mile.amount + " " + mile.token} readOnly />
                                    </div>
                                    {mile.approved >= Number(safe.approver) && mile.hash &&
                                        <Link href={'https://tronscan.org/#/transaction/' + mile.hash}>
                                            <div className='ml-10 text-underline pink-text font-14 no-wrap'>View Transfer Memo</div>
                                        </Link>
                                    }
                                </div>
                            )
                        })
                    }

                </div>
                <div className='mt-30'>
                    <p className='part-title'>Approval Signatures - {safe.approver} out of {safe.controllers.length} approver(s)</p>
                    {
                        controllers.map((ct, idx) => {
                            return (
                                <div key={idx} className='w-900 flex-start mt-10'>
                                    <div className='w-600 tax-form flex-between'>
                                        <p className='text-color-grey font-14'>{ct['address']}</p>
                                        <CheckCircleOutlineOutlinedIcon className={ct['data'][midx]['approved'] ? "text-color-green" : ""} />
                                    </div>
                                    {
                                        ct['data'][midx]['approved'] ?
                                            <p className='font-14 inter-font ml-10 text-color-grey'>Signed on {ct['data'][midx]['at']}</p> : role != 'Client' &&
                                            <Button variant="outlined" className='pink-btn-outline ml-10' onClick={() => approveSig(idx)}>Approve</Button>
                                    }

                                </div>
                            )
                        })
                    }
                </div>
            </div >
            <Toaster />
        </>
    );
}

export default Request
