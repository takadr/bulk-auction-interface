import Router, { useRouter } from 'next/router';
import { useAccount, useNetwork } from 'wagmi';
import { chakra} from '@chakra-ui/react';
import BulksaleV1 from 'ui/components/templates/BulksaleV1/index';
import Layout from 'ui/components/layouts/layout';

export default function SalePage() {
    const { chain } = useNetwork();
    const { address, isConnected, connector } = useAccount();
    const router = useRouter();
    const { id } = router.query;

    // TODO Get template address from contractAddress
    // Switch template by using template address
    return (
        <Layout>
            <BulksaleV1
                // title={`Contract: ${id}`}
                contractAddress={id as `0x${string}`}
                address={address}
            />
        </Layout>
    )
}