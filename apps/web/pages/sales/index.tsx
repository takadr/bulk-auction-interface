import { useContext, useState } from 'react';
import Router, { useRouter } from 'next/router';
import { useAccount, useNetwork } from 'wagmi';
import { chakra, Spinner, Container, Button, Link, Heading, Card, CardBody, CardFooter, Progress, Text, Image, Stack, Flex, Tag, useInterval } from '@chakra-ui/react';
import { useQuery } from "@apollo/client";
import { MetaData, Sale } from 'ui/types/BulksaleV1';
import { CurrentUserContext } from 'ui/components/providers/CurrentUserProvider';
import Layout from 'ui/components/layouts/layout';
import SaleCard from 'ui/components/SaleCard';
import { LIST_SALE_QUERY, GET_SALE_QUERY }  from 'ui/apollo/query';
import { useSWRSales } from 'ui/hooks/useSales';

export default function SalePage() {
    const { currentUser, mutate } = useContext(CurrentUserContext);
    // const { data, loading, error, } = useQuery(LIST_SALE_QUERY, { variables: {skip: 0, first: 1}});
    const { sales, isLast, isLoading, error, loadMoreSales } = useSWRSales({});
    const [now, setNow] = useState<number>(Math.floor(Date.now() / 1000));

    useInterval(() => {
        setNow(Math.floor(Date.now() / 1000))
    }, 500);
  
    return (
        <Layout>
            <Container maxW="container.xl" py={16}>
                <Heading>Active Sales (TODO Filtering)</Heading>
                <Stack mt={4} spacing={8}>
                {
                    isLoading ? <Spinner /> : sales.map((sale: Sale) => {
                        return <SaleCard sale={sale} now={now} />
                    })
                }
                {
                    !isLast && <Button onClick={loadMoreSales}>Load more sale</Button>
                }
                </Stack>
            </Container>
        </Layout>
    )
}