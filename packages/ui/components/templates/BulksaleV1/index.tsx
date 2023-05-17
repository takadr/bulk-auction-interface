import { useState, useEffect, useCallback } from 'react';
import { Container, Heading, Image, Flex, Box, Button, FormControl, FormLabel, FormErrorMessage, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, Tooltip, Stack, Divider, chakra, useInterval, useToast, Link, HStack, Tag} from '@chakra-ui/react';
import { ExternalLinkIcon, QuestionIcon } from '@chakra-ui/icons';
import { useFormik } from 'formik';
import { useProvider, useNetwork, useAccount, useContractRead, usePrepareContractWrite, useContractWrite, useWaitForTransaction, useContractEvent, usePrepareSendTransaction, useSendTransaction, useToken, erc20ABI } from 'wagmi';
import { format, formatDistance, formatRelative, subDays } from 'date-fns';
import Big from '../../../utils/bignumber';
import { BigNumber, utils } from 'ethers';
import CalendarInCircle from './CalendarInCircle';
import PersonalStatistics from './PersonalStatistics';
import StatisticsInCircle from './StatisticsInCircle';
import useBulksaleV1 from '../../../hooks/BulksaleV1/useBulksaleV1';
import useClaim from '../../../hooks/useClaim';
import useWithdrawERC20Onsale from '../../../hooks/useWithdrawERC20Onsale';
import useWithdrawProvidedETH from '../../../hooks/useWithdrawProvidedETH';
import useWithdrawUnclaimedERC20OnSale from '../../../hooks/useWithdrawUnclaimedERC20OnSale';
import useRate from '../../../hooks/useRate';
import { Sale, MetaData } from '../../../types/BulksaleV1';

interface BulksaleV1Params {
    sale: Sale,
    metaData: MetaData,
    address: `0x${string}`
    contractAddress: `0x${string}`;
}

