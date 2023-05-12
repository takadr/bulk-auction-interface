import Router, { useRouter } from 'next/router';
import { useAccount, useNetwork } from 'wagmi';
import { chakra, Alert, AlertIcon } from '@chakra-ui/react';
import BulksaleV1 from 'ui/components/templates/BulksaleV1/index';
import { Header } from 'ui/components/Header';

export default function SalePage() {
    const { chain } = useNetwork();
    const { address, isConnected, connector } = useAccount();
    const router = useRouter();
    const { id } = router.query;

    // TODO Get template address from contractAddress
    // Switch template by using template address
    return (
        <>
            <Header title={'Test Bulksale'} />
            {
                chain && chain.unsupported && 
                <chakra.div px={8}>
                    <Alert status='warning' mb={4}>
                        <AlertIcon /> Please connect to Sepolia
                    </Alert>
                </chakra.div>
            }
            <BulksaleV1
                // title={`Contract: ${id}`}
                contractAddress={id as `0x${string}`}
                address={address}
            />
        </>
    )
}