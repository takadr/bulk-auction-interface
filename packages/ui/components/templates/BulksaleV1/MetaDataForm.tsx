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
import { MetaData } from '../../../types/BulksaleV1/index';

export default function MetaDataForm({formikProps, waitFn, onSkip}: {formikProps: FormikProps<MetaData>, waitFn?: ReturnType<typeof useWaitForTransaction>, onSkip?: () => void}) {
    return <div>
        <form onSubmit={formikProps.handleSubmit}>
            <HStack spacing={8} alignItems={'start'}>
                <chakra.div w={'50%'}>
                    <FormControl isInvalid={!!formikProps.errors.id && !!formikProps.touched.id}>
                        <FormLabel htmlFor='id' alignItems={'baseline'}>Auction Contract Address
                            <Tooltip hasArrow label={'TODO explanation'}><QuestionIcon mb={1} ml={1} /></Tooltip>
                        </FormLabel>
                        <HStack>
                            <Input 
                                isReadOnly={!!waitFn} 
                                isDisabled={!!waitFn} 
                                fontSize={'sm'} 
                                id="id"
                                name="id"
                                onBlur={formikProps.handleBlur}
                                onChange={formikProps.handleChange}
                                value={formikProps.values.id}
                                placeholder={waitFn && waitFn.isLoading ? 'Waiting for the transaction to be confirmed...' :'e.g.) 0x0123456789012345678901234567890123456789'} />
                            { waitFn && waitFn.isLoading && <Spinner  /> }
                        </HStack>
                        <FormErrorMessage>{formikProps.errors.id}</FormErrorMessage>
                    </FormControl>

                    <FormControl mt={4} isInvalid={!!formikProps.errors.title && !!formikProps.touched.title}>
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
                        <FormLabel alignItems={'baseline'}>Disclaimers, Terms and Conditions
                            <Tooltip hasArrow label={'TODO explanation'}><QuestionIcon mb={1} ml={1} /></Tooltip>
                        </FormLabel>
                        <Textarea id="terms" name="terms" onBlur={formikProps.handleBlur} onChange={formikProps.handleChange} value={formikProps.values.terms} placeholder=''>

                        </Textarea>
                        <Button size={'xs'} onClick={() => { alert('TODO') }}>Show examples</Button>
                        <FormErrorMessage>{formikProps.errors.description}</FormErrorMessage>
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
                </chakra.div>

                <chakra.div w={'50%'}>
                    <FormControl mt={{base: 4, md: 0}} isInvalid={!!formikProps.errors.projectURL && !!formikProps.touched.projectURL}>
                        <FormLabel htmlFor='projectURL' alignItems={'baseline'}>Project URL
                            <Tooltip hasArrow label={'TODO explanation'}><QuestionIcon mb={1} ml={1} /></Tooltip>
                        </FormLabel>
                        <Input id="projectURL" name="projectURL" onBlur={formikProps.handleBlur} onChange={formikProps.handleChange} value={formikProps.values.projectURL} placeholder='e.g.) https://xxx.xyz' />
                        <FormErrorMessage>{formikProps.errors.projectURL}</FormErrorMessage>
                    </FormControl>

                    <FormControl mt={4} isInvalid={!!formikProps.errors.logoURL && !!formikProps.touched.logoURL}>
                        <FormLabel htmlFor='logoURL' alignItems={'baseline'}>Project Logo URL
                            <Tooltip hasArrow label={'TODO explanation'}><QuestionIcon mb={1} ml={1} /></Tooltip>
                        </FormLabel>
                        <Input id="logoURL" name="logoURL" onBlur={formikProps.handleBlur} onChange={formikProps.handleChange} value={formikProps.values.logoURL} placeholder='e.g.) https://xxx.xyz/logo.png' />
                        <FormErrorMessage>{formikProps.errors.logoURL}</FormErrorMessage>
                    </FormControl>

                    {
                        // TODO otherURLs
                    }
                    <FormControl mt={4} isInvalid={!!formikProps.errors.logoURL && !!formikProps.touched.logoURL}>
                        <FormLabel htmlFor='logoURL' alignItems={'baseline'}>Project Logo URL
                            <Tooltip hasArrow label={'TODO explanation'}><QuestionIcon mb={1} ml={1} /></Tooltip>
                        </FormLabel>
                        <Input id="logoURL" name="logoURL" onBlur={formikProps.handleBlur} onChange={formikProps.handleChange} value={formikProps.values.logoURL} placeholder='e.g.) https://xxx.xyz/logo.png' />
                        <FormErrorMessage>{formikProps.errors.logoURL}</FormErrorMessage>
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
                    // isDisabled={!formikProps.isValid}
                >
                    Save Bulksale Information
                </Button>
                <Button 
                    flex={1}
                    variant="outline" 
                    colorScheme='blue'
                    onClick={onSkip}
                    isDisabled={formikProps.isSubmitting}
                >
                    Skip (You can input this later)
                </Button>
            </HStack>
            
        </form>
    </div>
}