import '../styles/globals.css';
import type { AppProps } from 'next/app';
import React, { useState, useEffect } from 'react';
import SideBar from '../src/components/Sidebar';
import styled from '@emotion/styled';
import { Grid } from '@mui/material';
import { useRouter } from 'next/router'
import { apiHost } from '../src/utils/constant';
import axios from 'axios';
import getSubdomain from '../src/utils/get-subdomain';
import type { WalletError } from '@tronweb3/tronwallet-abstract-adapter';
import { TronLinkAdapter, WalletConnectAdapter } from '@tronweb3/tronwallet-adapters';
import { WalletProvider } from '@tronweb3/tronwallet-adapter-react-hooks';
import { WalletModalProvider } from '@tronweb3/tronwallet-adapter-react-ui';
import '@tronweb3/tronwallet-adapter-react-ui/style.css';
import { LedgerAdapter } from '@tronweb3/tronwallet-adapter-ledger';
import { useMemo } from 'react';
import { useWallet, } from '@tronweb3/tronwallet-adapter-react-hooks';

const Main = styled('main', {})<{}>(({ theme }) => ({
    flexGrow: 1,
    backgroundColor: '#F9F9F9',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
}));

function MyApp({ Component, pageProps }: AppProps) {
    const router = useRouter()
    const { address } = useWallet()
    const [side, setSide] = React.useState(false)
    const [role, setRole] = useState('Client')
    const [emissary, setEmissary] = useState("");
    const [subdomain, setSubdomain] = useState("");
    const [connected, setConnected] = useState(false)

    const selectTab = (tab: number) => { }

    const getEmissary = async (sub_domain: string, address: string) => {
        try {
            const res = await axios.get(apiHost + 'emissary/name/' + sub_domain)
            setEmissary(res.data._id);
            const controller = res.data.controllers;
            var role = 'Client';
            controller.map((c: any) => {
                if (c['address'] == address) {
                    role = 'Controller'
                }
            })
            setRole(role)
        } catch (e) {

        }
    }

    useEffect(() => {
        if (address && address != "") {
            const domain = window.location.hostname
            const sub_domain = getSubdomain(domain)
            setConnected(true)
            setSubdomain(sub_domain)
            getEmissary(sub_domain, address)
        }
    }, [address])

    return (
        <Main className='main-body'>
            {
                router.pathname == "/" || router.pathname == "/connect_wallet" || router.pathname == "/emissary_create" ?
                    <Grid container spacing={0} >
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} className='body-wrap' >
                            <Component
                                emissary={emissary}
                                subdomain={subdomain}
                                side={side}
                                role={role}
                                connected={connected}
                                address={address}
                                {...pageProps}
                            />
                        </Grid>
                    </Grid> :
                    <Grid container spacing={0} >
                        <Grid item xs={12} sm={4} md={4} lg={3} xl={2} className='side-bar'>
                            <SideBar
                                emissary={emissary}
                                subdomain={subdomain}
                                selectTab={(i: number) => selectTab(i)}
                                role={role}
                                connected={connected}
                                address={address}
                            />
                        </Grid>
                        <Grid item xs={12} sm={8} md={8} lg={9} xl={10} className='body-wrap' >
                            <Component
                                emissary={emissary}
                                subdomain={subdomain}
                                side={side}
                                role={role}
                                connected={connected}
                                address={address}
                                // provider={provider}
                                {...pageProps}
                            />
                        </Grid>
                    </Grid>
            }
        </Main>
    );
}

export default function App({ Component, pageProps }: AppProps) {

    function onError(e: WalletError) { }
    const adapters = useMemo(function () {
        const tronLink1 = new TronLinkAdapter();
        const ledger = new LedgerAdapter({
            accountNumber: 2,
        });
        const walletConnect1 = new WalletConnectAdapter({
            network: 'Nile',
            options: {
                relayUrl: 'wss://relay.walletconnect.com',
                // example WC app project ID
                projectId: '5fc507d8fc7ae913fff0b8071c7df231',
                metadata: {
                    name: 'Test DApp',
                    description: 'JustLend WalletConnect',
                    url: 'https://your-dapp-url.org/',
                    icons: ['https://your-dapp-url.org/mainLogo.svg'],
                },
            },
        });
        return [tronLink1, walletConnect1, ledger];
    }, []);

    return (
        <WalletProvider onError={onError} adapters={adapters}>
            <WalletModalProvider>
                <MyApp {...pageProps} Component={Component} />
            </WalletModalProvider>
        </WalletProvider>
    );
}


