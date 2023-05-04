import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
} from '@chakra-ui/react';
import {
    Input,
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
    Checkbox,
    CheckboxGroup
} from '@chakra-ui/react';
import {
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
} from '@chakra-ui/react';
import {
    Slider,
    SliderTrack,
    SliderFilledTrack,
    SliderThumb,
    SliderMark,
} from '@chakra-ui/react'
import { Button, useToast, Flex, Tooltip, chakra } from '@chakra-ui/react';
import { QuestionIcon } from '@chakra-ui/icons';
import { Field, Form, Formik, useFormik, FieldProps } from 'formik';
import { useProvider, useNetwork, useAccount, useContractRead, usePrepareContractWrite, useContractWrite, useWaitForTransaction, useContractEvent, erc20ABI } from 'wagmi';
import { useDebounce } from 'use-debounce';
import { BigNumber, constants, utils } from 'ethers';
import { format, formatDistance, formatRelative, differenceInSeconds, addSeconds } from 'date-fns';
import { CustomProvider } from 'rsuite';
import { DateRangePicker } from 'rsuite';
import 'rsuite/dist/rsuite-no-reset.min.css';
import useApprove from '../hooks/useApprove';
import useTokenBasicInfo from '../hooks/useTokenBasicInfo';
import { useAtom } from 'jotai';
import { saleTxAtom, saleClonesAtom, waitingTransactionAtom } from '../store';

const now = new Date().getTime();

