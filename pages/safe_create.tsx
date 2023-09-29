/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router'
import Button from '@mui/material/Button';
import { Divider, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import ArrowCircleLeftOutlinedIcon from '@mui/icons-material/ArrowCircleLeftOutlined';
import Link from 'next/link';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import { apiHost, tokenList } from '../src/utils/constant';
import RemoveCircleOutlineOutlinedIcon from '@mui/icons-material/RemoveCircleOutlineOutlined';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import * as safeLottie from '../public/assets/lottie/safe.json';
import * as HDFCLottie from '../public/assets/lottie/HDFC.json';
import Lottie from 'react-lottie';
import ArrowCircleRightOutlinedIcon from '@mui/icons-material/ArrowCircleRightOutlined';
import { Props, Safe } from '../src/utils/types';
import { getCurrentDate } from '../src/utils/helper'; 

const safelogo = {
    loop: true,
    autoplay: true,
    animationData: safeLottie,
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
    }
};

const hdfc = {
    loop: true,
    autoplay: true,
    animationData: HDFCLottie,
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
    }
}; 

const SafeCreate: React.FC<Props> = ({ role, emissary, connected, address }) => { 

    const router = useRouter()
    const [safe, setSafe] = useState<Safe>({
        emissary,
        owner: address,
        name: "",
        desc: "",
        asset: "USDT",
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
        created: getCurrentDate()
    })
    const [milestone, setMilestone] = useState("0")
    const [tokenB, setTokenB] = useState("GAS")
    const [controls, setControlls] = useState([])
    const [controller, setController] = useState("")
    const [step, setStep] = useState(0)
    const [controllers, setControllers] = useState<string[]>([])
    const [total, setTotal] = useState("")

    useEffect(() => {
        readControllers(emissary);
    }, [emissary])

    useEffect(() => {
        if (address != undefined) {
            var s = safe;
            s.owner = address;
            setSafe({ ...s })
        }
    }, [address])

    const readControllers = async (emissary: string) => {
        const res = await axios.get(apiHost + 'emissary/one/' + emissary)
        setControlls(res.data.controllers)
    }

    const handleController = (event: SelectChangeEvent) => {
        setController(event.target.value)
    };

    const handleApprover = (event: SelectChangeEvent) => {
        var s = safe;
        s.approver = event.target.value
        setSafe({ ...s })
    };

    const handleToken = (event: SelectChangeEvent, idx: number) => {
        if (idx == 1) {
            var s = safe;
            var lump = s.lump_amount
            lump.token = event.target.value;
            s.lump_amount = lump;
            setSafe({ ...s })
        } else if (idx == 2) {
            setTokenB(event.target.value)
        } else {
            var s = safe;
            s.asset = event.target.value;
            setSafe({ ...s })
        }
    };

    const plusController = () => {
        var c = controllers
        if (!controllers.includes(controller)) {
            c.push(controller)
        }
        setControllers([...c])
    }

    const deleteController = (idx: number) => {
        var c = controllers;
        c.splice(idx, 1)
        setControllers([...c])
    }

    const plusMilestone = () => {
        var s = safe
        var m = s.milestones;
        m.push({
            amount: milestone,
            token: tokenB,
            hash: "",
            approved: 0
        })
        s.milestones = m;
        setSafe({ ...s })
    }

    const deleteMilestone = (idx: number) => {
        var s = safe;
        var m = s.milestones;
        m.splice(idx, 1)
        s.milestones = m;
        setSafe({ ...s })
    }

    const createSafe = async () => {
        try {
            setStep(1)
            setTimeout(async () => {
                var s = safe;
                var ct: any[] = [];
                controllers.forEach((c) => {
                    var d = []
                    const tmp = {
                        at: "",
                        approved: false
                    }
                    if (s.lump_check) {
                        d.push(tmp)
                    } else {
                        s.milestones.forEach((e) => {
                            d.push(tmp)
                        })
                    }
                    const cs = {
                        address: c,
                        data: d
                    }
                    ct.push(cs)
                })
                s.controllers = ct;
                const res = await axios.post(apiHost + 'safe', s)
                if (res.status == 201) {
                    toast.success("Created Successfully!", { position: 'top-right' })
                } else {
                    toast.error("Create Failed!", { position: 'top-right' })
                }
                setStep(2)
            }, 4000)
        } catch (e) {
            setStep(0)
            toast.error("Error occured!", { position: 'top-right' })
        }
    }

    useEffect(() => {
        if (safe.lump_check) {
            const total = safe.lump_amount.amount + " " + safe.lump_amount.token
            setTotal(total)
        } else {
            var total = 0
            // safe.milestones.forEach((m, idx) => {
            //     if (idx < safe.milestones.length - 1) {
            //         total = total + m.amount + " " + m.token + " + "
            //     } else {
            //         total = total + m.amount + " " + m.token
            //     } 
            // }) 
            safe.milestones.forEach((m, idx) => {
                total = total + Number(m.amount)
            })
            if (safe.milestones.length > 0) {
                setTotal(total + " " + safe.milestones[0].token)
            }
        }
    }, [safe])

    return (
        <>
            {
                step == 0 &&
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
                                <p className=' number-pink-big mt-10'>Create a safe</p>
                            </div>
                        </div>
                        <div className='diag-input-item'>
                            <p className='p-diag-titles'>Name of your safe</p>
                            <input className='pol-input font-14' placeholder='Example: Developing NFT minting DApp'
                                value={safe.name}
                                onChange={(e) => {
                                    var p = safe;
                                    p.name = e.target.value;
                                    setSafe({ ...p })
                                }}
                            />
                        </div>
                        <div className='diag-input-item'>
                            <p className='p-diag-titles'>Description</p>
                            <textarea className='pol-input mh-120 font-14' placeholder='Briefly describe what is this safe uses for?'
                                value={safe.desc}
                                onChange={(e) => {
                                    var p = safe;
                                    p.desc = e.target.value;
                                    setSafe({ ...p })
                                }}
                            />
                        </div>
                        <div className='diag-input-item'>
                            <p className='p-diag-titles'>Input your asset</p>
                            <Select
                                displayEmpty
                                inputProps={{ 'aria-label': 'Without label' }}
                                className='sel-asset font-14 '
                                value={safe.asset}
                                onChange={(e) => handleToken(e, 0)}
                            >
                                {
                                    tokenList.map((r, idx) => {
                                        return (
                                            <MenuItem className='font-14' key={idx} value={r.name}>{r.name}</MenuItem>
                                        )
                                    })
                                }
                            </Select>
                        </div>
                        <div className='diag-input-item'>
                            <p className='p-diag-titles'>Recipient Wallet Address</p>
                            <input className='pol-input' placeholder='Example: 5D25X4qhiqpv8ELXMQH5pejGGsoePoo3RFiZiq4N5RHLJKAF'
                                value={safe.recipient}
                                onChange={(e) => {
                                    var p = safe;
                                    p.recipient = e.target.value;
                                    setSafe({ ...p })
                                }}
                            />
                        </div>
                        <div className='diag-input-item'>
                            <p className='p-diag-titles'>Approval Signatures</p>
                            <p className='inter-font font-14 w-600 text-color-grey'>Assets stored inside the safe need to approve by certain amount of signatures in order to be payout to the recipient. Add the the approvers from your list of emissary controllers and they will need to use their wallet to approve any transactions to the recipient.</p>
                            {
                                controllers.map((as: string, idx) => {
                                    return (
                                        <div key={idx} className='flex-start mt-10'>
                                            <Button className='pink-btn-outline'>{as} </Button>
                                            <RemoveCircleOutlineOutlinedIcon className='font-24 pink-text ml-10 cursor-point' onClick={() => deleteController(idx)} />
                                        </div>
                                    )
                                })
                            }
                            <div className='flex-start mt-10'>
                                <Select
                                    value={controller}
                                    onChange={handleController}
                                    displayEmpty
                                    inputProps={{ 'aria-label': 'Without label' }}
                                    className='sel-asset font-14'
                                >
                                    {
                                        controls.map((c, idx) => {
                                            return (
                                                <MenuItem key={idx} className='font-14' value={c['address']}>{c['address']}</MenuItem>
                                            )
                                        })
                                    }
                                </Select>
                                <AddCircleOutlineOutlinedIcon className='font-24 pink-text ml-10 cursor-point' onClick={() => plusController()} />
                            </div>
                            <p className='inter-font font-14 w-600 text-color-grey'>Any transaction to the recipient requires the confirmation of:</p>
                            <div className='flex-start'>
                                <Select
                                    value={safe.approver}
                                    onChange={handleApprover}
                                    displayEmpty
                                    inputProps={{ 'aria-label': 'Without label' }}
                                    className='sel-asset-short font-14'
                                >
                                    {
                                        controllers.map((c, idx) => {
                                            return (
                                                <MenuItem key={idx} className='font-14' value={idx + 1}>{idx + 1}</MenuItem>
                                            )
                                        })
                                    }
                                </Select>
                                <p className='inter-font font-14 w-600 text-color-black ml-15'>out of {controllers.length} approver(s)</p>
                            </div>
                        </div>
                        <div className='diag-input-item'>
                            <div>
                                <p className='p-diag-titles'>Asset transfer mode</p>
                                <p className='p-diag-titles'>
                                    <label className='custom-check'>
                                        <input type="checkbox"
                                            checked={safe.lump_check}
                                            onChange={(e) => {
                                                var p = safe;
                                                p.lump_check = e.target.checked;
                                                if (p.lump_check) {
                                                    p.mile_check = false
                                                }
                                                setSafe({ ...p })
                                            }}
                                        />
                                        <span>Lump sum release to the recipient</span>
                                    </label>
                                </p>
                            </div>
                            <div className='item-wrap ml-25 mt-15'>
                                <div className='diag-input-item'>
                                    <p className='p-diag-titles'>Release amount</p>
                                    <div className='flex-start'>
                                        <OutlinedInput
                                            className='ador-input-2 font-light'
                                            value={safe.lump_amount.amount}
                                            onChange={(e) => {
                                                var p = safe;
                                                p.lump_amount.amount = e.target.value;
                                                setSafe({ ...p })
                                            }}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <Select
                                                        displayEmpty
                                                        inputProps={{ 'aria-label': 'Without label' }}
                                                        className='sel-asset-mid font-14 left-in-sel'
                                                        value={safe.lump_amount.token}
                                                        onChange={(e) => handleToken(e, 1)}
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
                            </div>
                        </div>
                        <div className='diag-input-item'>
                            <div>
                                <p className='p-diag-titles'>
                                    <label className='custom-check'>
                                        <input type="checkbox"
                                            checked={safe.mile_check}
                                            onChange={(e) => {
                                                var p = safe;
                                                p.mile_check = e.target.checked;
                                                if (p.mile_check) {
                                                    p.lump_check = false
                                                }
                                                setSafe({ ...p })
                                            }}
                                        />
                                        <span>Milestones-based release to the recipient</span>
                                    </label>
                                </p>
                            </div>
                            <div className='item-wrap ml-25 mt-15'>
                                <div className='diag-input-item'>
                                    <p className='p-diag-titles'>Milestones</p>
                                    {
                                        safe.milestones.map((as: any, idx) => {
                                            return (
                                                <div key={idx} className='flex-start mt-10'>
                                                    <Button className='pink-btn-outline'>{as.amount} : {as.token} </Button>
                                                    <RemoveCircleOutlineOutlinedIcon className='font-24 pink-text ml-10 cursor-point' onClick={() => deleteMilestone(idx)} />
                                                </div>
                                            )
                                        })
                                    }
                                    <div className='flex-start mt-10'>
                                        <OutlinedInput
                                            className='ador-input-2 font-light'
                                            value={milestone}
                                            onChange={(e) => setMilestone(e.target.value)}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <Select
                                                        displayEmpty
                                                        inputProps={{ 'aria-label': 'Without label' }}
                                                        className='sel-asset-mid font-14 left-in-sel'
                                                        value={tokenB}
                                                        onChange={(e) => handleToken(e, 2)}
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
                                        <AddCircleOutlineOutlinedIcon className='font-24 pink-text ml-10 cursor-point' onClick={() => plusMilestone()} />
                                    </div>

                                </div>
                            </div>
                        </div>
                        <Divider className='mt-40' />
                        <div className='flex-between mt-30'>
                            <div className='btn-group-start'>
                                <Button variant="outlined" className='pink-btn-outline mr-10'>Clear</Button>
                                <Button variant="outlined" className='pink-btn' onClick={() => createSafe()}>Submit</Button>
                            </div>
                            <div>
                                <p className='m-0-3 font-14 text-color-black text-right'>Initial asset in safe</p>
                                <p className='m-0-3 pink-text font-20'>{total}</p>
                            </div>
                        </div>
                    </div>
                </>
            }
            {
                step == 1 &&
                <div className='text-center mt-60'>
                    <Lottie options={safelogo}
                        height={300}
                        width={300}
                        isStopped={false}
                        isPaused={false} />
                    <p className='pink-text unbound-font font-24'>Creating your safe...</p>
                    <p className='text-color-grey font-14 unbound-font'>
                        Process with the gas fee and assets deposit to create the smart contract of your safe. Do not close the window during this process.
                    </p>
                </div>
            }
            {
                step == 2 &&
                <div className='text-center mt-60'>
                    <Lottie options={hdfc}
                        height={300}
                        width={300}
                        isStopped={false}
                        isPaused={false} />
                    <p className='pink-text unbound-font font-24'>Your safe had created successfully!</p>
                    <p className='text-color-grey font-14 unbound-font'>
                        The smart contract of your safe had successfully deployed. Any info can be checked using the address below.
                    </p>
                    <Link href="">
                        <Button className='grey-btn'><span className='pink-text text-underline'>0x0f7ac266c8e003a3ef71ca56222bbff48d5e97c166ad4d5ef54e05288d86fa0a</span></Button>
                    </Link>
                    <p>
                        <Link href="/safe">
                            <Button className='pink-btn'>Redirect <ArrowCircleRightOutlinedIcon className='font-30 mr-5 ml-5' /> Safes</Button>
                        </Link>
                    </p>

                </div>
            }

            <Toaster />
        </>
    );
}

export default SafeCreate
