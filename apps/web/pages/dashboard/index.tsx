import { useContext, useState } from 'react';
import Router, { useRouter } from 'next/router';
import { useAccount, useNetwork } from 'wagmi';
import { chakra, Spinner, Container, Flex, Heading, Box, Button, Tabs, TabList, TabPanels, Tab, TabPanel, Card, CardBody, CardFooter, Progress, Text, Image, Stack, Link, useDisclosure, useInterval } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import Layout from 'ui/components/layouts/layout';
import { CurrentUserContext } from 'ui/components/providers/CurrentUserProvider';
import SaleFormModal from 'ui/components/SaleFormModal';
import { useQuery, useApolloClient } from "@apollo/client";
import { MetaData, Sale } from 'ui/types/BulksaleV1';
import SaleCard, { SaleCardSkeleton } from 'ui/components/SaleCard';
import { LIST_MY_SALE_QUERY, GET_SALE_QUERY }  from 'ui/apollo/query';
import Render404 from 'ui/components/errors/404';

export default function DashboardPage() {
    const { chain } = useNetwork();
    const { address, isConnected, connector } = useAccount();
    const { currentUser, mutate } = useContext(CurrentUserContext);
    const saleFormModalDisclosure = useDisclosure();
    const { data, loading, error: test, refetch } = useQuery(LIST_MY_SALE_QUERY, {variables: { id: address} });
    const [now, setNow] = useState<number>(Math.floor(Date.now() / 1000));

    useInterval(() => {
        setNow(Math.floor(Date.now() / 1000))
    }, 500);

    if(typeof currentUser === 'undefined') {
        return <Layout>
            <Container maxW="container.lg" py={16} textAlign='center'>
                <Spinner />
            </Container>
        </Layout>
    } else if (currentUser === null) {
        Router.push('/')
        return <Layout>
            <Render404 />
        </Layout>
    }
    
    return (
        <Layout>
            <Container maxW="container.xl" py={16}>
                <Heading size={'lg'}>Dashboard</Heading>
                <Tabs mt={8}>
                    <TabList>
                        <Tab>Your Sales</Tab>
                    </TabList>

                    <TabPanels>
                        <TabPanel>
                            <chakra.div textAlign={'right'}>
                                <Button onClick={saleFormModalDisclosure.onOpen}><AddIcon fontSize={'sm'} mr={2} />Create new sale</Button>
                            </chakra.div>
                            <SaleFormModal isOpen={saleFormModalDisclosure.isOpen} onClose={saleFormModalDisclosure.onClose} onSubmitSuccess={refetch} />
                            <Stack mt={4} spacing={8}>
                                {
                                    loading || !data ? <>
                                    <SaleCardSkeleton /><SaleCardSkeleton /><SaleCardSkeleton />
                                    </> 
                                    : data.sales.map((sale: Sale) => {
                                        return <SaleCard key={sale.id} sale={sale} now={now} editable />
                                    })
                                }
                                {
                                    !loading && data && data.sales.length === 0 && <Flex minH={'25vh'} justifyContent='center' alignItems={'center'}>
                                        <Text fontSize={'lg'} opacity={'.75'} textAlign={'center'}>No sales</Text>
                                    </Flex>
                                }
                            </Stack>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Container>
        </Layout>
    )
}