export default function BulksaleV1({sale, metaData, address, contractAddress}: BulksaleV1Params) {
    const toast = useToast({position: 'top-right', isClosable: true,});
    const { provided } = useBulksaleV1(contractAddress, address);
    
    const providedTokenSymbol = 'ETH';
    const providedTokenDecimal = 18;

    const [isClaimed, setIsClaimed] = useState<boolean>(false);
    const [started, setStarted] = useState<boolean>(false);
    const [ended, setEnded] = useState<boolean>(false);

    const [fiatSymbol, setFiatSymbol] = useState<string>('usd');

    const {data: rateDate, mutate: updateRate, error: rateError} = useRate('ethereum', 'usd');

    useInterval(() => {
        setIsClaimed(false);
        setStarted(sale.startingAt * 1000 <= new Date().getTime());
        setEnded(sale.closingAt * 1000 < new Date().getTime());
    }, 1000);
    useInterval(() => {
        updateRate();
    }, 10000);

    const handleSubmit = async (values: {[key: string]: number}) => {
        // console.log(utils.parseEther(values.amount.toString()));
        // console.log(sendTransactionAsync);
        const result = await sendTransactionAsync?.()
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

    const { data, sendTransactionAsync } = useSendTransaction({
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
                description: `Transaction sent! ${data?.hash}`,
                status: 'success',
                duration: 5000,
            })
        },
    })
 
    const { isLoading, isSuccess } = useWaitForTransaction({
        hash: data?.hash,
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
            // TODO Update contract statuses
            // setTimeout(forceUpdate, 1000);
        },
    });

    const {prepareFn: claimPrepareFn, writeFn: claimWriteFn, waitFn: claimWaitFn} = useClaim(contractAddress, address);
    const {prepareFn: withdrawERC20PrepareFn, writeFn: withdrawERC20WriteFn, waitFn: withdrawERC20WaitFn} = useWithdrawERC20Onsale(contractAddress);
    const {prepareFn: withdrawETHPrepareFn, writeFn: withdrawETHWriteFn, waitFn: withdrawETHWaitFn} = useWithdrawProvidedETH(contractAddress);
    const {prepareFn: withdrawUnclaimedERC20PrepareFn, writeFn: withdrawUnclaimedERC20WriteFn, waitFn: withdrawUnclaimedERC20WaitFn} = useWithdrawUnclaimedERC20OnSale(contractAddress);

    return (
        <>
            <Container maxW={'container.md'} py={16}>
                <Flex>
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
                        <Heading textAlign={'center'}>{metaData.title}</Heading>
                        <chakra.p mt={2} fontSize={'lg'}>{metaData.description}</chakra.p>
                        <HStack mt={4} spacing={4}>
                            <Tag><Link fontSize={'sm'} href={metaData.projectURL} target={'_blank'}>Project URL <ExternalLinkIcon /></Link></Tag>
                        </HStack>
                    </Box>
                </Flex>
                <Flex mt={8} flexDirection={{base: 'column', md: 'row'}}>
                    <StatisticsInCircle
                        totalProvided={Big(sale.totalProvided.toString())}
                        interimGoalAmount={Big((metaData.interimGoalAmount * 10**18).toString())}
                        finalGoalAmount={Big((metaData.finalGoalAmount * 10**18).toString())}
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

                <Box mt={4} py={16}>
                    <Heading size={'lg'} textAlign={'center'}>Disclaimers, Terms and Conditions</Heading>
                    {metaData.terms}
                </Box>

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
                                <NumberInput isDisabled={!started} flex="1" name="amount" value={formikProps.values.amount} min={0.01} step={0.01} max={100} onBlur={formikProps.handleBlur} onChange={(strVal: string, val: number) =>
                                    formikProps.setFieldValue('amount', strVal ? strVal : 0)
                                }>
                                    <NumberInputField/>
                                    <NumberInputStepper>
                                        <NumberIncrementStepper />
                                        <NumberDecrementStepper />
                                    </NumberInputStepper>
                                </NumberInput>
                                <chakra.div px={2}>{providedTokenSymbol}</chakra.div>
                                <Button isLoading={isLoading} isDisabled={!sendTransactionAsync || !started} type='submit' variant='solid' colorScheme={'green'}>
                                    Donate
                                </Button>
                            </Flex>
                            <FormErrorMessage>{formikProps.errors.amount}</FormErrorMessage>
                        </FormControl>
                    </form>
                </Box> }
                
                { ended && 
                    <chakra.div>
                        <Button
                            variant={'solid'}
                            isDisabled={isClaimed || !claimWriteFn.writeAsync}
                            onClick={async() => {
                                await claimWriteFn.writeAsync();
                            }}
                        >
                            { isClaimed ? 'Claimed' : 'Claim' }
                        </Button>
                    </chakra.div>
                }

                { started && <Box>
                    <PersonalStatistics
                        inputValue={formikProps.values.amount}
                        myTotalProvided={Big(provided.toString())}
                        totalProvided={Big(sale.totalProvided.toString())}
                        distributeAmount={Big(sale.distributeAmount.toString())}
                        distributedTokenSymbol={sale.tokenSymbol ? sale.tokenSymbol : ''}
                        distributedTokenDecimal={sale.tokenDecimals ? sale.tokenDecimals : 0}
                        providedTokenSymbol={providedTokenSymbol}
                        providedTokenDecimal={providedTokenDecimal}
                        isEnding={ended}
                        isClaimed={isClaimed}
                    />
                </Box> }

                {
                    sale.owner === address && <Stack spacing={4} py={8}>
                        <Divider />
                        <Heading textAlign={'center'}>Owner Menu</Heading>
                        <chakra.div textAlign={'center'}>
                            <Button
                                variant={'solid'}
                                isDisabled={!withdrawERC20WriteFn.writeAsync}
                                onClick={async() => {
                                    await claimWriteFn.writeAsync();
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
                                Withdraw Unclaimed Token 
                                <Tooltip hasArrow label={'Finished, passed lock duration, and still there\'re unsold ERC-20.'}><QuestionIcon mb={1} ml={1} /></Tooltip>
                            </Button>
                        </chakra.div>
                    </Stack>
                }
            </Container>
        </>
    );
}