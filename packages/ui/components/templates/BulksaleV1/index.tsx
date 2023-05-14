import { useState, useEffect, useCallback } from 'react';
import { Container, Heading, Flex, Box, Button, FormControl, FormLabel, FormErrorMessage, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, Tooltip, Stack, Divider, chakra, useInterval, useToast} from '@chakra-ui/react';
import { QuestionIcon } from '@chakra-ui/icons';
import { useFormik } from 'formik';
import { useProvider, useNetwork, useAccount, useContractRead, usePrepareContractWrite, useContractWrite, useWaitForTransaction, useContractEvent, usePrepareSendTransaction, useSendTransaction, useToken, erc20ABI } from 'wagmi';
import { format, formatDistance, formatRelative, subDays } from 'date-fns';
import Big from '../../../utils/bignumber';
import { BigNumber, utils } from 'ethers';
import CalendarInCircle from './CalendarInCircle';
import PersonalStatistics from './PersonalStatistics';
import StatisticsInCircle from './StatisticsInCircle';
import bulksaleV1ABI from '../../../constants/abis/BulksaleV1.json';
import useBulksaleV1 from '../../../hooks/BulksaleV1/useBulksaleV1';
import useClaim from '../../../hooks/useClaim';
import useWithdrawERC20Onsale from '../../../hooks/useWithdrawERC20Onsale';
import useWithdrawProvidedETH from '../../../hooks/useWithdrawProvidedETH';
import useWithdrawUnclaimedERC20OnSale from '../../../hooks/useWithdrawUnclaimedERC20OnSale';
import useRate from '../../../hooks/useRate';
import useSWRAuction from '../../../hooks/useAuction';

interface BulksaleV1Params {
    // title?: string;
    address: `0x${string}`
    contractAddress: `0x${string}`;
    // unixStartDate: number;
    // unixEndDate: number;
    // totalDistributeAmount: bigint;
    // minimalProvideAmount: bigint;
    // lockDuration: number;
    // expirationDuration: number;
    // ownerAddress: `0x${string}`;
    // tokenAddress: `0x${string}`;
}

