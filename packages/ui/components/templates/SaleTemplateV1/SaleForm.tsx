import { useRef } from 'react';
import { 
    chakra,
    Button,
    Flex, 
    Tooltip, 
    Input,
    FormControl,
    FormLabel,
    FormErrorMessage,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    Link,
    AlertIcon,
    Alert,
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    useDisclosure,
    Stack,
    Divider,
    Select,
    Spinner,
} from '@chakra-ui/react';
import { ExternalLinkIcon, QuestionIcon } from '@chakra-ui/icons';
import { useQuery } from '@apollo/client';
import { DateRangePicker } from 'rsuite';
import { FormikProps } from 'formik';
import { differenceInSeconds, format } from 'date-fns';
import { BigNumber, ethers } from 'ethers';
import { getDecimalsForView, getEtherscanLink, tokenAmountFormat } from 'lib/utils';
import Big, { getBigNumber, multiply } from 'lib/utils/bignumber';
import { SaleForm, Template } from 'lib/types/Sale';
import { CHAIN_NAMES } from 'lib/constants';
import { LIST_TEMPLATE_QUERY } from 'lib/apollo/query';

export default function SaleForm({formikProps, address, approvals, writeFn, tokenData, balance}: {formikProps: FormikProps<SaleForm>, address: `0x${string}`, approvals: any, writeFn: any, tokenData: any, balance?: BigNumber | undefined}) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const containerRef = useRef<HTMLFormElement>(null)
    const cancelRef = useRef<HTMLButtonElement>(null)
    const { data, loading, error, refetch } = useQuery(LIST_TEMPLATE_QUERY);

    return (
        <div>
            <form ref={containerRef} onSubmit={formikProps.handleSubmit}>
                <FormControl isInvalid={!!formikProps.errors.templateName && !!formikProps.touched.templateName}>
                    <FormLabel htmlFor='token' alignItems={'baseline'}>Select Sale Templete
                        <Tooltip hasArrow label={'You can choose the type of token sale'}><QuestionIcon mb={1} ml={1} /></Tooltip>
                    </FormLabel>
                    <Select isDisabled={true} id="templateName" name="templateName" onBlur={formikProps.handleBlur} onChange={formikProps.handleChange} value={formikProps.values.templateName}>
                        { !data && <option value=""><Spinner /></option> }
                        {
                            data && data.templates.map((template: Template) => <option key={template.id} value={template.templateName}>{ethers.utils.parseBytes32String(template.templateName)}</option>)
                        }
                    </Select>
                    <FormErrorMessage>{formikProps.errors.templateName}</FormErrorMessage>
                </FormControl>

                <FormControl mt={4} isInvalid={!!formikProps.errors.token && !!formikProps.touched.token}>
                    <FormLabel htmlFor='token' alignItems={'baseline'}>Token address
                        <Tooltip hasArrow label={'Input the address of the token you would like to allocate to this sale'}><QuestionIcon mb={1} ml={1} /></Tooltip>
                    </FormLabel>
                    <Input id="token" name="token" onBlur={formikProps.handleBlur} onChange={(event: React.ChangeEvent<any>) => {
                        formikProps.setFieldTouched('distributeAmount');
                        formikProps.handleChange(event);
                    }} value={formikProps.values.token ? formikProps.values.token : ''} placeholder='e.g.) 0x0123456789012345678901234567890123456789' />
                    <FormErrorMessage>{formikProps.errors.token}</FormErrorMessage>
                </FormControl>

                <chakra.p color={'gray.400'} fontSize={'sm'} mt={1}>
                    Don&apos;t have a token yet? <Link color={'gray.300'} href="https://www.smartcontracts.tools/token-generator/ethereum/" target="_blank">ETHEREUM Token Generator <ExternalLinkIcon /></Link>
                </chakra.p>

                <FormControl mt={4} isInvalid={(!!formikProps.errors.startingAt && !!formikProps.touched.startingAt) || (!!formikProps.errors.eventDuration && !!formikProps.touched.eventDuration)}>
                    <FormLabel alignItems={'baseline'}>Start date - End date
                        <Tooltip hasArrow label={'Input the duration of the token sale. If the sale is successful, the total raised can be withdrawn starting 3 days after the end of the sale. If the sale doesn’t reach the preset minimum total raised, the token can be withdrawn immediately after the end of the sale.'}><QuestionIcon mb={1} ml={1} /></Tooltip>
                    </FormLabel>
                    <DateRangePicker
                        onEnter={() => {
                            formikProps.setTouched({startingAt: true, eventDuration: true});
                            setTimeout(formikProps.validateForm, 200)
                        }}
                        onBlur={(value: any) => {
                            setTimeout(formikProps.validateForm, 200)
                        }}
                        onChange={(value: any) => {
                            if(!value) return
                            const start = value[0];
                            const end = value[1];
                            if(!start || !end) return
                            const duration = differenceInSeconds(end, start);
                            formikProps.setFieldValue('startingAt', start.getTime());
                            formikProps.setFieldValue('eventDuration', duration);
                            setTimeout(formikProps.validateForm, 200)
                        }}
                        onOk={
                            (value: any) => {
                                if(!value) return
                                const start = value[0];
                                const end = value[1];
                                if(!start || !end) return
                                const duration = differenceInSeconds(end, start);
                                formikProps.setFieldValue('startingAt', start.getTime());
                                formikProps.setFieldValue('eventDuration', duration);
                                setTimeout(formikProps.validateForm, 200)
                            }
                        }
                        format="yyyy-MM-dd HH:mm:ss"
                        cleanable={false}
                        defaultValue={[new Date(formikProps.values.startingAt), new Date(formikProps.values.startingAt + formikProps.values.eventDuration*1000)]}
                    />
                    <chakra.span fontSize={'sm'} ml={2}>({format(0, 'z')})</chakra.span>
                    <FormErrorMessage>{formikProps.errors.startingAt}</FormErrorMessage>
                    <FormErrorMessage>{formikProps.errors.eventDuration}</FormErrorMessage>
                </FormControl>

                <FormControl mt={4} isInvalid={!!formikProps.errors.distributeAmount && !!formikProps.touched.distributeAmount}>
                    <Flex justifyContent={'space-between'}>
                        <FormLabel alignItems={'baseline'}>Total distribute amount
                            <Tooltip hasArrow label={'Input the amount of tokens to be allocated in this sale.'}><QuestionIcon mb={1} ml={1} /></Tooltip>
                        </FormLabel>
                    </Flex>
                    
                    <Flex alignItems={'center'}>
                        <NumberInput flex="1" name="distributeAmount" value={formikProps.values.distributeAmount} min={0} max={Number.MAX_SAFE_INTEGER} onBlur={formikProps.handleBlur} onChange={(strVal: string, val: number) => 
                            formikProps.setFieldValue('distributeAmount', strVal && Number(strVal) === val ? strVal : (isNaN(val) ? 0 : val))
                        }>
                            <NumberInputField/>
                            <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                            </NumberInputStepper>
                        </NumberInput>
                        <chakra.div px={2} minW={'3rem'}>{tokenData?.symbol}</chakra.div>
                    </Flex>
                    <chakra.p color={'gray.400'} fontSize={'sm'}>
                        Balance: {balance && tokenData ? tokenAmountFormat(Big(balance.toString()), tokenData.decimals, getDecimalsForView(getBigNumber(tokenData.totalSupply.value.toString()), tokenData.decimals)) : '-'} {tokenData?.symbol}
                    </chakra.p>
                    <FormErrorMessage>{formikProps.errors.distributeAmount}</FormErrorMessage>
                    { !!Number(formikProps.values.distributeAmount) && !!tokenData && !!multiply(formikProps.values.distributeAmount, Big(10).pow(tokenData.decimals)).lt(1000) &&
                        <Alert status='warning' py={2} px={2}>
                            <AlertIcon />
                            <chakra.span fontSize={'sm'}>The allocation is too small, and some participants may not be able to complete their claims. Unclaimed tokens cannot be withdrawn by you either. Please consider increasing the allocation amount.</chakra.span>
                        </Alert>
                    }
                </FormControl>

                <FormControl mt={4} isInvalid={!!formikProps.errors.minimalProvideAmount && !!formikProps.touched.minimalProvideAmount}>
                    <FormLabel alignItems={'baseline'}>Minimum total raised
                        <Tooltip hasArrow label={'The sale will be void if the total raised is less than this threshold, and the total raised will be refunded.'}><QuestionIcon mb={1} ml={1} /></Tooltip>
                    </FormLabel>
                    <Flex alignItems={'center'}>
                        <NumberInput flex="1" name="minimalProvideAmount" value={formikProps.values.minimalProvideAmount} step={0.01} min={0} max={10000000} onBlur={formikProps.handleBlur} onChange={(strVal: string, val: number) =>
                            formikProps.setFieldValue('minimalProvideAmount', strVal && Number(strVal) === val ? strVal : (isNaN(val) ? 0 : val))
                        }>
                            <NumberInputField/>
                            <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                            </NumberInputStepper>
                        </NumberInput>
                        <chakra.div px={2}>ETH</chakra.div>
                    </Flex>
                    <FormErrorMessage>{formikProps.errors.minimalProvideAmount}</FormErrorMessage>
                </FormControl>
                {
                    approvals.allowance && Big(approvals.allowance).gte(multiply(Big(formikProps.values.distributeAmount.toString()), Big(10).pow(tokenData ? tokenData.decimals : 0))) ?
                    <>
                        <Button mt={8} 
                            w={'full'} 
                            variant="solid" 
                            colorScheme='green'
                            isLoading={writeFn.isLoading}
                            isDisabled={!writeFn.writeAsync || !formikProps.isValid}
                            onClick={onOpen}
                        >
                            Deploy Sale Contract
                        </Button>
                        <AlertDialog
                            isOpen={isOpen}
                            size={'lg'}
                            leastDestructiveRef={cancelRef}
                            onClose={onClose}
                            closeOnOverlayClick={false}
                            portalProps={{containerRef: containerRef}}
                        >
                            <AlertDialogOverlay>
                            <AlertDialogContent>
                                <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                                Confirmation
                                </AlertDialogHeader>

                                <AlertDialogBody>
                                    <Stack spacing={4} divider={<Divider />}>
                                        <div>
                                            <chakra.p>Sale Template</chakra.p>
                                            <chakra.p fontWeight={'bold'} aria-label="Sale Template">
                                                {ethers.utils.parseBytes32String(formikProps.values.templateName)}
                                            </chakra.p>
                                        </div>

                                        <div>
                                            <chakra.p>Token address</chakra.p>
                                            <chakra.p fontWeight={'bold'} aria-label="Token address">
                                                <Link href={getEtherscanLink(CHAIN_NAMES[process.env.NEXT_PUBLIC_CHAIN_ID!], formikProps.values.token as `0x${string}`, 'token')} target={'_blank'}>
                                                    {formikProps.values.token}
                                                    <ExternalLinkIcon ml={1} />
                                                </Link>
                                            </chakra.p>
                                        </div>

                                        <div>
                                            <chakra.p>Start date - End date</chakra.p>
                                            <chakra.p fontWeight={'bold'} aria-label="Start date - End date">
                                                <>
                                                {format(formikProps.values.startingAt, 'yyyy/MM/dd HH:mm:ss')}
                                                {` - `}
                                                {format(formikProps.values.startingAt + formikProps.values.eventDuration*1000, 'yyyy/MM/dd HH:mm:ss')}
                                                {' '}{format(new Date, '(z)')}
                                                </>
                                            </chakra.p>
                                        </div>

                                        <div>
                                            <chakra.p>Allocation to the sale</chakra.p>
                                            <chakra.p fontWeight={'bold'} aria-label="Allocation to the sale">
                                                {tokenData ? Number(formikProps.values.distributeAmount).toFixed(getDecimalsForView(getBigNumber(tokenData?.totalSupply.value.toString()), tokenData?.decimals)) : '-'} {tokenData?.symbol}
                                            </chakra.p>
                                        </div>

                                        <div>
                                            <chakra.p>Minimum total raised</chakra.p>
                                            <chakra.p fontWeight={'bold'} aria-label="Minimum total raised">{Number(formikProps.values.minimalProvideAmount).toFixed(2)} ETH</chakra.p>
                                        </div>
                                    </Stack>
                                </AlertDialogBody>

                                <AlertDialogFooter>
                                    <Button ref={cancelRef} onClick={onClose}>
                                        Cancel
                                    </Button>
                                    <Button 
                                        ml={4}
                                        type="submit"
                                        variant="solid" 
                                        colorScheme='green'
                                        isLoading={writeFn.isLoading}
                                        isDisabled={!writeFn.writeAsync || !formikProps.isValid}
                                    >
                                        Deploy Sale Contract
                                    </Button>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                            </AlertDialogOverlay>
                        </AlertDialog>
                    </>
                    :
                    <Button mt={8} 
                        w={'full'} 
                        variant="solid" 
                        colorScheme='blue'
                        onClick={approvals.writeFn.write}
                        isLoading={approvals.writeFn.isLoading || approvals.waitFn.isLoading}
                        isDisabled={!approvals.writeFn.write || !formikProps.isValid}
                    >
                        Approve token
                    </Button>
                }
                
            </form>
        </div>
    )
}