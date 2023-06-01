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
    Link
} from '@chakra-ui/react';
import { ExternalLinkIcon, QuestionIcon } from '@chakra-ui/icons';
import { CustomProvider, DateRangePicker } from 'rsuite';
import { FormikProps } from 'formik';
import { differenceInSeconds, addSeconds, format } from 'date-fns';
import { SaleForm } from '../../../types/BulksaleV1';
import { BigNumber } from 'ethers';
import { getDecimalsForView, tokenAmountFormat } from '../../../utils';
import Big, { getBigNumber, multiply } from '../../../utils/bignumber';
import { useEffect } from 'react';

export default function BulksaleV1Form({formikProps, address, approvals, writeFn, tokenData, balance}: {formikProps: FormikProps<SaleForm>, address: `0x${string}`, approvals: any, writeFn: any, tokenData: any, balance?: BigNumber | undefined}) {
    return (
        <div>
            <form onSubmit={formikProps.handleSubmit}>
                <FormControl isInvalid={!!formikProps.errors.token && !!formikProps.touched.token}>
                    <FormLabel htmlFor='token' alignItems={'baseline'}>Token address
                        <Tooltip hasArrow label={'TODO explanation'}><QuestionIcon mb={1} ml={1} /></Tooltip>
                    </FormLabel>
                    <Input id="token" name="token" onBlur={formikProps.handleBlur} onChange={(event: React.ChangeEvent<any>) => {
                        formikProps.setFieldTouched('distributeAmount');
                        formikProps.handleChange(event);
                    }} value={formikProps.values.token ? formikProps.values.token : ''} placeholder='e.g.) 0x0123456789012345678901234567890123456789' />
                    <FormErrorMessage>{formikProps.errors.token}</FormErrorMessage>
                </FormControl>

                <chakra.p color={'gray.400'} fontSize={'sm'} mt={1}>
                    Don't have token yet? <Link color={'gray.300'} href="https://www.smartcontracts.tools/token-generator/ethereum/" target="_blank">ETHEREUM Token Generator <ExternalLinkIcon /></Link>
                </chakra.p>

                <FormControl mt={4} isInvalid={(!!formikProps.errors.startingAt && !!formikProps.touched.startingAt) || (!!formikProps.errors.eventDuration && !!formikProps.touched.eventDuration)}>
                    <FormLabel alignItems={'baseline'}>Start date - End date
                        <Tooltip hasArrow label={'TODO explanation'}><QuestionIcon mb={1} ml={1} /></Tooltip>
                    </FormLabel>
                    <DateRangePicker
                        // className={colorMode === 'light' ? 'rs-theme-high-contrast' : 'rs-theme-dark'}
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
                        // value={
                        //     [
                        //         new Date(formikProps.values.startingAt), 
                        //         new Date(formikProps.values.startingAt + formikProps.values.eventDuration*1000)
                        //     ]}
                        format="yyyy-MM-dd HH:mm:ss"
                        cleanable={false}
                        defaultValue={[new Date(formikProps.values.startingAt), new Date(formikProps.values.startingAt + formikProps.values.eventDuration*1000)]}
                    />
                    <chakra.span fontSize={'sm'} ml={2}>({format(0, 'z')})</chakra.span>
                    {/* {new Date(formikProps.values.startingAt).toLocaleString()}
                    -
                    {new Date(formikProps.values.startingAt + formikProps.values.eventDuration*1000).toLocaleString()} */}
                    <FormErrorMessage>{formikProps.errors.startingAt}</FormErrorMessage>
                    <FormErrorMessage>{formikProps.errors.eventDuration}</FormErrorMessage>
                </FormControl>

                <FormControl mt={4} isInvalid={!!formikProps.errors.distributeAmount && !!formikProps.touched.distributeAmount}>
                    <Flex justifyContent={'space-between'}>
                        <FormLabel alignItems={'baseline'}>Total distribute amount
                            <Tooltip hasArrow label={'TODO explanation'}><QuestionIcon mb={1} ml={1} /></Tooltip>
                        </FormLabel>
                    </Flex>
                    
                    <Flex alignItems={'center'}>
                        <NumberInput flex="1" name="distributeAmount" value={formikProps.values.distributeAmount} precision={2} min={0.01} step={0.01} max={Number.MAX_SAFE_INTEGER} onBlur={formikProps.handleBlur} onChange={(strVal: string, val: number) => 
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
                        Balance: {balance && tokenData ? tokenAmountFormat(Big(balance.toString()), tokenData?.decimals, getDecimalsForView(getBigNumber(tokenData?.totalSupply.value.toString()), tokenData?.decimals)) : '-'} {tokenData?.symbol}
                    </chakra.p>
                    <FormErrorMessage>{formikProps.errors.distributeAmount}</FormErrorMessage>
                </FormControl>

                <FormControl mt={4} isInvalid={!!formikProps.errors.minimalProvideAmount && !!formikProps.touched.minimalProvideAmount}>
                    <FormLabel alignItems={'baseline'}>Minimum provide amount
                        <Tooltip hasArrow label={'If the bid amount falls below this value, the auction will be void, and the bid amount will be refunded.'}><QuestionIcon mb={1} ml={1} /></Tooltip>
                    </FormLabel>
                    <Flex alignItems={'center'}>
                        <NumberInput flex="1" name="minimalProvideAmount" value={formikProps.values.minimalProvideAmount} step={0.01} precision={2} min={0} max={10000000} onBlur={formikProps.handleBlur} onChange={(strVal: string, val: number) =>
                            // formikProps.setFieldValue('minimalProvideAmount', val)
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
                    <Button mt={8} 
                        type="submit" 
                        w={'full'} 
                        variant="solid" 
                        colorScheme='green'
                        isLoading={writeFn.isLoading}
                        isDisabled={!writeFn.writeAsync || !formikProps.isValid}
                    >
                        Deploy Sale Contract
                    </Button> :
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