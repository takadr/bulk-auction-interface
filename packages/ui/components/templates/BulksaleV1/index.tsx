import { useState, useEffect } from 'react';
import { Container, Heading, Flex, Box, Button, FormControl, FormLabel, FormErrorMessage, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, Tooltip, chakra, useInterval} from '@chakra-ui/react';
import { QuestionIcon } from '@chakra-ui/icons';
import { useFormik } from 'formik';
import { format, formatDistance, formatRelative, subDays } from 'date-fns';
import CalendarInCircle from './CalendarInCircle';
import PersonalStatistics from './PersonalStatistics';
import StatisticsInCircle from './StatisticsInCircle';

interface BulksaleV1Params {
    title?: string;
    contractAddress: `0x${string}`;
    unixStartDate: number;
    unixEndDate: number;
    totalDistributeAmount: bigint;
    minimalProvideAmount: bigint;
    lockDuration: number;
    expirationDuration: number;
    ownerAddress: `0x${string}`;
    tokenAddress: `0x${string}`;
}

// Static statuses
// uint public startingAt;
// uint public closingAt;
// uint public totalDistributeAmount;
// uint public minimalProvideAmount;
// uint public lockDuration;
// uint public expirationDuration;
// address public owner;
// uint public feeRatePerMil;
// IERC20 public erc20onsale;

// Dynamic statuses
// 1. Global
//   - totalProvided
// 2. Current user specific
//   - provided
//   - isClaimed

// const mockParams: BulksaleV1Params = {
//     title: 'Test',
//     unixStartDate: new Date('2021-07-09T21:00:00Z').getTime() / 1000, // unixTime
//     unixEndDate: new Date('2021-07-15 06:00').getTime() / 1000, // unixTime
//     totalDistributeAmount: BigInt(3600000000000),
// }

export default function BulksaleV1(props: any) {
    const now = Date.now();
    // Static status
    const [startingAt, setStartingAt] = useState<number>(0);
    const [closingAt, setClosingAt] = useState<number>(0);
    const [totalDistributeAmount, setTotalDistributeAmount] = useState<bigint>(BigInt(0));
    const [distributedTokenSymbol, setDistributedTokenSymbol] = useState<string>('');
    const [distributedTokenDecimal, setDistributedTokenDecimal] = useState<number>(0);
    const [minimalProvideAmount, setMinimalProvideAmount] = useState<bigint>(BigInt(0));
    const [providedTokenSymbol, setProvidedTokenSymbol] = useState<string>('');
    const [providedTokenDecimal, setProvidedTokenDecimal] = useState<number>(0);
    // Dynamic status
    const [totalProvided, setTotalProvided] = useState<bigint>(BigInt(0));
    const [provided, setProvided] = useState<bigint>(BigInt(0));
    const [isClaimed, setIsClaimed] = useState<boolean>(false);
    const [started, setStarted] = useState<boolean>(startingAt <= now);
    const [ended, setEnded] = useState<boolean>(closingAt < now);
    // Meta data
    const [interimGoalAmount, setInterimGoalAmount] = useState<bigint>(BigInt(0));
    const [finalGoalAmount, setFinalGoalAmount] = useState<bigint>(BigInt(0));
    // Local status
    const [fiatSymbol, setFiatSymbol] = useState<string>('usd');
    const [fiatRate, setFiatRate] = useState<number>(1.0);

    useEffect(() => {
        // TODO Retrieve contract data from Subgraph
        setStartingAt(new Date('2023-05-02T21:00:00Z').getTime());
        setClosingAt(new Date('2023-05-16T21:00:00Z').getTime());
        setTotalDistributeAmount(BigInt('21000000000000'));
        setDistributedTokenSymbol('TST');
        setDistributedTokenDecimal(8);
        setMinimalProvideAmount(BigInt('10000000000000000'))
        setProvidedTokenSymbol('ETH');
        setProvidedTokenDecimal(18);
        // - totalDistributeAmount
        // - minimalProvideAmount
        // (- providedTokenSymbol)

        // TODO Retrieve metadata
        setInterimGoalAmount(BigInt('300000000000000000000'));
        setFinalGoalAmount(BigInt('500000000000000000000'));
        // interimGoalAmount
        // finalGoalAmount
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
        setTotalProvided(BigInt('150000000000000000000'));
        setProvided(BigInt('2400000000000000000'));
        setIsClaimed(false);
        setStarted(startingAt <= new Date().getTime());
        setEnded(closingAt < new Date().getTime());

        setFiatRate(1908);
    }, 1000);
    const handleSubmit = () => {

    };
    const validate = () => {

    };
    const formikProps = useFormik({
        enableReinitialize: true,
        initialValues: { amount: 0 },
        onSubmit: handleSubmit,
        validate
    });

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
                        contractAddress={"0x9eB51285EF530F700d4a9D179DA75cb971Df6Fe7"}
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
                                <Button type='submit' variant='solid' colorScheme={'green'}>
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
                        distributedTokenSymbol={distributedTokenSymbol}
                        distributedTokenDecimal={distributedTokenDecimal}
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