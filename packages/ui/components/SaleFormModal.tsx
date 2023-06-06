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
import { CustomProvider } from 'rsuite';
import { useAtom } from 'jotai';
import { waitingTransactionAtom } from 'lib/store';
import FactoryABI from 'lib/constants/abis/Factory.json';
import { Steps } from './Steps';
import BulksaleV1Form from './templates/BulksaleV1/ContractForm';
import useBulksaleV1Form from '../hooks/BulksaleV1/useBulksaleV1Form';
import MetaDataForm from './templates/BulksaleV1/MetaDataForm';
import useBulksaleV1MetaForm from '../hooks/BulksaleV1/useBulksaleV1MetaForm';
import TxSentToast from './TxSentToast';

export default function SaleFormModal({isOpen, onClose, onSubmitSuccess}: {isOpen: boolean, onClose: () => void, onSubmitSuccess?: () => void}) {
    const { address } = useAccount();
    const toast = useToast({position: 'top-right', isClosable: true,});
    const [waitingTransaction, setWaitingTransaction] = useAtom(waitingTransactionAtom);
    const { colorMode, setColorMode, toggleColorMode } = useColorMode();
    const [step, setStep] = useState<1|2>(1);
    const [contractAddress, setContractAddress] = useState<`0x${string}`|undefined>(undefined);

    const { formikProps, approvals, prepareFn, writeFn, waitFn, tokenData, balance } = useBulksaleV1Form({
        address: address as `0x${string}`,
        onSubmitSuccess: (result) => {
            setWaitingTransaction(result.hash);
            setStep(2);
            onSubmitSuccess && onSubmitSuccess();
            toast({
                title: 'Transaction sent!',
                status: 'success',
                duration: 5000,
                render: (props) => <TxSentToast txid={result.hash} {...props} />
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
                title: `Transaction confirmed!`,
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
        },
        onApprovalTxSent: (result: any) => {
            toast({
                title: 'Transaction sent!',
                status: 'success',
                duration: 5000,
                render: (props) => <TxSentToast txid={result.hash} {...props} />
            })
        },
        onApprovalTxConfirmed: (result: any) => {
            toast({
                title: `Approval confirmed!`,
                status: 'success',
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
        minimumProvided: formikProps.values.minimalProvideAmount,
        onSubmitSuccess: (response) => {
            handleClose();
            onSubmitSuccess && onSubmitSuccess();
            toast({
                title: `Sale information successfully saved!`,
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
            if((owner as string).toLowerCase() === (address as string).toLowerCase() && (tokenAddr as string).toLowerCase() === (formikProps.values.token as string).toLowerCase()) {
                setContractAddress(deployedAddr as `0x${string}`);
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
                    <Steps mx={'auto'} maxW={'450px'} pb={6} px={10} stepParams={stepParams} currentStep={step} />
                    {
                        step === 1 ? <BulksaleV1Form 
                            formikProps={formikProps} 
                            address={address as `0x${string}`}
                            approvals={approvals}
                            writeFn={writeFn}
                            tokenData={tokenData}
                            balance={balance}
                        /> :
                        <MetaDataForm formikProps={metaFormikProps} waitFn={waitFn} onSkip={handleClose} />
                    }
                    
                </ModalBody>
            </ModalContent>
        </Modal>
        </CustomProvider>
    )
  }