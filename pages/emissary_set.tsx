import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import Visibility from '@mui/icons-material/Visibility';
import InputAdornment from '@mui/material/InputAdornment';
import FileCopyOutlinedIcon from '@mui/icons-material/FileCopyOutlined';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import RemoveCircleOutlineOutlinedIcon from '@mui/icons-material/RemoveCircleOutlineOutlined';
import { Divider, IconButton, InputBase, MenuItem, Button, Paper, Select, SelectChangeEvent } from '@mui/material';
import ColorPad from '../src/components/ColorPad';
import { useEffect, useState } from 'react';
import { apiHost, networkList, roles, tokenList } from '../src/utils/constant';
import axios from 'axios';
import ImageUploading from 'react-images-uploading';
import toast, { Toaster } from 'react-hot-toast';
import { Asset, Controller } from '../src/utils/types'; 
import { Props } from '../src/utils/types';


interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
            className='tab-pad'
        >
            {value === index && (
                <div>
                    {children}
                </div>
            )}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
} 
 

const SetEmissary: React.FC<Props> = ({ address, connected }) => {
    const [id, setId] = useState("") 
    const [owner, setOwner] = useState("")
    const [name, setName] = useState("");
    const [domain, setDomain] = useState("");
    const [theme, setTheme] = useState(0);
    const [img, setImg] = useState("");
    const [assets, setAssets] = useState<Asset[]>([]);
    const [code, setCode] = useState("");
    const [controllers, setControllers] = useState<Controller[]>([]);
    const [everyone, setEveryone] = useState(false)
    const [holder, setHolder] = useState(false);
    const [contract, setContract] = useState("");
    const [network, setNetwork] = useState("Tron Mainnet");

    const [asset, setAsset] = useState(tokenList[0])
    const [role, setRole] = useState("Admin")
    const [con, setCon] = useState("");
    const [value, setValue] = React.useState(0);
    const [images, setImages] = React.useState([]);
    const maxNumber = 1;

    useEffect(() => {
        if (address != "") {
            getEmissary(address)
        }
    }, [address])

    useEffect(() => {

    }, [])

    const getEmissary = async (address: string) => {
        console.log(">>add", address)
        const res = await axios.get(apiHost + 'emissary/' + address)
        console.log(">>>REs", res)
        if (res.data != "") {
            const data = res.data;
            setId(data._id)
            setOwner(data.owner)
            setName(data.name)
            setDomain(data.domain)
            setTheme(data.theme)
            setImg(data.img)
            setCode(data.code)
            setAssets(data.assets)
            setControllers(data.controllers)
            setEveryone(data.nft.everyone)
            setHolder(data.nft.holder)
            setContract(data.nft.contract)
            setNetwork(data.nft.network)
        }
    }

    const updateEmissary = async () => {
        try {
            const data = {
                id,
                name,
                theme,
                img,
                assets,
                controllers,
                nft: {
                    everyone,
                    holder,
                    contract,
                    network
                }
            }
            const res = await axios.put(apiHost + 'emissary', data)
            console.log(">>>RE", res)
            if (res.status == 200) {
                toast.success("Updated Successfully!", { position: 'top-right' })
            } else {
                toast.error("Update Failed!", { position: 'top-right' })
            }
        } catch (e) {
            toast.error("Update Failed!", { position: 'top-right' })
        }
    }


    const handleTab = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const handleAsset = (event: SelectChangeEvent) => {
        setRole(event.target.value)
    };

    const handleRole = (event: SelectChangeEvent) => {
        setRole(event.target.value)
    };

    const handleChange = (event: SelectChangeEvent) => {
        const v = event.target.value
        const t = tokenList.filter((tl) => tl.name == v)
        setAsset(t[0]);
    };

    const handleNetwork = (event: SelectChangeEvent) => {
        const v = event.target.value
        //const t = tokenList.filter((tl) => tl.name == v)
        setNetwork(v)
    };

    const onChange = (imageList: any, addUpdateIndex: any) => {
        setImg(imageList[0].data_url);
    };

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

    const plusControlller = () => {
        var as = controllers;
        const isin = as.filter((a) => a.address == con)
        if (isin.length == 0) {
            const c = {
                address: con,
                role: role
            }
            as.push(c);
            setControllers([...as]);
        }
    }

    const delController = (idx: number) => {
        var as = controllers;
        as.splice(idx, 1);
        setControllers([...as]);
    }


    return (
        <>
            <div className='semi-header'>
                <div>
                    <div className="tab-pad-wrap" >
                        <Tabs variant="scrollable" scrollButtons="auto" value={value} onChange={handleTab} className='tab-indicator' >
                            <Tab className='tab-pad' label="General Info & Whitelabel" {...a11yProps(0)} />
                            <Tab className='tab-pad' label="NFT Access" {...a11yProps(1)} />
                            <Tab className='tab-pad' label="Emissary Roles" {...a11yProps(2)} />
                        </Tabs>
                    </div>
                    <Divider />
                    <CustomTabPanel value={value} index={0} >
                        <div className='semi-body'>
                            <div className='diag-input-item'>
                                <p className='p-diag-titles'>Name of emissary</p>
                                <input className='pol-input' value={name} onChange={(e) => setName(e.target.value)} />
                            </div>
                            <div className='diag-input-item'>
                                <p className='p-diag-titles'>Emissary Unique Code</p>
                                <p className='m-0-0 w-600 font-light font-12 text-color-grey inter-font'>
                                    This unique code is generated at the time you create the emissary and cannot be changed. Your client can use this unique code to direct to your emissary homepage (without the need of URL).
                                </p>
                                <OutlinedInput
                                    value={code}
                                    className='ador-input-1 pink-text font-light mt-15'
                                    endAdornment={<InputAdornment position="end">
                                        <FileCopyOutlinedIcon className='pink-text font-20 cursor-point' onClick={() => navigator.clipboard.writeText(code)} />
                                    </InputAdornment>}
                                    inputProps={{
                                        'aria-label': 'weight',
                                    }}
                                />
                            </div>
                            <div className='diag-input-item'>
                                <p className='p-diag-titles'>Custom Emissary URL Subdomain </p>
                                <p className='m-0-0 w-600 font-light font-12 text-color-grey inter-font'>
                                    This custom slug is provided by yourself during the creation of this emissary and cannot be changed. Your client can use this URL with your custom subdomain to direct to your emissary homepage.
                                </p>
                                <OutlinedInput
                                    value={domain}
                                    className='ador-input-1 pink-text font-light mt-15'
                                    endAdornment={<InputAdornment position="end">
                                        <FileCopyOutlinedIcon className='pink-text font-20 cursor-point' onClick={() => navigator.clipboard.writeText(domain)} />
                                    </InputAdornment>}
                                    inputProps={{
                                        'aria-label': 'weight',
                                    }}
                                />
                            </div>
                            <div className='diag-input-item'>
                                <p className='p-diag-titles'>Utilize Asset(s)</p>
                                <p className='m-0-0 w-600 font-light font-12 text-color-grey inter-font'>
                                    Add asset(s) that will be using in this emissary for transfer requests and safes payout.
                                </p>
                                {
                                    assets.map((as, idx) => {
                                        return (
                                            <div key={idx} className='flex-start mt-10'>
                                                <Button className='pink-btn-outline'>{as.name} - </Button>
                                                <RemoveCircleOutlineOutlinedIcon className='font-24 pink-text ml-10 cursor-point' onClick={() => delAsset(idx)} />
                                            </div>
                                        )
                                    })
                                }
                                <div className='flex-start  w-600 mt-15'>
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
                                    <AddCircleOutlineOutlinedIcon className='font-24 pink-text ml-10 cursor-point' onClick={() => plusAsset()} />
                                </div>
                            </div>
                            <div className='diag-input-item w-600 flex-start-top'>
                                <div>
                                    <p className='p-diag-titles'>Logo Image</p>
                                    <p className='processing-stamp font-12 m-0-3 font-light'> Upload your NFT media. Supporting JPEG, PNG and GIF. Maximum size is 100 MB.</p>
                                </div>
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
                                                img == "" && <Button className='grey-btn p-50-100 mt-20'><AddCircleOutlineOutlinedIcon className='font-30' onClick={onImageUpload} /></Button>
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
                            <div className='diag-input-item '>
                                <p className='p-diag-titles'>Choose a colour theme</p>
                                <ColorPad activeIdx={(i: number) => setTheme(i)} actived={theme} />
                            </div>
                            <Divider className='mt-40' />
                            <div className='btn-group-start mt-30'>
                                <Button variant="outlined" className='pink-btn' onClick={() => updateEmissary()}>Save Changes</Button>
                            </div>
                        </div>

                    </CustomTabPanel>
                    <CustomTabPanel value={value} index={1}>
                        <div className='semi-body'>
                            <div className='diag-input-item'>
                                <p className='p-diag-titles'>Emissary Access Method</p>
                                <p className='font-12 text-color-grey font-light'>
                                    Choose only one access method from the two below.
                                </p>
                                <p className='p-diag-titles'>
                                    <label className='custom-check'>
                                        <input type="checkbox" onChange={(e) => setEveryone(e.target.checked)} checked={everyone} />
                                        <span className='font-14'>Access open for everyone (Default)</span>
                                    </label>
                                </p>
                                <p className='text-color-grey w-600 ml-25 font-12 font-light'>
                                    By enabling this, you can bond an NFT collection to this program. When your client is an holder of this NFT collection and creating a transfer request, he/she can choose to use Auto Request Submission where all the info of the transfer request will automatically fill in for him/her. Perfect to a program where the amount of transfer request is the same!
                                </p>
                                <div className='diag-input-item'>
                                    <div>
                                        <p className='p-diag-titles'>
                                            <label className='custom-check'>
                                                <input type="checkbox" onChange={(e) => setHolder(e.target.checked)} checked={holder} />
                                                <span className='font-14'>Access open for NFT collection holders only</span>
                                            </label>
                                        </p>
                                        <p className='text-color-grey w-600 ml-25 font-12 font-light'>
                                            Only certain NFT collection holder can access to this emissary after connecting their wallet at my emissary homepage. Perfect for community with an NFT collection as an identity!
                                        </p>
                                    </div>
                                    <div className='item-wrap ml-25 mt-15'>
                                        <div className='diag-input-item'>
                                            <p className='p-diag-titles'>NFT contract address</p>
                                            <input className='pol-input' value={contract} onChange={(e) => setContract(e.target.value)} />
                                        </div>
                                        <div className='diag-input-item'>
                                            <p className='p-diag-titles'>Select a network</p>
                                            <Select
                                                value={network}
                                                displayEmpty
                                                inputProps={{ 'aria-label': 'Without label' }}
                                                className='sel-asset'
                                                onChange={handleNetwork}
                                            >
                                                {
                                                    networkList.map((n) => {
                                                        return (
                                                            <MenuItem key={n} className='sel-item' value={n}>{n}</MenuItem>
                                                        )
                                                    })
                                                }
                                            </Select>
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <Divider className='mt-40' />
                            <div className='btn-group-start mt-30'>
                                <Button variant="outlined" className='pink-btn' onClick={() => updateEmissary()}>Save Changes</Button>
                            </div>
                        </div>
                    </CustomTabPanel>
                    <CustomTabPanel value={value} index={2}>
                        <div className='semi-body'>
                            <div className='diag-input-item'>
                                <p className='p-diag-titles '>Controllers</p>
                                <p className='m-0-0 w-900 font-light font-12 text-color-grey inter-font'>
                                    Wallet address that being assigned as a controller will able to access to transfer request, safes, programs tabs.
                                    However, controllers have no access to the emissary settings, only you as an admin have the rights to change the settings.
                                </p>
                                {
                                    controllers.map((as: Controller, idx) => {
                                        return (
                                            <div key={idx} className='flex-start mt-10'>
                                                <Button className='pink-btn-outline'>{as.address} : {as.role} </Button>
                                                <RemoveCircleOutlineOutlinedIcon className='font-24 pink-text ml-10 cursor-point' onClick={() => delController(idx)} />
                                            </div>
                                        )
                                    })
                                }
                                <div className='flex-start w-600 mt-30'>
                                    <OutlinedInput
                                        className='ador-input-2 font-light'
                                        value={con}
                                        onChange={(e) => setCon(e.target.value)}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <Select
                                                    displayEmpty
                                                    inputProps={{ 'aria-label': 'Without label' }}
                                                    className='sel-asset-mid font-14 left-in-sel'
                                                    value={role}
                                                    onChange={handleRole}
                                                >
                                                    {
                                                        roles.map((r, idx) => {
                                                            return (
                                                                <MenuItem className='font-14' key={idx} value={r}>{r}</MenuItem>
                                                            )
                                                        })
                                                    }
                                                </Select>
                                            </InputAdornment>}
                                        inputProps={{
                                            'aria-label': 'weight',
                                        }}
                                    />

                                    <AddCircleOutlineOutlinedIcon className='font-24 pink-text ml-10 cursor-point' onClick={() => plusControlller()} />
                                </div>
                            </div>
                            <Divider className='mt-40' />
                            <div className='btn-group-start mt-30'>
                                <Button variant="outlined" className='pink-btn' onClick={() => updateEmissary()}>Save Changes</Button>
                            </div>
                        </div>
                    </CustomTabPanel>
                </div>
            </div>
            <Toaster />
        </>

    );
}

export default SetEmissary