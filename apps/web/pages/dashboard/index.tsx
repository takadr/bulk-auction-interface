import { useContext } from 'react';
import Router, { useRouter } from 'next/router';
import { useAccount, useNetwork } from 'wagmi';
import { chakra, Spinner, Container, Flex, Heading, Box, Button, Tabs, TabList, TabPanels, Tab, TabPanel, Card, CardBody, CardFooter, Progress, Text, Image, Stack, Link, useDisclosure } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import Layout from 'ui/components/layouts/layout';
import { CurrentUserContext } from 'ui/components/providers/CurrentUserProvider';
import TokenFormModal from 'ui/components/TokenFormModal';
import SaleFormModal from 'ui/components/SaleFormModal';
import { useSWRAuctions } from 'ui/hooks/useAuctions';
import { MetaData } from 'ui/types/BulksaleV1';
import SaleCard from 'ui/components/SaleCard';

export default function DashboardPage() {
    const { chain } = useNetwork();
    const { address, isConnected, connector } = useAccount();
    const { currentUser, mutate } = useContext(CurrentUserContext);
    const tokenFormModalDisclosure = useDisclosure();
    const saleFormModalDisclosure = useDisclosure();
    // TODO Get currentUser's sales and tokens
    const { auctions, isLast, error, loadMoreAuctions } = useSWRAuctions({})

    if(typeof currentUser === 'undefined') {
        return <Layout>
            <Container maxW="container.lg" py={16} textAlign='center'>
                <Spinner />
            </Container>
        </Layout>
    } else if (currentUser === null) {
        <Layout>
            <Container maxW="container.lg" py={16}>
                <Box>404</Box>
            </Container>
        </Layout>
    }
    
    return (
        <Layout>
            <Container maxW="container.xl" py={16}>
                <Heading size={'lg'}>Dashboard</Heading>
                <Tabs mt={8}>
                    <TabList>
                        <Tab>Sales</Tab>
                        <Tab>Tokens</Tab>
                    </TabList>

                    <TabPanels>
                        <TabPanel>
                            <chakra.div textAlign={'right'}>
                                {/* <Heading size={'md'}>Your sales(TODO)</Heading> */}
                                <Button onClick={saleFormModalDisclosure.onOpen}><AddIcon fontSize={'sm'} mr={2} />Create new sale</Button>
                            </chakra.div>
                            <SaleFormModal isOpen={saleFormModalDisclosure.isOpen} onClose={saleFormModalDisclosure.onClose} />
                            <Stack mt={4} spacing={8}>
                                {
                                    auctions.map((auction: MetaData) => {
                                        return <SaleCard auction={auction} />
                                    })
                                }
                                </Stack>
                        </TabPanel>
                        <TabPanel>
                            <chakra.div textAlign={'right'}>
                                {/* <Heading size={'lg'}>Your tokens(TODO)</Heading> */}
                                <Button onClick={tokenFormModalDisclosure.onOpen}><AddIcon fontSize={'sm'} mr={2} />Create new token</Button>
                            </chakra.div>
                            <TokenFormModal isOpen={tokenFormModalDisclosure.isOpen} onClose={tokenFormModalDisclosure.onClose} />
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Container>
        </Layout>
    )
}