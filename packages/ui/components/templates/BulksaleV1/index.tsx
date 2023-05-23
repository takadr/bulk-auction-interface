import { useState, useEffect, useCallback } from 'react';
import { Container, Heading, Image, Flex, Box, Button, FormControl, FormLabel, FormErrorMessage, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, Tooltip, Stack, Divider, chakra, useInterval, useToast, Link, HStack, Tag, Card, CardHeader, CardBody, StackDivider, SkeletonCircle, Skeleton, SkeletonText, Alert, AlertIcon, AlertTitle, AlertDescription, CloseButton} from '@chakra-ui/react';
import { CheckCircleIcon, ExternalLinkIcon, InfoIcon, QuestionIcon } from '@chakra-ui/icons';
import { useFormik } from 'formik';
import { useWaitForTransaction, useContractEvent, usePrepareSendTransaction, useSendTransaction, useBalance } from 'wagmi';
import { ApolloQueryResult } from '@apollo/client';
import { KeyedMutator } from 'swr';
import { format, formatDistance, formatRelative, subDays } from 'date-fns';
import Big from '../../../utils/bignumber';
import { BigNumber, utils } from 'ethers';
import CalendarInCircle from './CalendarInCircle';
import PersonalStatistics from './PersonalStatistics';
import StatisticsInCircle from './StatisticsInCircle';
import useProvided from '../../../hooks/BulksaleV1/useProvided';
import useWithdrawERC20Onsale from '../../../hooks/useWithdrawERC20Onsale';
import useWithdrawProvidedETH from '../../../hooks/useWithdrawProvidedETH';
import useWithdrawUnclaimedERC20OnSale from '../../../hooks/useWithdrawUnclaimedERC20OnSale';
import useRate from '../../../hooks/useRate';
import { Sale, MetaData } from '../../../types/BulksaleV1';
import ExternalLinkTag from '../../ExternalLinkTag';
import useIsClaimed from '../../../hooks/BulksaleV1/useIsClaimed';
import ClaimButton from './ClaimButton';
import TxSentToast from '../../TxSentToast';

type BulksaleV1Params = {
    sale: Sale;
    refetchSale: () => Promise<ApolloQueryResult<any>>;
    metaData: MetaData;
    refetchMetaData: KeyedMutator<any>;
    address: `0x${string}`|undefined;
    contractAddress: `0x${string}`;
}

