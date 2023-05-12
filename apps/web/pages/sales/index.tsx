import { useContext } from 'react';
import Router, { useRouter } from 'next/router';
import { useAccount, useNetwork } from 'wagmi';
import { chakra, Container, Link, Alert, AlertIcon, Heading, Card, CardBody, CardFooter, Progress, Text, Image, Stack } from '@chakra-ui/react';
import { Header } from 'ui/components/Header';
import { useSWRAuctions } from 'ui/hooks/useAuctions';
import { MetaData } from 'ui/types/BulksaleV1';
import { CurrentUserContext } from 'ui/components/providers/CurrentUserProvider';

export default function SalePage() {
    const { currentUser, mutate } = useContext(CurrentUserContext);
    const { chain } = useNetwork();
    const { address, isConnected, connector } = useAccount();
    const { auctions, isLast, error, loadMoreAuctions } = useSWRAuctions({})
  
    return (
        <>
            <Header title={'Test Bulksale'} />
            {
                chain && chain.unsupported && 
                <chakra.div px={8}>
                    <Alert status='warning' mb={4}>
                        <AlertIcon /> Please connect to Sepolia
                    </Alert>
                </chakra.div>
            }

            <Container maxW="container.lg" py={16}>
                <Heading>Active Sales (TODO Filtering)</Heading>
                <Stack mt={4} spacing={8}>
                {
                    auctions.map((auction: MetaData) => {
                    return <Link href={`/sales/${auction.id}`}>
                    <Card
                        direction={{ base: 'column', sm: 'row' }}
                        overflow='hidden'
                        variant='outline'
                        >
                            <Image
                            objectFit='cover'
                            maxW={{ base: '100%', sm: '200px' }}
                            src={auction.logoURL}
                            alt={auction.title}
                            />
                        
                            <Stack>
                                <CardBody>
                                    <Heading size='md'>{auction.title}</Heading>
                            
                                    <Text py='2'>
                                    {auction.description}
                                    </Text>
                                </CardBody>
                            
                                <CardFooter>
                                    <Progress hasStripe value={(10/auction.finalGoalAmount) * 100} />
                                </CardFooter>
                            </Stack>
                        </Card>
                        </Link>
                    })
                }
                </Stack>
            </Container>
            
        </>
    )
}