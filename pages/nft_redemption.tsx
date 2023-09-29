/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router'
import { Divider } from '@mui/material';
import NFTItem from '../src/components/NFTItem';
import { Props } from '../src/utils/types';
import axios from 'axios';
import { apiHost } from '../src/utils/constant';

const list = [1]

const Index: React.FC<Props> = ({ role, emissary, address, connected }) => {

    const router = useRouter()
    const { id } = router.query
    const [load, setLoad] = useState(false);
    const [nfts, setNfts] = useState([]);

    useEffect(() => {
        readNfts()
    }, [])

    const readNfts = async () => {
        try {
            const res = await axios.get(apiHost + 'nftred')
            console.log(">>>>", res.data)
            setNfts(res.data.reverse())
        } catch (e) {
            console.log("...")
        }
    }

    return (
        <>
            <div className='semi-header'>
                <p className='transfer-btn' >NFT Redemption</p>
            </div>
            <Divider />
            <div className='semi-body'>
                <div className='list-sect'>
                    {
                        nfts.map((item, index) => {
                            return (
                                <NFTItem key={index} amount={123} address={item['hash']} hashDate={'Created on ' + item['created']} byDate={'Awarded on ' + item['created']} by={item['name']} id={item['_id']} />
                            )
                        })
                    }
                </div>
                {/* <div className='text-center'>
                    <img src='/assets/img/noitem.png' alt=""/>
                    <p className='font-14 text-color-grey'>There are no NFT for you to redeem currently...</p>
                </div> */}
            </div>
        </>
    );
}

export default Index
