
import * as React from 'react';
import Grid from '@mui/material/Grid';
import { Button } from '@mui/material';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router'
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';


const tabs = [
    { id: 0, name: "Transfer Requests", route: '/request', role: ['Client', 'Controller'], beta: false },
    { id: 1, name: "Safes", route: '/safe', role: ['Client', 'Controller'], beta: false },
    { id: 2, name: "Programs", route: '/programs', role: ['Controller'], beta: false },
    { id: 3, name: "NFT Collections", route: '/nft_redemption', role: ['Client', 'Controller'], beta: false },
    { id: 4, name: "Emissary Settings", route: '/emissary_set', role: ['Controller'], beta: false },
    { id: 5, name: "Plugins", route: '/plugins', role: ['Controller', 'Client'], beta: true },
]

interface Props {
    subdomain: string,
    selectTab: any,
    role: string,
    emissary: string,
    connected: boolean,
    address: string,
}

const beatifyAddress = (address: string) => {
    return `${address.slice(0, 3)}...${address.slice(-3)}`;
}

const SideBar: React.FC<Props> = ({ selectTab, role, connected, address }) => {

    const router = useRouter()
    const [currnetTab, setCurrnetTab] = useState(10)

    useEffect(() => {
        const tab_idx = Number(localStorage.getItem('tab'))
        setCurrnetTab(tab_idx);
    }, [])

    const changeTab = (index: number) => {
        tabUi(index)
        const r = tabs[index].route;
        router.push(r);
    }

    const tabUi = (index: number) => {
        setCurrnetTab(index);
        selectTab(index);
        localStorage.setItem('tab', index.toString())
    }

    useEffect(() => {
        const path = router.pathname
        if (path.includes('/request')) {
            tabUi(0)
        } else if (path.includes('/safe')) {
            tabUi(1)
        } else if (path.includes('/programs')) {
            tabUi(2)
        } else if (path.includes('/nft_redemption')) {
            tabUi(3)
        } else if (path.includes('/emissary_set')) {
            tabUi(4)
        } else if (path.includes('/plugins')) {
            tabUi(5)
        }
    }, [router])

    return (
        <div className='side-bar-wrap'>
            <div>
                <Link href="/">
                    <img className='logo-side' src='/assets/logo.png' alt="" />
                </Link>
                {
                    tabs.map((tab, index) => {
                        return (
                            tab.role.includes(role) &&
                            <Button key={index} variant="outlined" className={currnetTab == tab.id ? "side-btn-active" : "side-btn"} onClick={() => changeTab(index)} >
                                {tab.name}
                                {tab.beta && <span className='beta-icon'>BETA</span>}
                            </Button>
                        )
                    })
                }
            </div>
            <div>
                {
                    connected &&
                    <div className='mt-30 mb-30'>
                        <Button className='account-btn-white'>
                            <AccountCircleOutlinedIcon className='icon-btn-b ' />
                            <span className='mr-10'>{beatifyAddress(address)}</span>
                            <span className='pink-wrap'>{role}</span>
                        </Button>
                    </div>
                }
            </div>
        </div>
    );
}
export default SideBar;
