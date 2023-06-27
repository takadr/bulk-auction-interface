import { useEffect, useState } from 'react';
import { chakra, Link, Box, Divider, Skeleton, Tag, Heading, Card, CardBody, Progress, Text, Image, Stack, Flex, Button, useDisclosure, SkeletonText } from '@chakra-ui/react';
import { EditIcon } from '@chakra-ui/icons';
import Big, { divideToNum, getBigNumber } from 'lib/utils/bignumber';
import { Sale } from 'lib/types/Sale';
import useSWRAuction from '../hooks/useAuction';
import MetaDataFormModal from './MetaDataFormModal';
import { tokenAmountFormat, getCountdown, ellipsisText, getDecimalsForView, getTargetPercetage, etherAmountFormat, parseEtherInBig } from 'lib/utils';
import { useNow } from '../hooks/useNow';

export default function SaleCard({ sale, editable=false }: { sale: Sale, editable?: boolean }){
    // TODO use enum
    // 0-> not started, 1 -> started, 2 -> closed
    const [stage, setStage] = useState<'0'|'1'|'2'>('0');
    const { onOpen, isOpen, onClose } = useDisclosure();
    const { data, mutate, error } = useSWRAuction(sale.id as string);
    const [countdown, setCountdown] = useState({
        days: '0',
        hours: '00',
        mins: '00',
        secs: '00',
    });
    const [now] = useNow();
    useEffect(() => {
        let currentStage = stage
        if(now < sale.startingAt) {
            currentStage = '0'
            setCountdown(getCountdown(sale.startingAt - now))
        } else if(now >= sale.startingAt && now < sale.closingAt) {
            currentStage = '1'
            setCountdown(getCountdown(sale.closingAt - now))
        } else if(now >= sale.closingAt){
            currentStage = '2'
        }

        setStage(currentStage);
    }, [now])
  
    // const {data: totalRaised, refetch} = useContractRead({
    //     address: sale.id as `0x${string}`,
    //     abi: SaleTemplateV1ABI,
    //     functionName: 'totalRaised',
    //     staleTime: 1000,
    //     cacheTime: 1000,
    // });
    // useContractEvent({
    //     address: sale.id as `0x${string}`,
    //     abi: SaleTemplateV1ABI,
    //     eventName: 'Received',
    //     listener() {
    //         refetch();
    //     },
    // });

    // if(!data) {
    //     return <Card
    //     direction={{ base: 'column', sm: 'row' }}
    //     overflow='hidden'>
    //         <Image
    //         objectFit='contain'
    //         maxW={{ base: '100%', sm: '200px' }}
    //         src={'https://dummyimage.com/200x200/bbb/fff.png&text=No+Image'}
    //         alt={''}
    //         />
        
    //         <Stack w={'full'}>
    //             <CardBody><Skeleton /></CardBody>
    //         </Stack>
    //     </Card>
    // }

    return <Card
        direction={{ base: 'column', sm: 'row' }}
        overflow='hidden'
        >
            <Image
            objectFit='cover'
            w={{ base: '100%', sm: '260px' }}
            h={{ base: '100%', sm: '260px' }}
            p={6}
            maxW={{ base: '100%', sm: '260px' }}
            src={data?.metaData?.logoURL ? data?.metaData?.logoURL : 'https://dummyimage.com/200x200/bbb/fff.png&text=No+Image'}
            alt={data?.metaData?.title}
            />
        
            <Stack w={'full'}>
                <CardBody>
                    <Flex flexDirection={{base: 'column', md: 'row'}}>
                        <chakra.div flex={10} pr={4}>
                            <Heading size='lg'>
                                <Link _hover={{opacity: .75}} href={`/sales/${sale.id}`}>{data?.metaData?.title ? data?.metaData?.title : 'Unnamed Sale'}</Link>
                                { editable && <Button size={'sm'} ml={2} onClick={onOpen}><EditIcon mr={1} /> Edit</Button> }
                            </Heading>
                            <Text py='2'>
                            {data?.metaData?.description && ellipsisText(data?.metaData?.description, 200)}
                            </Text>
                            
                        </chakra.div>
                        <chakra.div flex={7}>
                            <Flex justifyContent={'space-between'} alignItems={'baseline'}><chakra.span>Allocated to the sale</chakra.span>
                                <chakra.span fontSize={'2xl'}>{tokenAmountFormat(sale.allocatedAmount, sale.tokenDecimals, getDecimalsForView(getBigNumber(sale.allocatedAmount), sale.tokenDecimals))}
                                    <chakra.span fontSize={'md'}> {sale.tokenSymbol}</chakra.span>
                                </chakra.span>
                            </Flex>
                            <Divider />
                            <Flex mt={2} justifyContent={'space-between'} alignItems={'baseline'}><chakra.span>Total raised</chakra.span> <chakra.span fontSize={'2xl'}>{sale.totalRaised ? etherAmountFormat(sale.totalRaised, 2) : 0} <chakra.span fontSize={'md'}>ETH</chakra.span></chakra.span></Flex>
                            <Progress borderRadius={'4px'} hasStripe value={data?.metaData?.maximumTotalRaised ? getTargetPercetage(sale.totalRaised, parseEtherInBig(data.metaData.maximumTotalRaised)) : 0} />
                            <Flex mt={2} justifyContent={'space-between'} alignItems={'baseline'}>
                                <Text fontSize={'sm'}>Minimum total raised</Text><Text fontSize={'lg'}>{etherAmountFormat(sale.minRaisedAmount, 2)} <chakra.span fontSize={'sm'}>ETH</chakra.span></Text>
                            </Flex>
                            <Flex mt={1} justifyContent={'space-between'} alignItems={'baseline'}>
                                <Text fontSize={'sm'}>Target total raised</Text><Text fontSize={'lg'}>{data?.metaData?.targetTotalRaised ? tokenAmountFormat(data.metaData.targetTotalRaised, 0, 2) : '-'} <chakra.span fontSize={'sm'}>ETH</chakra.span></Text>
                            </Flex>
                            {/* <Flex mt={1} justifyContent={'space-between'} alignItems={'baseline'}>
                                <Text fontSize={'sm'}>Target</Text><Text fontSize={'lg'}>{data?.metaData?.maximumTotalRaised ? tokenAmountFormat(data?.metaData?.maximumTotalRaised, 0, 2) : '-'} <chakra.span fontSize={'sm'}>ETH</chakra.span></Text>
                            </Flex> */}
                        </chakra.div>
                    </Flex>
                    <Flex mt={{base: 2, md: 0}} alignItems={'center'}>
                        {
                            stage === '0' && <>
                                <Tag><Box boxSize='1em' bg='gray.500' borderRadius={'100%'} /> <Text ml={1}>Not started</Text></Tag>
                                <Box ml={2}><chakra.span fontSize={'sm'}>Starts in</chakra.span> <chakra.span fontSize={'xl'}>{countdown.days} days + {countdown.hours}:{countdown.mins}:{countdown.secs}</chakra.span></Box>
                            </>
                        }
                        {
                            stage === '1' && <>
                                <Tag><Box boxSize='1em' bg='green.300' borderRadius={'100%'} /> <Text ml={1}>Live</Text></Tag>
                                <Box ml={2}><chakra.span fontSize={'sm'}>Ends in</chakra.span> <chakra.span fontSize={'xl'}>{countdown.days} days + {countdown.hours}:{countdown.mins}:{countdown.secs}</chakra.span></Box>
                            </>
                        }
                        {
                            stage === '2' && <>
                                <Tag><Box boxSize='1em' bg='red.300' borderRadius={'100%'} /> <Text ml={1}>Ended</Text></Tag>
                            </>
                        }
                    </Flex>
                </CardBody>
            
                {/* <CardFooter>
                    
                </CardFooter> */}
            </Stack>
            {
                editable && isOpen && <MetaDataFormModal minRaisedAmount={divideToNum(sale.minRaisedAmount, Big(10).pow(18))} isOpen={isOpen} onClose={onClose} existingContractAddress={sale.id as `0x${string}`} saleMetaData={data?.metaData} onSubmitSuccess={mutate} />
            }
        </Card>
}

export const SaleCardSkeleton = () => {
    return <Card
    direction={{ base: 'column', sm: 'row' }}
    overflow='hidden'
    >
        <Box p={6}><Skeleton
        w={{ base: '100%', sm: '260px' }}
        h={{ base: '100%', sm: '260px' }}
        
        maxW={{ base: '100%', sm: '260px' }}
        /></Box>
    
        <Stack w={'full'}>
            <CardBody>
                <Flex>
                    <chakra.div flex={10} pr={4}>
                        <Skeleton h={'20px'} />
                        <SkeletonText py='4' />
                    </chakra.div>
                    <Stack flex={7} spacing={4}>
                        <Skeleton h={'20px'} borderRadius={'4px'} />
                        <Divider />
                        <Skeleton h={'20px'} borderRadius={'4px'} />
                        <Skeleton h={'20px'} borderRadius={'4px'} />
                        <Skeleton h={'20px'} borderRadius={'4px'} />
                    </Stack>
                </Flex>
            </CardBody>
        </Stack>
    </Card>
}