export default function BulksaleV1({sale, refetchSale, metaData, refetchMetaData, address, contractAddress}: BulksaleV1Params) {
    const toast = useToast({position: 'top-right', isClosable: true,});
    const { provided, totalProvided, isLoading: isLoadingProvidedAmount, refetch: refetchProvided } = useProvided(contractAddress, address);
    const { data: balanceData, isLoading: isLoadingBalance } = useBalance({address});
    const { data: isClaimed, error: isClaimedError, mutate: mutateIsClaimed } = useIsClaimed(sale, address);

    const providedTokenSymbol = 'ETH';
    const providedTokenDecimal = 18;

    const [started, setStarted] = useState<boolean>(false);
    const [ended, setEnded] = useState<boolean>(false);

    const [fiatSymbol, setFiatSymbol] = useState<string>('usd');

    const {data: rateDate, mutate: updateRate, error: rateError} = useRate('ethereum', 'usd');

    useInterval(() => {
        setStarted(sale.startingAt * 1000 <= new Date().getTime());
        setEnded(sale.closingAt * 1000 < new Date().getTime());
    }, 1000);
    useInterval(() => {
        updateRate();
        refetchSale();
        refetchMetaData();
        refetchProvided();
    }, 10000);

    // useContractEvent({
    //     address: sale.id as `0x${string}`,
    //     abi: SaleTemplateV1ABI,
    //     eventName: 'Received',
    //     listener(account, amount) {
    //         refetchSale();
    //     },
    // });
    // useContractEvent({
    //     address: sale.id as `0x${string}`,
    //     abi: SaleTemplateV1ABI,
    //     eventName: 'Claimed',
    //     listener(account, userShare, allocation) {
    //         if(address && (account as string).toLowerCase() === address.toLowerCase()) {
    //             refetchSale();
    //         }
    //     },
    // })

    const handleSubmit = async (values: {[key: string]: number}) => {
        const result = await sendTransactionAsync?.();
    };

    const validate = () => {
        // TODO
    };
    
    const formikProps = useFormik({
        enableReinitialize: true,
        initialValues: { amount: 0 },
        onSubmit: handleSubmit,
        validate
    });

    const { config, isError } = usePrepareSendTransaction({
        request: {
            to: contractAddress,
            value: formikProps.values.amount ? utils.parseEther(formikProps.values.amount.toString()) : undefined,
        },
    });

    const { data, sendTransactionAsync, isLoading: isLoadingSendTX } = useSendTransaction({
        ...config,
        onError(e: Error) {
            toast({
                description: e.message,
                status: 'error',
                duration: 5000,
            })
        },
        onSuccess(data) {
            toast({
                title: 'Transaction sent!',
                status: 'success',
                duration: 5000,
                render: (props) => <TxSentToast txid={data?.hash} {...props} />
            })
        },
    })
 
    const { isLoading: isLoadingWaitTX, isSuccess } = useWaitForTransaction({
        hash: data?.hash,
        confirmations: 2,
        onError(e: Error) {
            toast({
                description: e.message,
                status: 'error',
                duration: 5000,
            })
        },
        onSuccess(data) {
            toast({
                description: `Transaction confirmed!`,
                status: 'success',
                duration: 5000,
            })
            formikProps.resetForm();
            setTimeout(() => {
                refetchSale();
                refetchProvided();
            }, 0)
            
        },
    });

    
    const {prepareFn: withdrawERC20PrepareFn, writeFn: withdrawERC20WriteFn, waitFn: withdrawERC20WaitFn} = useWithdrawERC20Onsale({targetAddress: contractAddress, onSuccessConfirm: refetchSale});
    const {prepareFn: withdrawETHPrepareFn, writeFn: withdrawETHWriteFn, waitFn: withdrawETHWaitFn} = useWithdrawProvidedETH({targetAddress: contractAddress, onSuccessConfirm: refetchSale});
    const {prepareFn: withdrawUnclaimedERC20PrepareFn, writeFn: withdrawUnclaimedERC20WriteFn, waitFn: withdrawUnclaimedERC20WaitFn} = useWithdrawUnclaimedERC20OnSale({ targetAddress: contractAddress, onSuccessConfirm: refetchSale });

    return (
        <>
            <Container maxW={'container.md'} py={16}>
                <Flex alignItems={'center'} minH={'150px'}>
                    <Image
                    borderRadius={'100%'}
                    objectFit='cover'
                    w={'150px'}
                    h={'150px'}
                    // maxW={{ base: '100%', sm: '200px' }}
                    src={metaData.logoURL ? metaData.logoURL : 'https://dummyimage.com/200x200/bbb/fff.png&text=No+Image'}
                    alt={metaData.title}
                    />
                    <Box px={8}>
                        <Heading>{metaData.title ? metaData.title : 'Unnamed Sale'}</Heading>
                        <HStack mt={4} spacing={4}>
                            { metaData.projectURL && <ExternalLinkTag url={metaData.projectURL} /> }
                            { metaData.otherURL && <ExternalLinkTag url={metaData.otherURL} /> }
                        </HStack>
                    </Box>
                </Flex>
                <chakra.p mt={2} fontSize={'lg'}>{metaData.description}</chakra.p>
                
                <Flex mt={8} flexDirection={{base: 'column', md: 'row'}}>
                    <StatisticsInCircle
                        totalProvided={totalProvided}
                        interimGoalAmount={Big(metaData.interimGoalAmount ? metaData.interimGoalAmount : 0).mul(Big(10).pow(providedTokenDecimal))}
                        finalGoalAmount={Big(metaData.finalGoalAmount ? metaData.finalGoalAmount : 0).mul(Big(10).pow(providedTokenDecimal))}
                        providedTokenSymbol={providedTokenSymbol}
                        providedTokenDecimal={providedTokenDecimal}
                        fiatSymbol={fiatSymbol}
                        fiatRate={rateDate && rateDate.usd ? rateDate.usd : 0}
                        contractAddress={contractAddress}
                        started={started}
                        w={{base: 'full', md: '50%'}}
                     />
                    <CalendarInCircle
                        unixStartDate={sale.startingAt}
                        unixEndDate={sale.closingAt}
                        w={{base: 'full', md: '50%'}}
                    />
                </Flex>

                { metaData.terms && <Box mt={4} py={16}>
                    <Heading size={'lg'} textAlign={'center'}>Disclaimers, Terms and Conditions</Heading>
                    <chakra.p mt={2}>{metaData.terms}</chakra.p>
                </Box> }

                { started && !ended && <Box>
                    <form onSubmit={formikProps.handleSubmit}>
                        <FormControl flex={1} mt={4} isInvalid={!!formikProps.errors.amount && !!formikProps.touched.amount}>
                            <FormLabel alignItems={'baseline'}>Donation amount
                                <Tooltip hasArrow label={'TODO explanation'}><QuestionIcon mb={1} ml={1} /></Tooltip>
                            </FormLabel>
                            <Flex alignItems={'center'}>
                                {
                                    //TODO Set max as account balance
                                }
                                <NumberInput isDisabled={!started} flex="1" name="amount" value={formikProps.values.amount} min={0.01} step={0.01} max={balanceData ? Number(balanceData.formatted) : 100} onBlur={formikProps.handleBlur} onChange={(strVal: string, val: number) =>
                                    formikProps.setFieldValue('amount', strVal ? strVal : 0)
                                }>
                                    <NumberInputField/>
                                    <NumberInputStepper>
                                        <NumberIncrementStepper />
                                        <NumberDecrementStepper />
                                    </NumberInputStepper>
                                </NumberInput>
                                <chakra.div px={2}>{providedTokenSymbol}</chakra.div>
                                <Button isLoading={isLoadingWaitTX || isLoadingSendTX} isDisabled={!sendTransactionAsync || !started} type='submit' variant='solid' colorScheme={'green'}>
                                    Donate
                                </Button>
                            </Flex>
                            <FormErrorMessage>{formikProps.errors.amount}</FormErrorMessage>
                        </FormControl>
                    </form>
                    <chakra.p mt={2} color={'gray.400'} fontSize={'sm'} textAlign='right'>
                        Balance: {
                            balanceData ? Number(balanceData.formatted).toFixed(2) : '-'
                        } ETH
                    </chakra.p>
                </Box> }

                { address && started && <Box mt={1}>
                    <PersonalStatistics
                        inputValue={formikProps.values.amount}
                        myTotalProvided={provided}
                        totalProvided={totalProvided}
                        distributeAmount={Big(sale.distributeAmount.toString())}
                        distributedTokenSymbol={sale.tokenSymbol ? sale.tokenSymbol : ''}
                        distributedTokenDecimal={sale.tokenDecimals ? sale.tokenDecimals : 0}
                        providedTokenSymbol={providedTokenSymbol}
                        providedTokenDecimal={providedTokenDecimal}
                        isEnding={ended}
                        isClaimed={!!isClaimed}
                        isLodingTX={isLoadingWaitTX || isLoadingSendTX}
                    />
                </Box> }

                { address && ended && 
                    <chakra.div textAlign={'right'} mt={2}>
                        <ClaimButton
                            sale={sale}
                            address={address}
                            myTotalProvided={provided}
                            isClaimed={!!isClaimed}
                            mutateIsClaimed={mutateIsClaimed}
                        />
                    </chakra.div>
                }

                {
                    address && sale.owner?.toLowerCase() === address.toLowerCase() && <>
                    <Divider mt={8} />
                    <Card mt={8}>
                        <CardHeader>
                            <Heading size='md'>Owner Menu</Heading>
                        </CardHeader>
                    
                        <CardBody>
                            <Stack divider={<StackDivider />} spacing='4'>
                                <chakra.div textAlign={'center'}>
                                    <Button
                                        variant={'solid'}
                                        isDisabled={!withdrawERC20WriteFn.writeAsync}
                                        onClick={async() => {
                                            await withdrawERC20WriteFn.writeAsync();
                                        }}
                                    >
                                        Withdraw Token
                                        <Tooltip hasArrow label={'Finished, but the privided token is not enough. (Failed sale)'}><QuestionIcon mb={1} ml={1} /></Tooltip>
                                    </Button>
                                </chakra.div>

                                <chakra.div textAlign={'center'}>
                                    <Button
                                        variant={'solid'}
                                        isDisabled={!withdrawETHWriteFn.writeAsync}
                                        onClick={async() => {
                                            await withdrawETHWriteFn.writeAsync();
                                        }}
                                    >
                                        Withdraw ETH 
                                        <Tooltip hasArrow label={'Finished, and enough Ether provided.'}><QuestionIcon mb={1} ml={1} /></Tooltip>
                                    </Button>
                                </chakra.div>

                                <chakra.div textAlign={'center'}>
                                    <Button
                                        variant={'solid'}
                                        isDisabled={!withdrawUnclaimedERC20WriteFn.writeAsync}
                                        onClick={async() => {
                                            await withdrawUnclaimedERC20WriteFn.writeAsync();
                                        }}
                                    >
                                        Withdraw Unclaimed Token (削除予定)
                                        <Tooltip hasArrow label={'Finished, passed lock duration, and still there\'re unsold ERC-20.'}><QuestionIcon mb={1} ml={1} /></Tooltip>
                                    </Button>
                                </chakra.div>
                            </Stack>
                        </CardBody>
                    </Card></>
                }
            </Container>
        </>
    );
}


export const SkeletonSale = () => {
    return <Container maxW={'container.md'} py={16}>
        <Flex alignItems={'center'} minH={'150px'}>
            <SkeletonCircle 
                w={'150px'}
                h={'150px'}
            />
            <Box px={8}>
                <Heading><Skeleton h={'30px'} /></Heading>
                <HStack mt={4} spacing={4}>
                    <Skeleton h={'20px'} w={'100px'} />
                    <Skeleton h={'20px'} w={'100px'} />
                    <Skeleton h={'20px'} w={'100px'} />
                </HStack>
            </Box>
        </Flex>
        <Box mt={4}><SkeletonText /></Box>
    </Container>
}