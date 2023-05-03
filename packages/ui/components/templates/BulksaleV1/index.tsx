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

const mockParams: BulksaleV1Params = {
    title: 'Test',
    unixStartDate: new Date('2021-07-09T21:00:00Z').getTime() / 1000, // unixTime
    unixEndDate: new Date('2021-07-15 06:00').getTime() / 1000, // unixTime
    totalDistributeAmount: BigInt(3600000000000),
}

export default function BulksaleV1(props: BulksaleV1Params) {
    const now = Date.now();
    // Static status
    const [startingAt, setStartingAt] = useState<number>(0);
    const [closingAt, setClosingAt] = useState<number>(0);
    const [totalDistributeAmount, setTotalDistributeAmount] = useState<bigint>(BigInt(0));
    const [minimalProvideAmount, setMinimalProvideAmount] = useState<bigint>(BigInt(0));
    const [providedTokenSymbol, setProvidedTokenSymbol] = useState<string>('');
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
        setMinimalProvideAmount(BigInt('10000000000000000'))
        setProvidedTokenSymbol('ETH');
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

        setFiatRate(1.0);
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
                <Heading>{props.title}</Heading>
                <Flex>
                    <StatisticsInCircle
                        totalProvided={totalProvided}
                        interimGoalAmount={interimGoalAmount}
                        finalGoalAmount={finalGoalAmount}
                        providedTokenSymbol={providedTokenSymbol}
                        fiatSymbol={fiatSymbol}
                        fiatRate={fiatRate}
                        contractAddress={props.contractAddress}
                        started={started}
                     />
                    <CalendarInCircle
                        unixStartDate={props.unixStartDate}
                        unixEndDate={props.unixEndDate}
                    />
                </Flex>
                <Box>
                    <form onSubmit={formikProps.handleSubmit}>
                        <FormControl flex={1} mt={4} isInvalid={!!formikProps.errors.amount && !!formikProps.touched.amount}>
                            <FormLabel alignItems={'baseline'}>Donation amount
                                <Tooltip hasArrow label={'TODO explanation'}><QuestionIcon mb={1} ml={1} /></Tooltip>
                            </FormLabel>
                            <Flex alignItems={'center'}>
                                <NumberInput flex="1" name="amount" value={formikProps.values.amount} min={1} max={90} onBlur={formikProps.handleBlur} onChange={(_: string, val: number) =>
                                    formikProps.setFieldValue('amount', val)
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
                <Box >
                    TODO: Personal statistics
                </Box>
            </Container>
        </>
    );
}