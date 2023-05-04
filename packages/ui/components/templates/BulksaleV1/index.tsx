import { useState, useEffect } from 'react';
import { Container, Heading, Flex, Box, Button, FormControl, FormLabel, FormErrorMessage, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, Tooltip, chakra, useInterval, useToast} from '@chakra-ui/react';
import { QuestionIcon } from '@chakra-ui/icons';
import { useFormik } from 'formik';
import { useProvider, useNetwork, useAccount, useContractRead, usePrepareContractWrite, useContractWrite, useWaitForTransaction, useContractEvent, usePrepareSendTransaction, useSendTransaction, useToken, erc20ABI } from 'wagmi';
import { format, formatDistance, formatRelative, subDays } from 'date-fns';
import { BigNumber, utils } from 'ethers';
import CalendarInCircle from './CalendarInCircle';
import PersonalStatistics from './PersonalStatistics';
import StatisticsInCircle from './StatisticsInCircle';
import bulksaleV1ABI from '../../../constants/abis/BulksaleV1.json';
import useBulksaleV1 from '../../../hooks/useBulksaleV1';

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
    const toast = useToast({position: 'top-right', isClosable: true,});
    const now = Date.now();
    const {
        startingAt,
        closingAt,
        totalDistributeAmount,
        minimalProvideAmount,
        totalProvided,
        provided,
        token: distributedToken
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
    const [fiatRate, setFiatRate] = useState<number>(1.0);
    
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
        // TODO
        // - totalProvided
        // - provided
        // - isClaimed
        // - started
        // - ended

        // TODO Get fiat rate
        // fiatRate
        // setTotalProvided(BigInt('150000000000000000000'));
        // setProvided(BigInt('2400000000000000000'));
        setIsClaimed(false);
        setStarted(startingAt <= new Date().getTime());
        setEnded(closingAt < new Date().getTime());

        setFiatRate(1908);
    }, 1000);

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
        },
    })

    return (
        <>
            <Container>
                <Heading>Test</Heading>
                <Flex flexDirection={{base: 'column', md: 'row'}}>
                    <StatisticsInCircle
                        totalProvided={totalProvided}
                        interimGoalAmount={interimGoalAmount}
                        finalGoalAmount={finalGoalAmount}
                        providedTokenSymbol={providedTokenSymbol}
                        providedTokenDecimal={providedTokenDecimal}
                        fiatSymbol={fiatSymbol}
                        fiatRate={fiatRate}
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
                <Box>
                    <form onSubmit={formikProps.handleSubmit}>
                        <FormControl flex={1} mt={4} isInvalid={!!formikProps.errors.amount && !!formikProps.touched.amount}>
                            <FormLabel alignItems={'baseline'}>Donation amount
                                <Tooltip hasArrow label={'TODO explanation'}><QuestionIcon mb={1} ml={1} /></Tooltip>
                            </FormLabel>
                            <Flex alignItems={'center'}>
                                <NumberInput flex="1" name="amount" value={formikProps.values.amount} min={1} step={1} max={90} onBlur={formikProps.handleBlur} onChange={(_: string, val: number) =>
                                    formikProps.setFieldValue('amount', val ? val : 0)
                                }>
                                    <NumberInputField/>
                                    <NumberInputStepper>
                                        <NumberIncrementStepper />
                                        <NumberDecrementStepper />
                                    </NumberInputStepper>
                                </NumberInput>
                                <chakra.div px={2}>{providedTokenSymbol}</chakra.div>
                                <Button isLoading={isLoading} isDisabled={!sendTransactionAsync} type='submit' variant='solid' colorScheme={'green'}>
                                    Donate
                                </Button>
                            </Flex>
                            <FormErrorMessage>{formikProps.errors.amount}</FormErrorMessage>
                        </FormControl>
                    </form>
                </Box>
                { started && <Box>
                    <PersonalStatistics
                        inputValue={formikProps.values.amount}
                        myTotalProvided={provided}
                        totalProvided={totalProvided}
                        totalDistributeAmount={totalDistributeAmount}
                        distributedTokenSymbol={distributedToken ? distributedToken.symbol : ''}
                        distributedTokenDecimal={distributedToken ? distributedToken.decimals : 0}
                        providedTokenSymbol={providedTokenSymbol}
                        providedTokenDecimal={providedTokenDecimal}
                        isEnding={ended}
                        isClaimed={isClaimed}
                    />
                </Box> }
            </Container>
        </>
    );
}