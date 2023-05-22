import { useContext, useState } from 'react';
import Router, { useRouter } from 'next/router';
import { useAccount, useNetwork } from 'wagmi';
import { chakra, Spinner, Container, Button, Box, Text, Tabs, TabList, Tab, TabPanels, TabPanel, Stack, Flex, Tag, useInterval, Alert, AlertIcon } from '@chakra-ui/react';
import { useQuery } from "@apollo/client";
import { MetaData, Sale } from 'ui/types/BulksaleV1';
import { CurrentUserContext } from 'ui/components/providers/CurrentUserProvider';
import Layout from 'ui/components/layouts/layout';
import SaleCard, { SaleCardSkeleton } from 'ui/components/SaleCard';
import { useSWRActiveSales } from 'ui/hooks/useActiveSales';
import { useSWRClosedSales } from 'ui/hooks/useClosedSales';

export default function SalePage() {
    const { currentUser, mutate } = useContext(CurrentUserContext);
    const { sales: activeSales, isLast: isLastActiveSales, isLoading: isLoadingActiveSales, isValidating: isValidatingActiveSales, error: activeSalesError, loadMoreSales: loadMoreActiveSales } = useSWRActiveSales({});
    const { sales: closedSales, isLast: isLastClosedSales, isLoading: isLoadingClosedSales, isValidating: isValidatingClosedSales, error: closedSalesError, loadMoreSales: loadMoreClosedSales } = useSWRClosedSales({});
    const [now, setNow] = useState<number>(Math.floor(Date.now() / 1000));

    useInterval(() => {
        setNow(Math.floor(Date.now() / 1000))
    }, 500);
  
    return (
        <Layout Router={Router}>
            <Container maxW="container.xl" py={16}>
            <Tabs variant='soft-rounded' colorScheme='green'>
                <TabList>
                    <Tab>Active & Upcomming Sales</Tab>
                    <Tab>Closed Sales</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <Stack mt={4} spacing={8}>
                            {
                                activeSalesError && <Alert status={'error'}><AlertIcon />{activeSalesError.message}</Alert>
                            }
                            {
                                isLoadingActiveSales ? <>
                                    <SaleCardSkeleton /><SaleCardSkeleton /><SaleCardSkeleton />
                                </> 
                                : activeSales.map((sale: Sale) => {
                                    return <SaleCard key={sale.id} sale={sale} now={now} />
                                })
                            }
                            {
                                !isLastActiveSales && activeSales.length > 0 && <Button isLoading={isLoadingActiveSales || isValidatingActiveSales} onClick={loadMoreActiveSales}>Load more sale</Button>
                            }
                            {
                                !isLoadingClosedSales && activeSales.length === 0 && <Flex minH={'25vh'} justifyContent='center' alignItems={'center'}>
                                    <Text fontSize={'lg'} opacity={'.75'} textAlign={'center'}>No sales</Text>
                                </Flex>
                            }
                        </Stack>
                    </TabPanel>
                    <TabPanel>
                        <Stack mt={4} spacing={8}>
                            {
                                closedSalesError && <Alert status={'error'}><AlertIcon />{closedSalesError.message}</Alert>
                            }
                            {
                                isLoadingClosedSales ? <>
                                    <SaleCardSkeleton /><SaleCardSkeleton /><SaleCardSkeleton />
                                </>  
                                : closedSales.map((sale: Sale) => {
                                    return <SaleCard key={sale.id} sale={sale} now={now} />
                                })
                            }
                            {
                                !isLastClosedSales && closedSales.length > 0 && <Button isLoading={isLoadingClosedSales || isValidatingClosedSales} onClick={loadMoreClosedSales}>Load more sale</Button>
                            }
                            {
                                !isLoadingClosedSales && closedSales.length === 0 && <Flex minH={'25vh'} justifyContent='center' alignItems={'center'}>
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