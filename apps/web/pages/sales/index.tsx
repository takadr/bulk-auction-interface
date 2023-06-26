import { Container, Button, Text, Tabs, TabList, Tab, TabPanels, TabPanel, Stack, Flex, Alert, AlertIcon } from '@chakra-ui/react';
import { Sale } from 'lib/types/Sale';
import Layout from 'ui/components/layouts/layout';
import SaleCard, { SaleCardSkeleton } from 'ui/components/SaleCard';
import { QueryType, useSWRSales } from 'ui/hooks/useSales';

export default function SalePage() {
    const { sales: activeSales, isLast: isLastActiveSales, isLoading: isLoadingActiveSales, isValidating: isValidatingActiveSales, error: activeSalesError, loadMoreSales: loadMoreActiveSales } = useSWRSales({});
    // const { sales: activeSales, isLast: isLastActiveSales, isLoading: isLoadingActiveSales, isValidating: isValidatingActiveSales, error: activeSalesError, loadMoreSales: loadMoreActiveSales } = useSWRSales({}, QueryType.ACTIVE);
    // const { sales: upcomingSales, isLast: isLastUpcomingSales, isLoading: isLoadingUpcomingSales, isValidating: isValidatingUpcomingSales, error: upcomingSalesError, loadMoreSales: loadMoreUpcomingSales } = useSWRSales({}, QueryType.UPCOMING);
    const { sales: closedSales, isLast: isLastClosedSales, isLoading: isLoadingClosedSales, isValidating: isValidatingClosedSales, error: closedSalesError, loadMoreSales: loadMoreClosedSales } = useSWRSales({}, QueryType.CLOSED);
  
    return (
        <Layout>
            <Container maxW="container.xl" py={16}>
            <Tabs variant='soft-rounded' colorScheme='green'>
                <TabList>
                    <Tab fontSize={{base: 'sm', md: 'md'}}>Live & Upcoming Sales</Tab>
                    {/* <Tab fontSize={{base: 'sm', md: 'md'}}>Live Sales</Tab>
                    <Tab fontSize={{base: 'sm', md: 'md'}}>Upcoming Sales</Tab> */}
                    <Tab fontSize={{base: 'sm', md: 'md'}}>Ended Sales</Tab>
                </TabList>
                <TabPanels mt={4}>
                    <TabPanel p={{base: 0, md: 4}}>
                        <Stack spacing={8}>
                            {
                                activeSalesError && <Alert status={'error'}><AlertIcon />{activeSalesError.message}</Alert>
                            }
                            {
                                isLoadingActiveSales ? <>
                                    <SaleCardSkeleton /><SaleCardSkeleton /><SaleCardSkeleton />
                                </> 
                                : activeSales.map((sale: Sale) => {
                                    return <SaleCard key={sale.id} sale={sale} />
                                })
                            }
                            {
                                !isLastActiveSales && activeSales.length > 0 && <Button isLoading={isLoadingActiveSales || isValidatingActiveSales} onClick={loadMoreActiveSales}>Load more sale</Button>
                            }
                            {
                                !isLoadingActiveSales && activeSales.length === 0 && <Flex minH={'25vh'} justifyContent='center' alignItems={'center'}>
                                    <Text fontSize={'lg'} opacity={'.75'} textAlign={'center'}>No sales</Text>
                                </Flex>
                            }
                        </Stack>
                    </TabPanel>

                    {/* <TabPanel p={{base: 0, md: 4}}>
                        <Stack spacing={8}>
                            {
                                upcomingSalesError && <Alert status={'error'}><AlertIcon />{upcomingSalesError.message}</Alert>
                            }
                            {
                                isLoadingUpcomingSales ? <>
                                    <SaleCardSkeleton /><SaleCardSkeleton /><SaleCardSkeleton />
                                </> 
                                : upcomingSales.map((sale: Sale) => {
                                    return <SaleCard key={sale.id} sale={sale} />
                                })
                            }
                            {
                                !isLastUpcomingSales && upcomingSales.length > 0 && <Button isLoading={isLoadingUpcomingSales || isValidatingUpcomingSales} onClick={loadMoreUpcomingSales}>Load more sale</Button>
                            }
                            {
                                !isLoadingUpcomingSales && upcomingSales.length === 0 && <Flex minH={'25vh'} justifyContent='center' alignItems={'center'}>
                                    <Text fontSize={'lg'} opacity={'.75'} textAlign={'center'}>No sales</Text>
                                </Flex>
                            }
                        </Stack>
                    </TabPanel> */}

                    <TabPanel p={{base: 0, md: 4}}>
                        <Stack spacing={8}>
                            {
                                closedSalesError && <Alert status={'error'}><AlertIcon />{closedSalesError.message}</Alert>
                            }
                            {
                                isLoadingClosedSales ? <>
                                    <SaleCardSkeleton /><SaleCardSkeleton /><SaleCardSkeleton />
                                </>  
                                : closedSales.map((sale: Sale) => {
                                    return <SaleCard key={sale.id} sale={sale} />
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