export default function SaleFormModal({isOpen, onClose}: {isOpen: boolean, onClose: () => void}) {
    interface Sale {
        token: `0x${string}` | null;
        startingAt: number; //Timestamp
        eventDuration: number; //In sec
        lockDuration: number; //In sec
        expirationDuration: number; //In sec
        totalDistributeAmount: number;
        minimalProvideAmount: number;
        owner?: `0x${string}`;
        feeRatePerMil: number;
    }
    // const now = new Date().getTime();
    const { chain } = useNetwork();
    const { address } = useAccount();
    const toast = useToast({position: 'top-right', isClosable: true,});
    const [saleTxs, setSaleTxs] = useAtom(saleTxAtom);
    const [saleClones, setSaleClones] = useAtom(saleClonesAtom);
    const [waitingTransaction, setWaitingTransaction] = useAtom(waitingTransactionAtom);

    const emptySale: Sale = {
        token: null,
        startingAt: now + (60 * 60 * 24 * 7 * 1000),
        eventDuration: 60 * 60 * 24 * 7,
        lockDuration: 60 * 60 * 24 * 7,
        expirationDuration: 60 * 60 * 24 * 30,
        totalDistributeAmount: 1,
        minimalProvideAmount: 1,
        owner: address!,//'0x09c208Bee9B7Bbb4f630B086a73A1a90E8E881A5',//TODO
        feeRatePerMil: 1
    }
    // const token = "0xe5eb10386c77e90b7a8fc1ac3f734a6137ffcfa9";
    // const startingAt = 1682737392 + 60*60*24*6;
    // const eventDuration = 60*60*24*10; //10日間
    // const lockDuration = 60*60*24*1;
    // const expirationDuration = 60*60*24*90;
    // const totalDistributeAmount = 10;
    // const minimalProvideAmount = 1;
    // const owner = _owner_;
    // const feeRatePerMil = 10;

    const MAX_LENGTH = 20; // TODO
    const factoryABI = [
        {
          name: 'deploy',
          type: 'function',
          stateMutability: 'nonpayable',
          inputs: [
            {
              "internalType": "string",
              "name": "templateName",
              "type": "string"
            },
            {
              "internalType": "address",
              "name": "tokenAddr",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "sellingAmount",
              "type": "uint256"
            },
            {
              "internalType": "bytes",
              "name": "abiArgs",
              "type": "bytes"
            }
          ],
          outputs: [
            {
              "internalType": "address",
              "name": "deployedAddr",
              "type": "address"
            }
          ],
        },
    ];
   
    const validate = (values: Sale) => {
        const errors: any = {};
        // TODO
        // if (!values.name) {
        //     errors.name = 'Name is required';
        // } else if (values.name.length > MAX_LENGTH) {
        //     errors.name = `Name must be shorter than ${MAX_LENGTH}`;
        // }

        // if (!values.symbol) {
        //     errors.symbol = 'Symbol is required';
        // } else if (values.symbol.length > MAX_LENGTH) {
        //     errors.symbol = `Symbol must be shorter than ${MAX_LENGTH}`;
        // }

        // if (!values.initialSupply) {
        //     errors.initialSupply = 'Initial supply is required';
        // } else if (values.initialSupply) {
        //     errors.initialSupply = `Initial supply must be shorter than ${MAX_LENGTH}`;
        // }
      
        return errors;
    };

    const handleClose = () => {
        formikProps.setValues(emptySale);
        formikProps.setTouched(
            {
                token: false,
                startingAt: false,
                eventDuration: false,
                lockDuration: false,
                expirationDuration: false,
                totalDistributeAmount: false,
                minimalProvideAmount: false,
                owner: false,
                feeRatePerMil: false
            }
        );
        onClose();
    }
    
    const handleSubmit = async (token: Sale) => {
        if(!writeFn || !writeFn.writeAsync) {
            // TODO Error
            return;
        }
        try {
            const result = await writeFn.writeAsync();
            setWaitingTransaction(result.hash);
            handleClose();
            toast({
                description: `Transaction sent! ${result.hash}`,
                status: 'success',
                duration: 5000,
            })
        } catch(e: any) {
            // TODO
            toast({
                description: e.message,
                status: 'error',
                duration: 5000,
            })
        }
    }

    const getBytesParams = (sale: Sale): `0x${string}` => {
        try {
            return utils.hexlify(abi.encode(
                ['address', 'uint', 'uint', 'uint', 'uint', 'uint', 'uint', 'address', 'uint'],
                [sale.token, Math.round(sale.startingAt / 1000), sale.eventDuration, sale.lockDuration, sale.expirationDuration, sale.totalDistributeAmount, sale.minimalProvideAmount, sale.owner, sale.feeRatePerMil]
                // Object.values(sale)
            )) as `0x${string}`
        } catch(e: any) {
            return '0x00';
        }
    }

    const formikProps = useFormik({
        enableReinitialize: true,
        initialValues: Object.assign({}, emptySale),
        onSubmit: handleSubmit,
        validate
    });
    const [debouncedSale] = useDebounce(formikProps.values, 500);
    const approvals = useApprove(debouncedSale.token, address as `0x${string}`, process.env.NEXT_PUBLIC_FACTORY_ADDRESS as `0x${string}`);
    const tokenData = useTokenBasicInfo(debouncedSale.token);
    // const allowanceReadFn = useContractRead({
    //     address: debouncedSale.token ? debouncedSale.token : '0x',
    //     abi: erc20ABI,
    //     functionName: 'allowance',
    //     args: [address as `0x${string}`, process.env.NEXT_PUBLIC_FACTORY_ADDRESS as `0x${string}`],
    // })
    const abi = new utils.AbiCoder();

    const prepareFn = usePrepareContractWrite({
        address: process.env.NEXT_PUBLIC_FACTORY_ADDRESS as `0x${string}`, //factory
        abi: factoryABI,
        functionName: 'deploy',
        args: [
            "BulksaleV1.0.sol",
            debouncedSale.token,
            1000000,
            getBytesParams(debouncedSale),
        ],
    })
    
    const writeFn = useContractWrite({
        ...prepareFn.config,
        onError(e: Error) {
            // TODO
            console.log('!!!Error!!!!!!', e.message)
        },
        onSuccess(data) {
            // console.log('Submitted!', data)
            // setWaitingTransaction(waitFn);
            // console.log(waitingTransaction)
            // TODO
            // Modify tx status in the store
        }
    })
    // TODO 
    // Add tx hash with status loading to the store

    // const waitFn = useWaitForTransaction({
    //     chainId: chain?.id,
    //     hash: writeFn.data?.hash,
    //     // wait: writeFn.data?.wait
    //     onSuccess(data) {
    //         // console.log('Success!', data)
    //         // TODO
    //         // Modify tx status to confirmed in the store
    //         const newTxs = [...saleTxs.txs, data];
    //         setSaleTxs(Object.assign(saleTxs, {txs: newTxs}));
    //     },
    //     onError(e: Error) {
    //         console.log('Error!!!!!!', e.message)
    //     }
    // })

    useContractEvent({
        address: process.env.NEXT_PUBLIC_FACTORY_ADDRESS as `0x${string}`,
        abi: [
            {
                "anonymous": false,
                "inputs": [
                  {
                    "indexed": true,
                    "internalType": "address",
                    "name": "sender",
                    "type": "address"
                  },
                  {
                    "indexed": true,
                    "internalType": "string",
                    "name": "templateName",
                    "type": "string"
                  },
                  {
                    "indexed": true,
                    "internalType": "address",
                    "name": "deployedAddr",
                    "type": "address"
                  },
                  {
                    "indexed": false,
                    "internalType": "bytes",
                    "name": "abiArgs",
                    "type": "bytes"
                  }
                ],
                "name": "Deployed",
                "type": "event"
              },
        ],
        eventName: 'Deployed',
        listener(sender, templateName, deployedAddr, abiArgs) {
            // console.log(sender, templateName, deployedAddr, abiArgs);
            // console.log(abi.decode(
            //     ['address', 'uint', 'uint', 'uint', 'uint', 'uint', 'uint', 'address', 'uint'],
            //     abiArgs.slice(2)  // プレフィックス"0x"を除外する
            // ));
            const template: any = templateName;
            
            if(sender === address && template.hash === '0xee943a048e102ac70fe5e1cf4071b2723f6bb09fa7eb038b7c33122da4684e7e') {
                // const newAddresses = [...saleClones.addresses, deployedAddr];
                // setSaleClones(Object.assign(saleClones, {addresses: newAddresses}));
                const newAddresses = [...saleClones, deployedAddr];
                setSaleClones(newAddresses);
                // console.log(newAddresses)
            }
        },
    })

    return (
        <CustomProvider theme={'dark'}>
        <Modal
        isOpen={isOpen}
        onClose={handleClose}
        closeOnOverlayClick={false}
        size={'lg'}
    >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Create new sale</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                    {/* {approvals.readFn.data && console.log(approvals.readFn.data.toString())} */}
                    {/* {approvals.readFn && approvals.readFn.data} */}
                    {/* { console.log(saleTxs) } */}
                    <div>
                        <form onSubmit={formikProps.handleSubmit}>
                            <FormControl isInvalid={!!formikProps.errors.token && !!formikProps.touched.token}>
                                <FormLabel htmlFor='token' alignItems={'baseline'}>Token address
                                    <Tooltip hasArrow label={'TODO explanation'}><QuestionIcon mb={1} ml={1} /></Tooltip>
                                </FormLabel>
                                <Input id="token" name="token" onBlur={formikProps.handleBlur} onChange={(event: React.ChangeEvent<any>) => {
                                    formikProps.handleChange(event);
                                    // TODO Check if token exists and approved
                                }} value={formikProps.values.token ? formikProps.values.token : ''} placeholder='e.g.) 0x0123456789012345678901234567890123456789' />
                                <FormErrorMessage>{formikProps.errors.token}</FormErrorMessage>
                            </FormControl>
             
                            <FormControl mt={4} isInvalid={!!formikProps.errors.startingAt && !!formikProps.touched.startingAt}>
                                <FormLabel alignItems={'baseline'}>Start date - End date
                                    <Tooltip hasArrow label={'TODO explanation'}><QuestionIcon mb={1} ml={1} /></Tooltip>
                                </FormLabel>
                                <DateRangePicker
                                    onBlur={(value: any) => {
                                        // TODO
                                        console.log(value)
                                    }}
                                    onChange={(value: any) => {
                                        if(value === null) {
                                            formikProps.setFieldValue('startingAt', now + 60 * 60 * 24 * 7);
                                            formikProps.setFieldValue('eventDuration', 60 * 60 * 24 * 7);
                                        } else {
                                            const start = value[0];
                                            const end = value[1];
                                            const duration = differenceInSeconds(end, start);
                                            formikProps.setFieldValue('startingAt', start.getTime());
                                            formikProps.setFieldValue('eventDuration', duration);
                                        }
                                    }}
                                    value={
                                        [
                                            new Date(formikProps.values.startingAt), 
                                            addSeconds(new Date(formikProps.values.startingAt), formikProps.values.eventDuration)
                                        ]}
                                    format="yyyy-MM-dd HH:mm:ss"
                                    defaultCalendarValue={[new Date('2022-02-01 00:00:00'), new Date('2022-05-01 23:59:59')]}
                                />
                                <FormErrorMessage>{formikProps.errors.startingAt}</FormErrorMessage>
                            </FormControl>

                            <FormControl mt={4} isInvalid={!!formikProps.errors.lockDuration && !!formikProps.touched.lockDuration}>
                                <FormLabel alignItems={'baseline'}>Lock duration
                                    <Tooltip hasArrow label={'TODO explanation'}><QuestionIcon mb={1} ml={1} /></Tooltip>
                                </FormLabel>
                                <Flex alignItems={'center'}>
                                    <NumberInput flex="1" name="lockDuration" value={formikProps.values.lockDuration / (60*60*24)} min={1} max={90} onBlur={formikProps.handleBlur} onChange={(_: string, val: number) =>
                                        formikProps.setFieldValue('lockDuration', val*60*60*24)
                                    }>
                                        <NumberInputField/>
                                        <NumberInputStepper>
                                            <NumberIncrementStepper />
                                            <NumberDecrementStepper />
                                        </NumberInputStepper>
                                    </NumberInput>
                                    <chakra.div px={2}>Days</chakra.div>
                                </Flex>
                                <FormErrorMessage>{formikProps.errors.lockDuration}</FormErrorMessage>
                            </FormControl>

                            <FormControl mt={4} isInvalid={!!formikProps.errors.expirationDuration && !!formikProps.touched.expirationDuration}>
                                <FormLabel alignItems={'baseline'}>Expiration duration
                                    <Tooltip hasArrow label={'TODO explanation'}><QuestionIcon mb={1} ml={1} /></Tooltip>
                                </FormLabel>
                                <Flex alignItems={'center'}>
                                    <NumberInput flex="1" name="expirationDuration" value={formikProps.values.expirationDuration / (60*60*24)} min={30} max={365} onBlur={formikProps.handleBlur} onChange={(_: string, val: number) =>
                                        formikProps.setFieldValue('expirationDuration', val*60*60*24)
                                    }>
                                        <NumberInputField/>
                                        <NumberInputStepper>
                                            <NumberIncrementStepper />
                                            <NumberDecrementStepper />
                                        </NumberInputStepper>
                                    </NumberInput>
                                    <chakra.div px={2}>Days</chakra.div>
                                </Flex>
                                <FormErrorMessage>{formikProps.errors.expirationDuration}</FormErrorMessage>
                            </FormControl>

                            <FormControl mt={4} isInvalid={!!formikProps.errors.totalDistributeAmount && !!formikProps.touched.totalDistributeAmount}>
                                <FormLabel alignItems={'baseline'}>Total distribute amount
                                    <Tooltip hasArrow label={'TODO explanation'}><QuestionIcon mb={1} ml={1} /></Tooltip>
                                </FormLabel>
                                <Flex alignItems={'center'}>
                                    <NumberInput flex="1" name="totalDistributeAmount" value={formikProps.values.totalDistributeAmount} min={1} max={Number.MAX_SAFE_INTEGER} onBlur={formikProps.handleBlur} onChange={(_: string, val: number) =>
                                        formikProps.setFieldValue('totalDistributeAmount', val)
                                    }>
                                        <NumberInputField/>
                                        <NumberInputStepper>
                                            <NumberIncrementStepper />
                                            <NumberDecrementStepper />
                                        </NumberInputStepper>
                                    </NumberInput>
                                    <chakra.div px={2} minW={'3rem'}>{tokenData.symbol}</chakra.div>
                                </Flex>
                                <FormErrorMessage>{formikProps.errors.totalDistributeAmount}</FormErrorMessage>
                            </FormControl>

                            <FormControl mt={4} isInvalid={!!formikProps.errors.minimalProvideAmount && !!formikProps.touched.minimalProvideAmount}>
                                <FormLabel alignItems={'baseline'}>Minimum provide amount
                                    <Tooltip hasArrow label={'TODO explanation'}><QuestionIcon mb={1} ml={1} /></Tooltip>
                                </FormLabel>
                                <Flex alignItems={'center'}>
                                    <NumberInput flex="1" name="minimalProvideAmount" value={formikProps.values.minimalProvideAmount} precision={2} min={0} max={10000000} onBlur={formikProps.handleBlur} onChange={(_: string, val: number) =>
                                        formikProps.setFieldValue('minimalProvideAmount', val)
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

                            <FormControl mt={4} isInvalid={!!formikProps.errors.feeRatePerMil && !!formikProps.touched.feeRatePerMil}>
                                <FormLabel alignItems={'baseline'}>feeRatePerMil
                                    <Tooltip hasArrow label={'TODO explanation'}><QuestionIcon mb={1} ml={1} /></Tooltip>
                                </FormLabel>
                                <Slider mt={'4'} name="feeRatePerMil" value={formikProps.values.feeRatePerMil} defaultValue={1} min={1} max={100} step={1} onBlur={formikProps.handleBlur} onChange={(val: number) =>
                                    formikProps.setFieldValue('feeRatePerMil', val)
                                }>
                                    <SliderMark value={25}>
                                        25%
                                    </SliderMark>
                                    <SliderMark value={50}>
                                        50%
                                    </SliderMark>
                                    <SliderMark value={75}>
                                        75%
                                    </SliderMark>
                                    <SliderMark
                                        value={formikProps.values.feeRatePerMil}
                                        textAlign='center'
                                        bg='blue.500'
                                        color='white'
                                        mt='-7'
                                        ml='-4'
                                        w='12'
                                        borderRadius={6}
                                        fontSize={'sm'}
                                        >
                                        {formikProps.values.feeRatePerMil}%
                                    </SliderMark>
                                    <SliderTrack>
                                        {/* <Box position='relative' right={10} /> */}
                                        <SliderFilledTrack />
                                    </SliderTrack>
                                    <SliderThumb boxSize={4} />
                                </Slider>
                                <FormErrorMessage>{formikProps.errors.feeRatePerMil}</FormErrorMessage>
                            </FormControl>

                            {
                                approvals.readFn.data && approvals.readFn.data.toString() !== '0' ?
                                <Button mt={8} 
                                    type="submit" 
                                    w={'full'} 
                                    variant="solid" 
                                    colorScheme='green'
                                    isLoading={writeFn.isLoading}
                                >
                                    Deploy Token Contract
                                </Button> :
                                <Button mt={8} 
                                    w={'full'} 
                                    variant="solid" 
                                    colorScheme='blue'
                                    onClick={approvals.writeFn.write}
                                    isLoading={approvals.writeFn.isLoading}
                                >
                                    Approve token
                                </Button>
                            }
                            
                        </form>
                    </div>
                </ModalBody>
            </ModalContent>
        </Modal>
        </CustomProvider>
    )
  }