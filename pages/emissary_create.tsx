/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router'
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import RemoveCircleOutlineOutlinedIcon from '@mui/icons-material/RemoveCircleOutlineOutlined';
import MenuItem from '@mui/material/MenuItem';
import { Container } from '@mui/material';
import ArrowCircleLeftOutlinedIcon from '@mui/icons-material/ArrowCircleLeftOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import Link from 'next/dist/client/link';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import ColorPad from '../src/components/ColorPad';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import * as createEmissaryLottie from '../public/assets/lottie/create-emissary.json';
import Lottie from 'react-lottie';
import ImageUploading from 'react-images-uploading';
import axios from 'axios';
import { apiHost, tokenList } from '../src/utils/constant';
import toast, { Toaster } from 'react-hot-toast'; 
import { Props } from '../src/utils/types'; 

const beatifyAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
}

interface Asset {
    name: string,
    img: string,
}

const Index: React.FC<Props> = ({ address, connected, connectWallet }) => {  
    
    const router = useRouter() 
    const [isExist, setIsExist] = useState(false)
    const [step, setStep] = useState(0)
    const [name, setName] = useState("");
    const [domain, setDomain] = useState("");
    const [theme, setTheme] = useState(0);
    const [img, setImg] = useState("");
    const [assets, setAssets] = useState<Asset[]>([]);
    const [images, setImages] = React.useState([]);
    const maxNumber = 1;

    useEffect(() => {
        if (address != "") {
            getEmissary(address)
        }
    }, [address])  

    const getEmissary = async (address: string) => {
        const res = await axios.get(apiHost + 'emissary/' + address)
        if (res.data != "") {
            setIsExist(true)
        }
    }

    const onChange = (imageList: any, addUpdateIndex: any) => {
        setImg(imageList[0].data_url);
    };

    const [asset, setAsset] = useState<Asset>(tokenList[0]);

    const handleChange = (event: SelectChangeEvent) => {
        const v = event.target.value
        const t = tokenList.filter((tl) => tl.name == v)
        setAsset(t[0]);
    };

    const proceed = async () => {
        try {
            if (isExist) {
                toast.error("You have already exist, we support only one emissary for one user now.", { position: 'top-right' })
                return
            }
            if (step == 4) {
                if (name == "" || domain == "" || img == "" || assets.length == 0) {
                    toast.error("Shold fill all required fields", { position: 'top-right' })
                    return;
                }
                setStep(step + 1)
                const data = {
                    owner: address,
                    name,
                    domain,
                    theme,
                    img,
                    assets,
                    code: "",
                    created: Date.now(),
                    controllers: [{
                        address: address,
                        role: "Admin"
                    }],
                    nft: {
                        everyone: false,
                        holder: false,
                        contract: "",
                        network: ""
                    }
                }
                const res = await axios.post(apiHost + 'emissary', data);
                if (res.status == 201) {
                    toast.success("Created Successfully!", { position: 'top-right' })
                    setTimeout(() => {
                        setStep(6)
                        router.push('/emissary_set')
                    }, 4000)
                } else {
                    toast.error("Create Failed!", { position: 'top-right' })
                }
            } else {
                setStep(step + 1)
            }
        } catch (e) {
            toast.error("Error occured!", { position: 'top-right' })
            toast.error("Logo image file size should be smaller than 50KB!", { position: 'top-right' })
        }
    }
    const back = () => {
        if (step > 0) {
            setStep(step - 1)
        }
    }
    const plusAsset = () => {
        var as = assets;
        const isin = as.filter((a) => a.name == asset.name)
        if (isin.length == 0) {
            as.push(asset);
            setAssets([...as]);
        }
    }
    const delAsset = (idx: number) => {
        var as = assets;
        as.splice(idx, 1);
        setAssets([...as]);
    }

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: createEmissaryLottie,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
        }
    };

    const continues = () => {

    }

    return (
        <>
            <div className='noti-bar'>
                <p>A project developed in Tron Grand Hackathon 2023 S5</p>
            </div>

            <div className='land-body'>
                <Container maxWidth="lg" >

                    <Grid container spacing={3}>
                        {
                            step != 5 &&
                            <Grid item xs={12} sm={12} md={9} className='land-text-wrap '>
                                <Link href="/">
                                    <p className='back-btn white-text unbound-font'><ArrowCircleLeftOutlinedIcon className='icon-btn-b' />Back to emissary.global</p>
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
                                <p className='connect-text m-0-0 mt-20 '>
                                    {
                                        !connected ?
                                            "Connect your wallet to proceed..." :
                                            step == 0 ? "Give your emissary a name..." :
                                                step == 1 ? "Custom subdomain for your emissary..." :
                                                    step == 2 ? "Choose a colour theme..." :
                                                        step == 3 ? "Upload a logo..." :
                                                            step == 4 ? "What asset(s) your emissary utilizing?" :
                                                                step == 6 ? "Emissary created successfully!" : ""

                                    }
                                </p>
                            </Grid>
                        }

                        {
                            !connected &&
                            <>
                                <Grid item xs={12} sm={12} md={6}>
                                    <div className='lunch-item'>
                                        <img className='lunch-icon mt-15' src='assets/img/plus-icon.png' />
                                        <p className='lunch-text font-24'>Creating an emissary...</p>
                                        <p className='lunch-text-sub'>A new emissary that can controlled by one or multiple owners. The perfect solution to process payout to your community.</p>
                                    </div>
                                </Grid>
                                <Grid item xs={12} sm={12} md={6}>
                                    <div className='lunch-item text-center'>
                                        <img className='lunch-icon-b' src='assets/img/subwallet-logo.png' />
                                        <p className='lunch-text '>Tron Pay</p>
                                        <p className='lunch-text-sub text-underline'>Do not have Tron Pay? Download here</p>
                                        <div className='mt-30'>
                                            <Button className='white-btn w-100' onClick={() => connectWallet(true)}  >Connect</Button>
                                        </div>
                                    </div>
                                </Grid>
                            </>
                        }
                        {
                            step == 6 &&
                            <>
                                <Grid item xs={12} sm={12} md={6}>
                                    <div className='lunch-item'>
                                        <p className='lunch-text font-24 mt-40'>Welcome to Tron's emissary.</p>
                                        <img className='lunch-icon-b mt-30' src='assets/logo.png' />
                                    </div>
                                </Grid>
                                <Grid item xs={12} sm={12} md={6}>
                                    <div className='lunch-item text-center'>
                                        <img className='lunch-icon-b' src='assets/img/subwallet-logo.png' />
                                        <p className='lunch-text '>Tron Pay</p>
                                        <p className='lunch-text-sub text-underline'>Don't have Tron Pay? Download here</p>
                                        <div className='mt-30'>
                                            {
                                                <Button className='white-btn w-100' onClick={() => continues()}>Continue</Button>
                                            }
                                        </div>
                                    </div>
                                </Grid>
                            </>
                        }
                        {
                            connected &&
                            <>
                                <Grid item xs={12} sm={12} md={12}>
                                    {
                                        step == 0 &&
                                        <OutlinedInput
                                            className='emissary-name-box font-unbound'
                                            placeholder='Example: Emissary Team'
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                    }
                                    {
                                        step == 1 &&
                                        <OutlinedInput
                                            className='emissary-name-box font-unbound'
                                            placeholder='Example: tron'
                                            onChange={(e) => setDomain(e.target.value)}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <p className='prefix-global'>.emissary.global</p>
                                                </InputAdornment>}
                                        />
                                    }
                                    {
                                        step == 2 &&
                                        <div>
                                            <ColorPad activeIdx={(i: number) => setTheme(i)} actived={theme} />
                                        </div>
                                    }
                                    {
                                        step == 3 &&
                                        <div>
                                            <p className='text-color-white inter-font font-14'>Recommend an image with a ratio of 4:1 and transparent background for the perfect effect.</p>
                                            <ImageUploading
                                                multiple
                                                value={images}
                                                onChange={onChange}
                                                maxNumber={maxNumber}
                                                dataURLKey="data_url"
                                            >
                                                {({
                                                    imageList,
                                                    onImageUpload,
                                                    onImageUpdate,
                                                }) => (
                                                    <div className="upload__image-wrapper">
                                                        {
                                                            img == "" && <Button className='white-btn p-50-100 mt-20'><AddCircleOutlineOutlinedIcon className='font-30' onClick={onImageUpload} /></Button>
                                                        }
                                                        {
                                                            img != "" &&
                                                            <div className="image-item">
                                                                <img src={img} alt="" width="200" onClick={() => onImageUpdate(0)} />
                                                            </div>
                                                        }
                                                    </div>
                                                )}
                                            </ImageUploading>
                                        </div>
                                    }
                                    {
                                        step == 4 &&
                                        <>
                                            {
                                                assets.map((as, idx) => {
                                                    return (
                                                        <div key={idx} className='flex-start mt-10'>
                                                            <Button className='pink-btn-outline'>{as.name} - </Button>
                                                            <RemoveCircleOutlineOutlinedIcon className='font-30 white-text ml-10 cursor-point' onClick={() => delAsset(idx)} />
                                                        </div>
                                                    )
                                                })
                                            }
                                            <div className='flex-start mt-10'>
                                                <Select
                                                    value={asset.name}
                                                    onChange={handleChange}
                                                    displayEmpty
                                                    inputProps={{ 'aria-label': 'Without label' }}
                                                    className='sel-asset'
                                                >
                                                    {
                                                        tokenList.map((token, idx) => {
                                                            return (
                                                                <MenuItem key={idx} className='sel-item' value={token.name}>{token.name}</MenuItem>
                                                            )
                                                        })
                                                    }
                                                </Select>
                                                <AddCircleOutlineOutlinedIcon className='font-30 white-text ml-10 cursor-point' onClick={() => plusAsset()} />
                                            </div>
                                        </>

                                    }
                                    {
                                        step != 5 && step != 6 &&
                                        <div className='flex-start'>
                                            <Button className='skycolor-btn font-unbound mt-30 p0 mr-10' onClick={() => back()}><ArrowCircleLeftOutlinedIcon className='font-30' /></Button>
                                            <Button className='skycolor-btn font-unbound mt-30' onClick={() => proceed()}> {step == 4 ? "Create" : "Proceed"}  </Button>
                                        </div>
                                    }
                                    {
                                        step == 5 &&
                                        <div className='text-center mt-60'>
                                            <p className='pink-text unbound-font font-24'>Digesting your info...</p>
                                            <Lottie options={defaultOptions}
                                                height={300}
                                                width={300}
                                                isStopped={false}
                                                isPaused={false} />
                                            <p className='pink-text'>Note: Do not close the window during the process.</p>
                                        </div>
                                    }
                                </Grid>
                            </>
                        }
                    </Grid>
                </Container>
            </div>
            <Toaster />
        </>
    );
}

export default Index
