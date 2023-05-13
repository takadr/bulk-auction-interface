import { chakra, Alert, AlertIcon, Box } from '@chakra-ui/react';
import { useAccount, useNetwork } from 'wagmi';
import { Header } from '../Header';


export default function Layout({title, children}: {title?: string, children: React.ReactNode}) {
    const { chain } = useNetwork();

    return <>
    <Header title={title ? title : 'DFGC Sale Maker(仮)'} />
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