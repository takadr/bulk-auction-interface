import { useContext, useEffect } from 'react';
import { chakra, Alert, AlertIcon, Box, useToast } from '@chakra-ui/react';
import { useAccount, useDisconnect, useNetwork } from 'wagmi';
import { Header } from '../Header';
import { CurrentUserContext } from '../providers/CurrentUserProvider';

export default function Layout({title, children, Router}: {title?: string, children: React.ReactNode, Router: any}) {
    const { chain } = useNetwork();
    const { currentUser, mutate } = useContext(CurrentUserContext);
    const { address, isConnected, connector } = useAccount();
    const { disconnect } = useDisconnect();
    const toast = useToast({position: 'top-right', isClosable: true,})
    const logout = async() => {
        await fetch('/api/logout', { method: 'POST', credentials: 'same-origin' });
        disconnect(); 
        mutate && mutate()
    }

    // Detect account change and sign out if SIWE user and account does not match
    useEffect(() => {
        if(currentUser && currentUser.address != address) {
            // console.log("Address mismatch!! ", currentUser.address, address)
            logout()
            !toast.isActive('signout') && !toast.isActive('addressChanged') && toast({
                id: 'addressChanged',
                description: "Account change detected. Signed out.",
                status: 'info',
                duration: 5000,
            })
        }
    }, [address])

    return <>
    <Header title={title ? title : 'DFGC Sale Maker(仮)'} Router={Router} />
    {
        chain && chain.unsupported && 
        <chakra.div px={8}>
            <Alert status='warning' mb={4}>
                <AlertIcon /> Please connect to Sepolia
            </Alert>
        </chakra.div>
    }
    <>{children}</>
</>
}