export default function BulksaleV1(props: BulksaleV1Params) {
    const { data: metaData, mutate, error } = useSWRAuction(props.contractAddress as string);
    const toast = useToast({position: 'top-right', isClosable: true,});
    const now = Date.now();
    const {
        startingAt,
        closingAt,
        totalDistributeAmount,
        minimalProvideAmount,
        totalProvided,
        provided,
        token: distributedToken,
        owner
    } = useBulksaleV1(props.contractAddress, props.address);
    // Static status
    // const [startingAt, setStartingAt] = useState<number>(0);
    // const [closingAt, setClosingAt] = useState<number>(0);
    // const [totalDistributeAmount, setTotalDistributeAmount] = useState<bigint>(BigInt(0));
    // const [minimalProvideAmount, setMinimalProvideAmount] = useState<bigint>(BigInt(0));
    // const [distributedTokenSymbol, setDistributedTokenSymbol] = useState<string>('');
    // const [distributedTokenDecimal, setDistributedTokenDecimal] = useState<number>(0);
    const [providedTokenSymbol, setProvidedTokenSymbol] = useState<string>('');
    const [providedTokenDecimal, setProvidedTokenDecimal] = useState<number>(0);
    // Dynamic status
    // const [totalProvided, setTotalProvided] = useState<bigint>(BigInt(0));
    // const [provided, setProvided] = useState<bigint>(BigInt(0));
    const [isClaimed, setIsClaimed] = useState<boolean>(false);
    const [started, setStarted] = useState<boolean>(startingAt <= now);
    const [ended, setEnded] = useState<boolean>(closingAt < now);
    // Meta data
    const [interimGoalAmount, setInterimGoalAmount] = useState<bigint>(BigInt(0));
    const [finalGoalAmount, setFinalGoalAmount] = useState<bigint>(BigInt(0));
    // Local status
    const [fiatSymbol, setFiatSymbol] = useState<string>('usd');

    // Only for test
    const [, updateState] = useState<any>();
    const forceUpdate = useCallback(() => updateState({}), []);
    const {data: rateDate, mutate: updateRate, error: rateError} = useRate('ethereum', 'usd');
    // console.log('ethUsdRate: ', rateDate && rateDate.usd ? rateDate.usd : "?")
    
    // TODO Subgraphからまとめて読み込む

    useEffect(() => {
        // TODO Retrieve contract data from Subgraph
        // setStartingAt(new Date('2023-05-02T21:00:00Z').getTime());
        // setClosingAt(new Date('2023-05-16T21:00:00Z').getTime());
        // setTotalDistributeAmount(BigInt('21000000000000'));
        // setMinimalProvideAmount(BigInt('10000000000000000'))
        // setDistributedTokenSymbol('TST');
        // setDistributedTokenDecimal(8);
        setProvidedTokenSymbol('ETH');
        setProvidedTokenDecimal(18);

        // TODO Retrieve metadata
        setInterimGoalAmount(BigInt('300000000000000000000'));
        setFinalGoalAmount(BigInt('500000000000000000000'));
    }, []);
    useInterval(() => {
        setIsClaimed(false);
        setStarted(startingAt <= new Date().getTime());
        setEnded(closingAt < new Date().getTime());
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
            to: props.contractAddress,
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
            setTimeout(forceUpdate, 1000);
        },
    });

    const {prepareFn: claimPrepareFn, writeFn: claimWriteFn, waitFn: claimWaitFn} = useClaim(props.contractAddress, props.address);
    const {prepareFn: withdrawERC20PrepareFn, writeFn: withdrawERC20WriteFn, waitFn: withdrawERC20WaitFn} = useWithdrawERC20Onsale(props.contractAddress);
    const {prepareFn: withdrawETHPrepareFn, writeFn: withdrawETHWriteFn, waitFn: withdrawETHWaitFn} = useWithdrawProvidedETH(props.contractAddress);
    const {prepareFn: withdrawUnclaimedERC20PrepareFn, writeFn: withdrawUnclaimedERC20WriteFn, waitFn: withdrawUnclaimedERC20WaitFn} = useWithdrawUnclaimedERC20OnSale(props.contractAddress);

    return (
        <>
            <Container maxW={'container.md'} py={8}>
                <Heading textAlign={'center'} my={8}>Test Bulksale</Heading>
                <Flex flexDirection={{base: 'column', md: 'row'}}>
                    <StatisticsInCircle
                        totalProvided={Big(totalProvided.toString())}
                        interimGoalAmount={Big(interimGoalAmount.toString())}
                        finalGoalAmount={Big(finalGoalAmount.toString())}
                        providedTokenSymbol={providedTokenSymbol}
                        providedTokenDecimal={providedTokenDecimal}
                        fiatSymbol={fiatSymbol}
                        fiatRate={rateDate && rateDate.usd ? rateDate.usd : 0}
                        contractAddress={props.contractAddress}
                        started={started}
                        w={{base: 'full', md: '50%'}}
                     />
                    <CalendarInCircle
                        unixStartDate={startingAt / 1000}
                        unixEndDate={closingAt / 1000}
                        w={{base: 'full', md: '50%'}}
                    />
                </Flex>
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
                        totalProvided={Big(totalProvided.toString())}
                        totalDistributeAmount={Big(totalDistributeAmount.toString())}
                        distributedTokenSymbol={distributedToken ? distributedToken.symbol : ''}
                        distributedTokenDecimal={distributedToken ? distributedToken.decimals : 0}
                        providedTokenSymbol={providedTokenSymbol}
                        providedTokenDecimal={providedTokenDecimal}
                        isEnding={ended}
                        isClaimed={isClaimed}
                    />
                </Box> }

                {
                    owner === props.address && <Stack spacing={4} py={8}>
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