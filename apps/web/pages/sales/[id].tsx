import Router, { useRouter } from 'next/router';
import { useAccount, useNetwork } from 'wagmi';
import { chakra, Spinner } from '@chakra-ui/react';
import BulksaleV1, { SkeletonSale } from 'ui/components/templates/BulksaleV1/index';
import Layout from 'ui/components/layouts/layout';
import { useQuery } from '@apollo/client';
import { GET_SALE_QUERY } from 'ui/apollo/query';
import useSWRAuction from 'ui/hooks/useAuction';
import Render500 from 'ui/components/errors/500';
import Render404 from 'ui/components/errors/404';

export default function SalePage() {
    const { address, isConnected, connector } = useAccount();
    const router = useRouter();
    const { id } = router.query;
    

    // TODO Get template address from contractAddress
    // Switch template by using template address
    const { data: saleData, loading, error: apolloError, refetch } = useQuery(GET_SALE_QUERY, {variables: { id: id as string } });
    const { data: metaData, mutate, error: dynamodbError } = useSWRAuction(id as string);

    if(apolloError || dynamodbError) return <Layout Router={Router}><Render500 error={apolloError || dynamodbError} /></Layout>

    if(loading || !metaData) return <Layout Router={Router}><SkeletonSale /></Layout>

    if(!saleData) return <Layout Router={Router}><Render404 /></Layout>

    return (
        <Layout Router={Router}>
            <BulksaleV1
                sale={saleData.sale}
                refetchSale={refetch}
                metaData={metaData.metaData}
                refetchMetaData={mutate}
                contractAddress={id as `0x${string}`}
                address={address}
            />
        </Layout>
    )
}