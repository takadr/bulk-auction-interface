import Router, { useRouter } from 'next/router';
import { useAccount, useNetwork } from 'wagmi';
import { chakra, Skeleton } from '@chakra-ui/react';
import BulksaleV1 from 'ui/components/templates/BulksaleV1/index';
import Layout from 'ui/components/layouts/layout';
import { useQuery } from '@apollo/client';
import { GET_SALE_QUERY } from 'ui/apollo/query';
import useSWRAuction from 'ui/hooks/useAuction';

export default function SalePage() {
    const { chain } = useNetwork();
    const { address, isConnected, connector } = useAccount();
    const router = useRouter();
    const { id } = router.query;
    

    // TODO Get template address from contractAddress
    // Switch template by using template address
    const { data: saleData, loading, error: test, refetch } = useQuery(GET_SALE_QUERY, {variables: { id: id as string } });
    const { data: metaData, mutate, error } = useSWRAuction(id as string);

    // TODO 
    if(loading || !metaData) {
        return <Skeleton />
    }
    return (
        <Layout>
            <BulksaleV1
                sale={saleData.sale}
                metaData={metaData.metaData}
                contractAddress={id as `0x${string}`}
                address={address}
            />
        </Layout>
    )
}