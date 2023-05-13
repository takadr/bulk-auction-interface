import { useContext } from 'react';
import Router, { useRouter } from 'next/router';
import { useAccount, useNetwork } from 'wagmi';
import { chakra, Spinner, Container, Box, Button, useDisclosure } from '@chakra-ui/react';
import Layout from 'ui/components/layouts/layout';
import { CurrentUserContext } from 'ui/components/providers/CurrentUserProvider';
import TokenFormModal from 'ui/components/TokenFormModal';
import SaleFormModal from 'ui/components/SaleFormModal';

export default function DashboardPage() {
    const { chain } = useNetwork();
    const { address, isConnected, connector } = useAccount();
    const { currentUser, mutate } = useContext(CurrentUserContext);
    const tokenFormModalDisclosure = useDisclosure();
    const saleFormModalDisclosure = useDisclosure();

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
            <Container maxW="container.lg" py={16}>
                <chakra.div>
                    <Button onClick={tokenFormModalDisclosure.onOpen}>Create new token</Button>
                    <TokenFormModal isOpen={tokenFormModalDisclosure.isOpen} onClose={tokenFormModalDisclosure.onClose} />
                </chakra.div>
                <chakra.div>
                    <Button onClick={saleFormModalDisclosure.onOpen}>Create new sale</Button>
                    <SaleFormModal isOpen={saleFormModalDisclosure.isOpen} onClose={saleFormModalDisclosure.onClose} />
                </chakra.div>
            </Container>
        </Layout>
    )
}