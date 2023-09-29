/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router'
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { Container } from '@mui/material';
import ArrowCircleRightOutlinedIcon from '@mui/icons-material/ArrowCircleRightOutlined';
import ArrowCircleLeftOutlinedIcon from '@mui/icons-material/ArrowCircleLeftOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import Link from 'next/link';
import axios from 'axios';
import { apiHost } from '../src/utils/constant';
import toast, { Toaster } from 'react-hot-toast';  
import { Props } from '../src/utils/types';
import WalletButton from '../src/components/WalletButton';


const beatifyAddress = (address: string) => {
    return `${address.slice(0, 3)}...${address.slice(-3)}`;
}

const Index: React.FC<Props> = ({ subdomain, role, connected, address, connectWallet }) => {

    const router = useRouter()
    const [code, setCode] = useState("");

    const continues = async () => {
        if (role == 'Client') {
            router.push("/request_create")
        } else {
            router.push("/program_create")
        }
    }

    const goEmissary = async () => {
        try {
            const res = await axios.get(apiHost + 'emissary/code/' + code)
            if (res.data) {
                const sub = 'https://' + res.data.domain + '.emissary.global';
                // const sub = 'http://' + res.data.domain + '.localhost:3000';
                window.open(sub, '_blank')
            } else {
                toast.error("Not exist code.", { position: 'top-right' })
            }
        } catch (e) {
        }
    }

    const connect = async () => {
        connectWallet(true)
    }

    return (
        <>
            <div className='noti-bar'>
                <p>A project developed in Tron Grand Hackathon 2023 S5</p>
            </div>
            {
                (subdomain == "localhost" || subdomain == "emissary") ?
                    <div className='land-body'>
                        <Container maxWidth="lg" >
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={12} md={9} className='land-text-wrap mb-70'>
                                    <span className='land-text'>A better way to receive payouts on the Tron Blockchain. </span>
                                    <Button className='img-icon-btn ml-15 mt-m2r' ><img className='emissary-icon' src='assets/img/Raised-Paper.png' alt="" /> Emissary</Button>
                                </Grid>
                                <Grid item xs={12} sm={12} md={6}>
                                    <div className='lunch-item'>
                                        <img className='lunch-icon' src='assets/img/key-icon.png' alt="" />
                                        <p className='lunch-text'>Launch existing emissary</p>
                                        <p className='lunch-text-sub'>Already have a emissary for your community? Enter the unique code and direct to your emissary.</p>
                                        <div className='code-box mt-30'>
                                            <input className='code' placeholder='Enter code...' value={code} onChange={(e) => setCode(e.target.value)} />
                                            <div className='action'>
                                                <ArrowCircleRightOutlinedIcon className='pink-text' onClick={() => goEmissary()} />
                                            </div>
                                        </div>
                                    </div>
                                </Grid>
                                <Grid item xs={12} sm={12} md={6}>
                                    <div className='lunch-item'>
                                        <img className='lunch-icon' src='assets/img/plus-icon.png' alt="" />
                                        <p className='lunch-text'>New emissary</p>
                                        <p className='lunch-text-sub'>A new emissary that can controlled by one or multiple owners. The perfect solution to process payout to your community.</p>
                                        <div className='mt-30'>
                                            <Link href="/emissary_create">
                                                <Button className='white-btn'>Create my emissary</Button>
                                            </Link>
                                        </div>
                                    </div>
                                </Grid>
                            </Grid>
                        </Container>
                    </div> :
                    <div className='land-body'>
                        <Container maxWidth="lg" >
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={12} md={9} className='land-text-wrap'>
                                    <Link href="/">
                                        <p className='back-btn pink-text unbound-font'><ArrowCircleLeftOutlinedIcon className='icon-btn-b' />Back to emissary.global</p>
                                    </Link>
                                    {
                                        connected &&
                                        <div className='mt-30'>
                                            <Button className='account-btn'>
                                                <AccountCircleOutlinedIcon className='icon-btn-b' />
                                                <span>{beatifyAddress(address)}</span>
                                            </Button>
                                        </div>
                                    }
                                    <span className='connect-text'>
                                        {
                                            connected ?
                                                "Wallet connected successfully!" :
                                                "Connect your wallet to proceed..."
                                        }
                                    </span>
                                </Grid>
                                <Grid item xs={12} sm={12} md={6}>
                                    <div className='lunch-item'>
                                        <p className='lunch-text font-24 mt-40'>Welcome to Tron DAO’s emissary.</p>
                                        <img className='lunch-icon-b mt-30' src='assets/logo.png' />
                                    </div>
                                </Grid>
                                <Grid item xs={12} sm={12} md={6}>
                                    <div className='lunch-item text-center'>
                                        <img className='lunch-icon-b' src='assets/img/subwallet-logo.png' />
                                        <p className='lunch-text '>Tron Wallets</p>
                                        <p className='lunch-text-sub text-underline'>Don't have wallet for Tron? Download here</p>
                                        <div className='mt-30'>
                                            {
                                                connected ?
                                                    <Link href="/request">
                                                        <Button className='white-btn w-100' onClick={() => continues()}>Continue</Button>
                                                    </Link>
                                                    :
                                                    // <Button className='white-btn w-100' onClick={() => connect()} >Connect</Button>
                                                    <WalletButton />
                                            }
                                        </div>
                                    </div>
                                </Grid>
                            </Grid>
                        </Container>
                    </div>
            }
            <Toaster />
        </>
    );
}

export default Index
