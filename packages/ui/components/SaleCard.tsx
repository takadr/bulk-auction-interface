import { useEffect } from 'react';
import { chakra, Box, Divider, Badge, Tag, Heading, Card, CardBody, CardFooter, Progress, Text, Image, Stack, Link, Flex } from '@chakra-ui/react';
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
                            <Heading size='lg'>{auction.title}</Heading>
                            <Text py='2'>
                            {auction.description}
                            </Text>
                            
                        </chakra.div>
                        <chakra.div flex={1}>
                            <Flex justifyContent={'space-between'} alignItems={'baseline'}><chakra.span>Distributes</chakra.span> <chakra.span fontSize={'2xl'}>{560321} XXX</chakra.span></Flex>
                            <Divider />
                            <Flex mt={2} justifyContent={'space-between'} alignItems={'baseline'}><chakra.span>Total raised</chakra.span> <chakra.span fontSize={'2xl'}>{totalProvided ? String(totalProvided) : 0} ETH</chakra.span></Flex>
                            <Progress borderRadius={'4px'} hasStripe value={(10/auction.finalGoalAmount) * 100} />
                            <Flex mt={2} justifyContent={'space-between'} alignItems={'baseline'}>
                                <Text fontSize={'sm'}>Minimum</Text><Text fontSize={'lg'}>{10} ETH</Text>
                            </Flex>
                            <Flex mt={1} justifyContent={'space-between'} alignItems={'baseline'}>
                                <Text fontSize={'sm'}>Interim Goal</Text><Text fontSize={'lg'}>{auction.interimGoalAmount} ETH</Text>
                            </Flex>
                            <Flex mt={1} justifyContent={'space-between'} alignItems={'baseline'}>
                                <Text fontSize={'sm'}>Final Goal</Text><Text fontSize={'lg'}>{auction.finalGoalAmount} ETH</Text>
                            </Flex>
                        </chakra.div>
                    </Flex>
                </CardBody>
            
                <CardFooter>
                    <Flex alignItems={'center'} justifyContent={'center'}>
                        <Tag><Box boxSize='1em' bg='green.300' borderRadius={'100%'} /> <Text ml={1}>Live</Text></Tag>
                        <Box ml={2}><chakra.span fontSize={'sm'}>Ends in</chakra.span> <chakra.span fontSize={'xl'}>10 days + 02:01:14</chakra.span></Box>
                    </Flex>
                </CardFooter>
            </Stack>
        </Card>
        </Link>
}