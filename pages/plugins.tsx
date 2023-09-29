/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router'
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import { Button, Divider, Grid, IconButton, InputBase, Paper } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ProgramItem from '../src/components/ProgramItem';
import Link from 'next/link';
import axios from 'axios';
import { apiHost } from '../src/utils/constant';
import { Props } from '../src/utils/types';

const plugins = [
    {
        name: 'Mailchimp Notifications',
        by: 'by MailChimp',
        desc: 'Integrate Mailchimp to send email notifications or announcement related to payouts or community activity.',
        icon: '/assets/icons/mailchimp.png'
    },
    {
        name: 'Slack for Emissary',
        by: 'by Slack',
        desc: 'Integrate Slack to automate your payouts.',
        icon: '/assets/icons/slack.png'
    },
    {
        name: 'Safe Syncing Tool',
        by: 'by Safe',
        desc: 'Sync all of your safes and import into Emissary. Control and manage your safes as well as payouts using one platform.',
        icon: '/assets/icons/safe.png'
    },
    {
        name: 'Chainlink Functions',
        by: 'by Chainlink',
        desc: 'Build your own smart contract automation on Emissary to make your payout flow more smoother with Chainlink Functions.',
        icon: '/assets/icons/chainlink.png'
    },
    {
        name: 'Scheduled Payouts',
        by: 'by Emissary',
        desc: 'Scheduled your payouts for recurring payments without your manual operation.',
        icon: '/assets/icons/scheduled.png'
    },
    {
        name: 'Party Mode',
        by: 'by Emissary',
        desc: 'Payouts can be fun? Turn on the party mode! Enable different methods of clearing a payouts.',
        icon: '/assets/icons/party.png'
    },
    {
        name: 'Pinata Image',
        by: 'by Pinata Team',
        desc: 'Attach payout image proofs to your clients with Pinata.',
        icon: '/assets/icons/pinata.png'
    },
    {
        name: 'Raffle by Chainlink VRF',
        by: 'by Chainlink',
        desc: 'Distribute token with raffle mode powered by Chainlink VRF to ensure fairness.',
        icon: '/assets/icons/raffle.png'
    },
    {
        name: 'Polygon + Tron',
        by: 'by Polygon',
        desc: 'Transfer Tron and Polygon network token assets together in a single payout.',
        icon: '/assets/icons/polygon.png'
    }
]

const pluginItem = (name: string, by: string, desc: string, icon: string) => {
    return (
        <div className='p-wrap'>
            <div>
                <div className='flex-start'>
                    <div>
                        <img src={icon} alt="" />
                    </div>
                    <div className='ml-15'>
                        <p className='m-0-0 p-name'>{name}</p>
                        <p className='m-0-5 p-by'>{by}</p>
                    </div>
                </div>
                <div>
                    <p className='p-desc'>{desc}</p>
                </div>
            </div>
            <div className='flex-end'>
                <Button className='yellow-btn'>Install</Button>
            </div>
        </div>
    )
}


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
            setPrograms(res.data.reverse())
        } catch (e) {
            console.log("...")
        }
    }

    return (
        <>
            <div className='semi-header'>
                <p className='transfer-btn' >Plugins
                    <span className='beta-icon-y'>BETA</span>
                </p>
            </div>
            <Divider />
            {
                <div className='semi-body'>
                    <div >
                        <Grid container spacing={1}>
                            {
                                plugins.map((p) => {
                                    return (
                                        <Grid item xs={12} sm={6} md={4}>
                                            {pluginItem(p.name, p.by, p.desc, p.icon)}
                                        </Grid>
                                    )
                                })
                            }
                        </Grid>
                    </div>
                </div>
            }
        </>
    );
}

export default Index
