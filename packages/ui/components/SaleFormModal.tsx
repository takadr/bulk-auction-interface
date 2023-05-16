import { useState } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
} from '@chakra-ui/react';
import { Button, useToast, Flex, chakra, useColorMode } from '@chakra-ui/react';
import { useAccount, useContractEvent } from 'wagmi';
import { useDebounce } from 'use-debounce';
import { CustomProvider } from 'rsuite';
import { useAtom } from 'jotai';
import { saleTxAtom, saleClonesAtom, waitingTransactionAtom } from '../store';
import FactoryABI from '../constants/abis/Factory.json';
import { Steps } from './Steps';
import BulksaleV1Form from './templates/BulksaleV1/ContractForm';
import useBulksaleV1Form from '../hooks/BulksaleV1/useBulksaleV1Form';
import MetaDataForm from './templates/BulksaleV1/MetaDataForm';
import useBulksaleV1MetaForm from '../hooks/BulksaleV1/useBulksaleV1MetaForm';

export default function SaleFormModal({isOpen, onClose}: {isOpen: boolean, onClose: () => void}) {
    const { address } = useAccount();
    const toast = useToast({position: 'top-right', isClosable: true,});
    const [saleTxs, setSaleTxs] = useAtom(saleTxAtom);
    const [saleClones, setSaleClones] = useAtom(saleClonesAtom);
    const [waitingTransaction, setWaitingTransaction] = useAtom(waitingTransactionAtom);
    const { colorMode, setColorMode, toggleColorMode } = useColorMode();
    const [step, setStep] = useState<1|2>(1);
    const [contractAddress, setContractAddress] = useState<`0x${string}`|undefined>(undefined);

    // TODO pass template name to the abstracted hook of this one so that we get template specific information
    const { formikProps, approvals, prepareFn, writeFn, waitFn, tokenData } = useBulksaleV1Form({
        address: address as `0x${string}`,
        onSubmitSuccess: (result) => {
            setWaitingTransaction(result.hash);
            setStep(2);
            toast({
                description: `Transaction sent! ${result.hash}`,
                status: 'success',
                duration: 5000,
            })
        },
        onSubmitError: (e: any) => {
            toast({
                description: e.message,
                status: 'error',
                duration: 5000,
            })
        },
        onWaitForTransactionSuccess: (result: any) => {
            toast({
                description: `Transaction confirmed!`,
                status: 'success',
                duration: 5000,
            })
        },
        onWaitForTransactionError: (e: Error) => {
            toast({
                description: e.message,
                status: 'error',
                duration: 5000,
            })
        }
    });

    const handleClose = () => {
        formikProps.resetForm();
        metaFormikProps.resetForm();
        onClose();
        setStep(1);
    }

    const { formikProps: metaFormikProps } = useBulksaleV1MetaForm({
        contractId: contractAddress,
        onSubmitSuccess: (response) => {
            handleClose();
            toast({
                description: `Auction information successfully saved!`,
                status: 'success',
                duration: 5000,
            })
        },
        onSubmitError: (e: any) => {
            toast({
                description: e.message,
                status: 'error',
                duration: 5000,
            })
        },
    });

    useContractEvent({
        address: process.env.NEXT_PUBLIC_FACTORY_ADDRESS as `0x${string}`,
        abi: FactoryABI,
        eventName: 'Deployed',
        listener(templateName, deployedAddr, tokenAddr, owner) {
            console.log(owner, templateName, deployedAddr);
            const template: any = templateName;
            
            if(owner === address) {
                // const newAddresses = [...saleClones.addresses, deployedAddr];
                // setSaleClones(Object.assign(saleClones, {addresses: newAddresses}));
                // const newAddresses = [...saleClones, deployedAddr];
                // setSaleClones(newAddresses);
                setContractAddress(deployedAddr);
                // console.log(newAddresses)
            }
        },
    })

    const stepParams = [
        {number: 1, label: 'Deploy Contract'},
        {number: 2, label: 'Input Information'},
    ]

    return (
        <CustomProvider theme={colorMode}>
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            closeOnOverlayClick={false}
            size={step === 1 ? 'lg' : '4xl'}
        >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Create new sale</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                    {/* {approvals.readFn.data && console.log(approvals.readFn.data.toString())} */}
                    {/* {approvals.readFn && approvals.readFn.data} */}
                    {/* { console.log(saleTxs) } */}
                    <Steps pb={6} px={10} stepParams={stepParams} currentStep={step} />
                    {
                        // TODO
                        // Switch form by the selected auction template
                    }
                    {
                        step === 1 ? <BulksaleV1Form 
                            formikProps={formikProps} 
                            address={address as `0x${string}`}
                            approvals={approvals}
                            writeFn={writeFn}
                            tokenData={tokenData}
                        /> :
                        <MetaDataForm formikProps={metaFormikProps} waitFn={waitFn} onSkip={handleClose} />
                    }
                    
                </ModalBody>
            </ModalContent>
        </Modal>
        </CustomProvider>
    )
  }