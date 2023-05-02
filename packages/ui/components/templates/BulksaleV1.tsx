import { Container, Heading, Flex, Box, Button, FormControl, FormLabel, FormErrorMessage, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, Tooltip, chakra} from '@chakra-ui/react';
import { QuestionIcon } from '@chakra-ui/icons';
import { useFormik } from 'formik';

interface BulksaleV1Params {
    title: string;
}

export default function BulksaleV1(props: BulksaleV1Params) {
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
                    <Box>Todo: Statistics</Box>
                    <Box>Todo: Calender</Box>
                </Flex>
                <Box>
                    <form onSubmit={formikProps.handleSubmit}>
                        <FormControl flex={1} mt={4} isInvalid={!!formikProps.errors.amount && !!formikProps.touched.amount}>
                            <FormLabel alignItems={'baseline'}>Donation amount
                                <Tooltip hasArrow label={'TODO explanation'}><QuestionIcon mb={1} ml={1} /></Tooltip>
                            </FormLabel>
                            <Flex alignItems={'center'}>
                                <NumberInput flex="1" name="amount" value={formikProps.values.amount / (60*60*24)} min={1} max={90} onBlur={formikProps.handleBlur} onChange={(_: string, val: number) =>
                                    formikProps.setFieldValue('amount', val*60*60*24)
                                }>
                                    <NumberInputField/>
                                    <NumberInputStepper>
                                        <NumberIncrementStepper />
                                        <NumberDecrementStepper />
                                    </NumberInputStepper>
                                </NumberInput>
                                <chakra.div px={2}>ETH</chakra.div>
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