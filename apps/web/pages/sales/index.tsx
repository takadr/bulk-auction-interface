import { useContext } from 'react';
import Router, { useRouter } from 'next/router';
import { useAccount, useNetwork } from 'wagmi';
import { chakra, Container, Link, Heading, Card, CardBody, CardFooter, Progress, Text, Image, Stack, Flex, Tag } from '@chakra-ui/react';
import { useSWRAuctions } from 'ui/hooks/useAuctions';
import { MetaData } from 'ui/types/BulksaleV1';
import { CurrentUserContext } from 'ui/components/providers/CurrentUserProvider';
import Layout from 'ui/components/layouts/layout';
import SaleCard from 'ui/components/SaleCard';

export default function SalePage() {
    const { currentUser, mutate } = useContext(CurrentUserContext);
    const { auctions, isLast, error, loadMoreAuctions } = useSWRAuctions({});
  
    return (
        <Layout>
            <Container maxW="container.lg" py={16}>
                <Heading>Active Sales (TODO Filtering)</Heading>
                <Stack mt={4} spacing={8}>
                {
                    auctions.map((auction: MetaData) => {
                    return <SaleCard auction={auction} />
                    })
                }
                </Stack>
            </Container>
        </Layout>
    )
}