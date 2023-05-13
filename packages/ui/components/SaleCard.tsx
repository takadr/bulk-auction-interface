import { useEffect } from 'react';
import { chakra, Heading, Card, CardBody, CardFooter, Progress, Text, Image, Stack, Link, Flex } from '@chakra-ui/react';
import { useContractEvent, useContractRead } from 'wagmi';
import Big from '../utils/bignumber';
import { MetaData } from '../types/BulksaleV1';
import bulksaleV1ABI from '../constants/abis/BulksaleV1.json';
import useBulksaleV1 from '../hooks/BulksaleV1/useBulksaleV1';

export default function SaleCard({ auction }: { auction: MetaData }){
    const {data: totalProvided, refetch} = useContractRead({
        address: auction.id as `0x${string}`,
        abi: bulksaleV1ABI,
        functionName: 'totalProvided',
        staleTime: 1000,
        cacheTime: 1000,
    });
    useContractEvent({
        address: auction.id as `0x${string}`,
        abi: bulksaleV1ABI,
        eventName: 'Received',
        listener() {
            refetch();
        },
    });

    return <Link href={`/sales/${auction.id}`} _hover={{textDecoration: 'none'}}>
    <Card
        direction={{ base: 'column', sm: 'row' }}
        overflow='hidden'
        // variant='outline'
        >
            <Image
            objectFit='contain'
            maxW={{ base: '100%', sm: '200px' }}
            src={auction.logoURL ? auction.logoURL : 'https://dummyimage.com/200x200/bbb/fff.png&text=No+Image'}
            alt={auction.title}
            />
        
            <Stack w={'full'}>
                <CardBody>
                    <Flex>
                        <chakra.div flex={2}>
                            <Heading size='md'>{auction.title}</Heading>
                            <Text py='2'>
                            {auction.description}
                            </Text>
                            
                        </chakra.div>
                        <chakra.div flex={1}>
                            <Flex>
                                <Flex><Text>Interim Goal</Text><Text fontSize={'lg'}>{auction.interimGoalAmount}</Text></Flex>
                                <Flex><Text>Final Goal</Text><Text fontSize={'lg'}>{auction.finalGoalAmount}</Text></Flex>
                            </Flex>
                            Total provided: {totalProvided ? String(totalProvided) : 0}
                            <Progress hasStripe value={(10/auction.finalGoalAmount) * 100} />
                        </chakra.div>
                    </Flex>
                </CardBody>
            
                <CardFooter>
                    
                </CardFooter>
            </Stack>
        </Card>
        </Link>
}