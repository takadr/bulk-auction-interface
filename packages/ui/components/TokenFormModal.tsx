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
import { Button, Tooltip, useToast } from '@chakra-ui/react';
import { QuestionIcon } from '@chakra-ui/icons';
import { Field, Form, Formik, useFormik, FieldProps } from 'formik';
import { useProvider, useNetwork, useAccount, useContract, usePrepareContractWrite, useContractWrite, useWaitForTransaction, erc20ABI } from 'wagmi';
import { useDebounce } from 'use-debounce';
import { BigNumber, constants, utils } from 'ethers';

export default function TokenFormModal({isOpen, onClose}: {isOpen: boolean, onClose: () => void}) {
    interface Token {
        name: string;
        symbol: string;
        initialSupply: number;
        owner?: `0x${string}`;
    }
    const MAX_LENGTH = 20; // TODO
    const factoryABI = [
        {
            name: 'deployTokenClone',
            type: 'function',
            stateMutability: 'nonpayable',
            inputs: [
            {
                "internalType": "string",
                "name": "templateName",
                "type": "string"
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
    ]
   
    const validate = (values: Token) => {
        const errors: any = {};
      
        if (!values.name) {
            errors.name = 'Name is required';
        } else if (values.name.length > MAX_LENGTH) {
            errors.name = `Name must be shorter than ${MAX_LENGTH}`;
        }

        if (!values.symbol) {
            errors.symbol = 'Symbol is required';
        } else if (values.symbol.length > MAX_LENGTH) {
            errors.symbol = `Symbol must be shorter than ${MAX_LENGTH}`;
        }

        // TODO
        // if (!values.initialSupply) {
        //     errors.initialSupply = 'Initial supply is required';
        // } else if (values.initialSupply) {
        //     errors.initialSupply = `Initial supply must be shorter than ${MAX_LENGTH}`;
        // }
      
        return errors;
    };

    const handleClose = () => {
        formikProps.setValues({name: '', symbol: '', initialSupply: 21000000, owner: undefined});
        formikProps.setTouched({name: false, symbol: false, initialSupply: false, owner: false});
        onClose();
    }
    
    const handleSubmit = async (token: Token) => {
        if(!writeFn || !writeFn.writeAsync) {
            // TODO Error
            return;
        }
        try {
            const result = await writeFn.writeAsync();
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

    const { chain } = useNetwork();
    const { address } = useAccount();
    const toast = useToast({position: 'top-right', isClosable: true,})
    const formikProps = useFormik({
        enableReinitialize: true,
        initialValues: {name: '', symbol: '', initialSupply: 21000000, owner: undefined},
        onSubmit: handleSubmit,
        validate
    });
    const [debouncedToken] = useDebounce(formikProps.values, 500);
    const abi = new utils.AbiCoder();

    const prepareFn = usePrepareContractWrite({
        address: process.env.NEXT_PUBLIC_FACTORY_ADDRESS as `0x${string}`, //factory
        abi: factoryABI,
        functionName: 'deployTokenClone',
        args: [
            "OwnableToken.0.sol",
            utils.hexlify(abi.encode(
                ['uint', 'string', 'string', 'address'],
                [utils.parseEther(String(debouncedToken.initialSupply)), debouncedToken.name, debouncedToken.symbol, address as `0x${string}`]
            )) as `0x${string}`,
        ],
    })
    
    const writeFn = useContractWrite({
        ...prepareFn.config,
        onError(e: Error) {
            // TODO
        },
        onSuccess(data) {
            console.log('Approved!', data)
            // TODO
            // Modify tx status in the store
        }
    })
    // TODO 
    // Add tx hash with status loading to the store

    const waitFn = useWaitForTransaction({
        chainId: chain?.id,
        hash: writeFn.data?.hash,
        // wait: writeFn.data?.wait
        onSuccess(data) {
            console.log('Success!', data)
            // TODO
            // Modify tx status to confirmed in the store
        }
    })

    return (
        <Modal
        isOpen={isOpen}
        onClose={handleClose}
        closeOnOverlayClick={false}
    >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Create new token</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                    <div>
                        <form onSubmit={formikProps.handleSubmit}>
                            <FormControl isInvalid={!!formikProps.errors.name && !!formikProps.touched.name}>
                                <FormLabel htmlFor='name' alignItems={'baseline'}>Name
                                    <Tooltip hasArrow label={'TODO explanation'}><QuestionIcon mb={1} ml={1} /></Tooltip>
                                </FormLabel>
                                <Input id="name" name="name" onBlur={formikProps.handleBlur} onChange={formikProps.handleChange} value={formikProps.values.name} placeholder='e.g.) DFGC Governance Token' />
                                <FormErrorMessage>{formikProps.errors.name}</FormErrorMessage>
                            </FormControl>

                            <FormControl mt={4} isInvalid={!!formikProps.errors.symbol && !!formikProps.touched.symbol}>
                                <FormLabel alignItems={'baseline'}>Symbol
                                    <Tooltip hasArrow label={'TODO explanation'}><QuestionIcon mb={1} ml={1} /></Tooltip>
                                </FormLabel>
                                <Input name="symbol" onBlur={formikProps.handleBlur} onChange={formikProps.handleChange} value={formikProps.values.symbol} placeholder='e.g.) DGT' />
                                <FormErrorMessage>{formikProps.errors.symbol}</FormErrorMessage>
                            </FormControl>

                            <FormControl mt={4} isInvalid={!!formikProps.errors.initialSupply && !!formikProps.touched.initialSupply}>
                                <FormLabel alignItems={'baseline'}>Initial Supply
                                    <Tooltip hasArrow label={'TODO explanation'}><QuestionIcon mb={1} ml={1} /></Tooltip>
                                </FormLabel>
                                <NumberInput name="initialSupply" value={formikProps.values.initialSupply} min={1} max={115792089237316195423570985008687907853269984665640564039456} onBlur={formikProps.handleBlur} onChange={(_: string, val: number) =>
                                    formikProps.setFieldValue('initialSupply', val)
                                }>
                                    <NumberInputField/>
                                    <NumberInputStepper>
                                        <NumberIncrementStepper />
                                        <NumberDecrementStepper />
                                    </NumberInputStepper>
                                </NumberInput>
                                <FormErrorMessage>{formikProps.errors.initialSupply}</FormErrorMessage>
                            </FormControl>

                            <Button mt={8} 
                                type="submit" 
                                w={'full'} 
                                variant="solid" 
                                colorScheme='green'
                                isLoading={writeFn.isLoading}
                            >
                                Deploy Token Contract
                            </Button>
                        </form>
                    </div>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
  }

// {writeFn.isLoading && <p>Loading...</p>}
// {writeFn.isSuccess && <p>Tx submitted!</p>}
// {waitFn.isSuccess && <p>Approved!</p>}