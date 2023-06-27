import { 
    chakra,
    Button,
    Flex, 
    Tooltip, 
    Input,
    Textarea,
    FormControl,
    FormLabel,
    FormErrorMessage,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    HStack,
    Spinner
} from '@chakra-ui/react';
import { QuestionIcon } from '@chakra-ui/icons';
import { FormikProps } from 'formik';
import { useWaitForTransaction } from 'wagmi';
import { MetaData } from 'lib/types/Sale';
import { SAMPLE_DISCLAIMERS } from 'lib/constants';

export default function MetaDataForm({formikProps, waitFn, onSkip}: {formikProps: FormikProps<MetaData>, waitFn?: ReturnType<typeof useWaitForTransaction>, onSkip?: () => void}) {
    return <div>
        <form onSubmit={formikProps.handleSubmit}>
            <HStack spacing={8} alignItems={'start'}>
                <chakra.div w={'50%'}>
                    <FormControl isInvalid={!!formikProps.errors.id && !!formikProps.touched.id}>
                        <FormLabel htmlFor='id' alignItems={'baseline'}>Sale Contract Address
                            <Tooltip hasArrow label={'The address of the sale contract'}><QuestionIcon mb={1} ml={1} /></Tooltip>
                        </FormLabel>
                        <HStack>
                            <Input 
                                isReadOnly={true} 
                                isDisabled={true}
                                fontSize={'sm'} 
                                id="id"
                                name="id"
                                onBlur={formikProps.handleBlur}
                                onChange={formikProps.handleChange}
                                value={formikProps.values.id}
                                placeholder={waitFn && waitFn.isLoading ? 'Waiting for the transaction to be confirmed...' : ''} />
                            { waitFn && waitFn.isLoading && <Spinner  /> }
                        </HStack>
                        <FormErrorMessage>{formikProps.errors.id}</FormErrorMessage>
                    </FormControl>

                    <FormControl mt={4} isInvalid={!!formikProps.errors.title && !!formikProps.touched.title}>
                        <FormLabel htmlFor='title' alignItems={'baseline'}>Title
                            <Tooltip hasArrow label={'Input the title of this sale'}><QuestionIcon mb={1} ml={1} /></Tooltip>
                        </FormLabel>
                        <Input id="title" name="title" maxLength={100} onBlur={formikProps.handleBlur} onChange={formikProps.handleChange} value={formikProps.values.title} placeholder='e.g. DFGC Donation Event' />
                        <FormErrorMessage>{formikProps.errors.title}</FormErrorMessage>
                    </FormControl>

                    <FormControl mt={4} isInvalid={!!formikProps.errors.description && !!formikProps.touched.description}>
                        <FormLabel alignItems={'baseline'}>Description
                            <Tooltip hasArrow label={'Input the description of this sale'}><QuestionIcon mb={1} ml={1} /></Tooltip>
                        </FormLabel>
                        <Flex alignItems={'center'}>
                            <Textarea id="description" name="description" maxLength={1000} onBlur={formikProps.handleBlur} onChange={formikProps.handleChange} value={formikProps.values.description} placeholder='Explain your event'>

                            </Textarea>
                        </Flex>
                        <FormErrorMessage>{formikProps.errors.description}</FormErrorMessage>
                    </FormControl>

                    <FormControl mt={4} isInvalid={!!formikProps.errors.terms && !!formikProps.touched.terms}>
                        <FormLabel alignItems={'baseline'}>Disclaimers & Terms and Conditions
                            <Tooltip hasArrow label={'Input the disclaimer and T&C for this sale, where applicable. You can click "Use sample disclaimer text" button to input a standard disclaimer.'}><QuestionIcon mb={1} ml={1} /></Tooltip>
                        </FormLabel>
                        <Textarea id="terms" name="terms" maxLength={2000} onBlur={formikProps.handleBlur} onChange={formikProps.handleChange} value={formikProps.values.terms} placeholder=''>

                        </Textarea>
                        <Button colorScheme={'blue'} size={'xs'} mt={1} onClick={() => formikProps.setFieldValue('terms', SAMPLE_DISCLAIMERS)}>Use sample disclaimer text</Button>
                        <FormErrorMessage>{formikProps.errors.terms}</FormErrorMessage>
                    </FormControl>

                    <FormControl mt={4} isInvalid={!!formikProps.errors.targetTotalRaised && !!formikProps.touched.targetTotalRaised}>
                        <FormLabel alignItems={'baseline'}>Target total raised
                            <Tooltip hasArrow label={'Set the target amount you wish to achieve in this sale. It will be displayed as the "Target total raised" to other users. You can change this value at any time, and it does not affect the success or failure of the sale itself'}><QuestionIcon mb={1} ml={1} /></Tooltip>
                        </FormLabel>
                        <Flex alignItems={'center'}>
                            <NumberInput flex="1" name="targetTotalRaised" value={formikProps.values.targetTotalRaised} step={0.01} precision={2} min={0} max={10000000} onBlur={formikProps.handleBlur} onChange={(strVal: string, val: number) =>
                                formikProps.setFieldValue('targetTotalRaised', strVal && Number(strVal) === val ? strVal : (isNaN(val) ? 0 : val))
                            }>
                                <NumberInputField/>
                                <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                </NumberInputStepper>
                            </NumberInput>
                            <chakra.div px={2}>ETH</chakra.div>
                        </Flex>
                        <FormErrorMessage>{formikProps.errors.targetTotalRaised}</FormErrorMessage>
                    </FormControl>

                    <FormControl mt={4} isInvalid={!!formikProps.errors.maximumTotalRaised && !!formikProps.touched.maximumTotalRaised}>
                        <FormLabel alignItems={'baseline'}>Maximum total raised (for graphical use)
                            <Tooltip hasArrow label={'Set the Maximum total raised, which will be solely used as the 100% value for the progress bar and won\'t be displayed elsewhere. You can change this value at any time, and it does not affect the success or failure of the sale itself. Also, users can buy even after this value is achieved.'}><QuestionIcon mb={1} ml={1} /></Tooltip>
                        </FormLabel>
                        <Flex alignItems={'center'}>
                            <NumberInput flex="1" name="maximumTotalRaised" value={formikProps.values.maximumTotalRaised} step={0.01} precision={2} min={0} max={10000000} onBlur={formikProps.handleBlur} onChange={(strVal: string, val: number) =>
                                formikProps.setFieldValue('maximumTotalRaised', strVal && Number(strVal) === val ? strVal : (isNaN(val) ? 0 : val))
                            }>
                                <NumberInputField/>
                                <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                </NumberInputStepper>
                            </NumberInput>
                            <chakra.div px={2}>ETH</chakra.div>
                        </Flex>
                        <FormErrorMessage>{formikProps.errors.maximumTotalRaised}</FormErrorMessage>
                    </FormControl>
                </chakra.div>

                <chakra.div w={'50%'}>
                    <FormControl mt={{base: 4, md: 0}} isInvalid={!!formikProps.errors.projectURL && !!formikProps.touched.projectURL}>
                        <FormLabel htmlFor='projectURL' alignItems={'baseline'}>Project URL
                            <Tooltip hasArrow label={'Input your project URL if you have it'}><QuestionIcon mb={1} ml={1} /></Tooltip>
                        </FormLabel>
                        <Input id="projectURL" name="projectURL" onBlur={formikProps.handleBlur} onChange={formikProps.handleChange} value={formikProps.values.projectURL} placeholder='e.g.) https://xxx.xyz' />
                        <FormErrorMessage>{formikProps.errors.projectURL}</FormErrorMessage>
                    </FormControl>

                    <FormControl mt={4} isInvalid={!!formikProps.errors.logoURL && !!formikProps.touched.logoURL}>
                        <FormLabel htmlFor='logoURL' alignItems={'baseline'}>Project Logo URL
                            <Tooltip hasArrow label={'Input your project logo URL if you have it'}><QuestionIcon mb={1} ml={1} /></Tooltip>
                        </FormLabel>
                        <Input id="logoURL" name="logoURL" onBlur={formikProps.handleBlur} onChange={formikProps.handleChange} value={formikProps.values.logoURL} placeholder='e.g.) https://xxx.xyz/logo.png' />
                        <FormErrorMessage>{formikProps.errors.logoURL}</FormErrorMessage>
                    </FormControl>

                    <FormControl mt={4} isInvalid={!!formikProps.errors.otherURL && !!formikProps.touched.otherURL}>
                        <FormLabel htmlFor='otherURL' alignItems={'baseline'}>Other URL
                            <Tooltip hasArrow label={'Input any URL if you want to show something to users'}><QuestionIcon mb={1} ml={1} /></Tooltip>
                        </FormLabel>
                        <Input id="otherURL" name="otherURL" onBlur={formikProps.handleBlur} onChange={formikProps.handleChange} value={formikProps.values.otherURL} placeholder='e.g.) https://twitter.com/xxx' />
                        <FormErrorMessage>{formikProps.errors.otherURL}</FormErrorMessage>
                    </FormControl>
                </chakra.div>
            </HStack>

            <HStack mt={8} alignItems={'center'}>
                <Button
                    flex={2} 
                    variant="solid" 
                    colorScheme='blue'
                    type='submit'
                    isLoading={formikProps.isSubmitting}
                    isDisabled={waitFn && waitFn.isLoading}
                    leftIcon={waitFn && waitFn.isLoading ? <Spinner /> : undefined}
                >
                    { waitFn && waitFn.isLoading ? 'Please wait for the transaction to be confirmed' : 'Save Sale Information' }
                </Button>
                { onSkip && <Button 
                    flex={1}
                    variant="outline" 
                    colorScheme='blue'
                    onClick={onSkip}
                    isDisabled={formikProps.isSubmitting}
                >
                    Skip (You can input this later)
                </Button> }
            </HStack>
            
        </form>
    </div>
}