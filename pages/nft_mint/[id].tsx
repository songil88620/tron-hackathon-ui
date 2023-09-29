/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router'
import Button from '@mui/material/Button';
import { DialogContentText, Divider, IconButton, InputBase, Paper } from '@mui/material';
import ArrowCircleLeftOutlinedIcon from '@mui/icons-material/ArrowCircleLeftOutlined';
import Link from 'next/link';
import { Props } from '../../src/utils/types';
import axios from 'axios';
import { apiHost } from '../../src/utils/constant';


const Index: React.FC<Props> = ({ connected, address }) => {

    const router = useRouter()
    const { id } = router.query
    const [nft, setNft] = useState(null)
    useEffect(() => {
        if (id != "" && id != undefined) {
            readnft(id);
        }
    }, [id])

    const readnft = async (id: any) => {
        try {
            const res = await axios.get(apiHost + 'nftred/one/' + id)
            setNft(res.data)
        } catch (e) {
            console.log("err")
        }
    }

    const beautyAddress = (add: string) => {
        return add.substring(0, 4) + "..." + add.substring(add.length - 4, add.length)
    }

    return (
        <>
            <div className='semi-header'>
                <Link href="/nft_redemption">
                    <p className='transfer-btn'><ArrowCircleLeftOutlinedIcon className='icon-btn' />NFT Redemption</p>
                </Link>
            </div>
            <Divider />
            {
                nft &&
                <div className='flex-center mt-40'>
                    <div className='nft-item-wrap'>
                        <img className='nft-img' src={nft['url']} alt="" />
                        <p className='font-14 text-color-black inter-font font-bold'>{nft['name']}</p>
                        <a href={`https://tronscan.org/#/transaction/` + nft['hash']} target='_blank' rel="noreferrer" className='text-underline text-color-grey font-12 inter-font'>{beautyAddress(nft['hash'])}</a>
                        <p className='font-14 text-color-black inter-font '>{nft['desc']}</p>
                        <Button className='pink-btn w-100'>Mint</Button>
                    </div>
                </div>
            }

        </>
    );
}

export default Index
// 