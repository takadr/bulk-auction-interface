import { 
    chakra,
    useToast, 
    useColorMode, 
    Button,
    Flex, 
    Tooltip, 
    Input,
    Textarea,
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper
} from '@chakra-ui/react';
import { QuestionIcon } from '@chakra-ui/icons';
import { Field, Form, Formik, useFormik, FieldProps } from 'formik';

type MetaData = {
    title: string;
    description: string;
    terms: string;
    projectURL: string;
    logoURL: string;
    otherURLs: string[];
    interimGoalAmount: number;
    finalGoalAmount: number;
}

export default function MetaDataForm() {
    const initMetaData = {
        title: '',
        description: '',
        terms: '',
        projectURL: '',
        logoURL: '',
        otherURLs: [],
        interimGoalAmount: NaN,
        finalGoalAmount: NaN
    };

    const handleSubmit = () => {

    };

    const validate = () => {

    };

    const formikProps = useFormik({
        enableReinitialize: true,
        initialValues: initMetaData,
        onSubmit: handleSubmit,
        validate
    });

    return <div>
        <form onSubmit={formikProps.handleSubmit}>
            <FormControl isInvalid={!!formikProps.errors.title && !!formikProps.touched.title}>
                <FormLabel htmlFor='title' alignItems={'baseline'}>Title
                    <Tooltip hasArrow label={'TODO explanation'}><QuestionIcon mb={1} ml={1} /></Tooltip>
                </FormLabel>
                <Input id="title" name="title" onBlur={formikProps.handleBlur} onChange={formikProps.handleChange} value={formikProps.values.title} placeholder='e.g.) DFGC Donation Event' />
                <FormErrorMessage>{formikProps.errors.title}</FormErrorMessage>
            </FormControl>

            <FormControl mt={4} isInvalid={!!formikProps.errors.description && !!formikProps.touched.description}>
                <FormLabel alignItems={'baseline'}>Desctiption
                    <Tooltip hasArrow label={'TODO explanation'}><QuestionIcon mb={1} ml={1} /></Tooltip>
                </FormLabel>
                <Flex alignItems={'center'}>
                    <Textarea id="description" name="description" onBlur={formikProps.handleBlur} onChange={formikProps.handleChange} value={formikProps.values.description} placeholder='Explain your event'>

                    </Textarea>
                </Flex>
                <FormErrorMessage>{formikProps.errors.description}</FormErrorMessage>
            </FormControl>

            <FormControl mt={4} isInvalid={!!formikProps.errors.terms && !!formikProps.touched.terms}>
                <FormLabel alignItems={'baseline'}>Disclaimers, Terms and Conditions.
                    <Tooltip hasArrow label={'TODO explanation'}><QuestionIcon mb={1} ml={1} /></Tooltip>
                </FormLabel>
                <Flex alignItems={'center'}>
                    <Textarea id="terms" name="terms" onBlur={formikProps.handleBlur} onChange={formikProps.handleChange} value={formikProps.values.terms} placeholder=''>

                    </Textarea>
                    <Button size={'xs'} onClick={() => { alert('TODO') }}>Show examples</Button>
                </Flex>
                <FormErrorMessage>{formikProps.errors.description}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!formikProps.errors.projectURL && !!formikProps.touched.projectURL}>
                <FormLabel htmlFor='projectURL' alignItems={'baseline'}>Project URL
                    <Tooltip hasArrow label={'TODO explanation'}><QuestionIcon mb={1} ml={1} /></Tooltip>
                </FormLabel>
                <Input id="projectURL" name="projectURL" onBlur={formikProps.handleBlur} onChange={formikProps.handleChange} value={formikProps.values.title} placeholder='e.g.) https://xxx.xyz' />
                <FormErrorMessage>{formikProps.errors.projectURL}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!formikProps.errors.logoURL && !!formikProps.touched.logoURL}>
                <FormLabel htmlFor='logoURL' alignItems={'baseline'}>Project Logo URL
                    <Tooltip hasArrow label={'TODO explanation'}><QuestionIcon mb={1} ml={1} /></Tooltip>
                </FormLabel>
                <Input id="logoURL" name="logoURL" onBlur={formikProps.handleBlur} onChange={formikProps.handleChange} value={formikProps.values.logoURL} placeholder='e.g.) https://xxx.xyz/logo.png' />
                <FormErrorMessage>{formikProps.errors.logoURL}</FormErrorMessage>
            </FormControl>

            {
                // TODO otherURLs
            }
            <FormControl isInvalid={!!formikProps.errors.logoURL && !!formikProps.touched.logoURL}>
                <FormLabel htmlFor='logoURL' alignItems={'baseline'}>Project Logo URL
                    <Tooltip hasArrow label={'TODO explanation'}><QuestionIcon mb={1} ml={1} /></Tooltip>
                </FormLabel>
                <Input id="logoURL" name="logoURL" onBlur={formikProps.handleBlur} onChange={formikProps.handleChange} value={formikProps.values.logoURL} placeholder='e.g.) https://xxx.xyz/logo.png' />
                <FormErrorMessage>{formikProps.errors.logoURL}</FormErrorMessage>
            </FormControl>

            <FormControl mt={4} isInvalid={!!formikProps.errors.interimGoalAmount && !!formikProps.touched.interimGoalAmount}>
                <FormLabel alignItems={'baseline'}>Interim Goal Amount
                    <Tooltip hasArrow label={'TODO explanation'}><QuestionIcon mb={1} ml={1} /></Tooltip>
                </FormLabel>
                <Flex alignItems={'center'}>
                    <NumberInput flex="1" name="interimGoalAmount" value={formikProps.values.interimGoalAmount} step={0.01} precision={2} min={0} max={10000000} onBlur={formikProps.handleBlur} onChange={(strVal: string, val: number) =>
                        formikProps.setFieldValue('interimGoalAmount', strVal ? strVal : 0)
                    }>
                        <NumberInputField/>
                        <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                        </NumberInputStepper>
                    </NumberInput>
                    <chakra.div px={2}>ETH</chakra.div>
                </Flex>
                <FormErrorMessage>{formikProps.errors.interimGoalAmount}</FormErrorMessage>
            </FormControl>

            <FormControl mt={4} isInvalid={!!formikProps.errors.finalGoalAmount && !!formikProps.touched.finalGoalAmount}>
                <FormLabel alignItems={'baseline'}>Interim Goal Amount
                    <Tooltip hasArrow label={'TODO explanation'}><QuestionIcon mb={1} ml={1} /></Tooltip>
                </FormLabel>
                <Flex alignItems={'center'}>
                    <NumberInput flex="1" name="finalGoalAmount" value={formikProps.values.finalGoalAmount} step={0.01} precision={2} min={0} max={10000000} onBlur={formikProps.handleBlur} onChange={(strVal: string, val: number) =>
                        formikProps.setFieldValue('finalGoalAmount', strVal ? strVal : 0)
                    }>
                        <NumberInputField/>
                        <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                        </NumberInputStepper>
                    </NumberInput>
                    <chakra.div px={2}>ETH</chakra.div>
                </Flex>
                <FormErrorMessage>{formikProps.errors.finalGoalAmount}</FormErrorMessage>
            </FormControl>

            <Button mt={8} 
                w={'full'} 
                variant="solid" 
                colorScheme='blue'
                // onClick={}
                // isLoading={}
                // isDisabled={}
            >
                Save Bulksale Information
            </Button>
            
        </form>
    </div>
}