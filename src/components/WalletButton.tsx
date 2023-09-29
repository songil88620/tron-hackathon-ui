import * as React from 'react';
// import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { WalletActionButton, } from '@tronweb3/tronwallet-adapter-react-ui';
import { useWallet, } from '@tronweb3/tronwallet-adapter-react-hooks';


interface Props { }

const WalletButton: React.FC<Props> = ({ }) => {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const { address } = useWallet()  

    const beautyAddress = (adrs: string) => {
        return adrs.substring(0, 4) + "..." + adrs.substring(adrs.length - 4, adrs.length)
    }

    return (
        <WalletActionButton className='wallet-btn'>{address == null ? "Connect Wallet" : beautyAddress(address)}</WalletActionButton>
    );
}

export default WalletButton;
