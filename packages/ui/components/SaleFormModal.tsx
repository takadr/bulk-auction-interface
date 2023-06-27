import { useState } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
} from '@chakra-ui/react';
import { useToast, useColorMode } from '@chakra-ui/react';
import { useAccount, useContractEvent } from 'wagmi';
import { CustomProvider } from 'rsuite';
import FactoryABI from 'lib/constants/abis/Factory.json';
import { Steps } from './Steps';
import SaleForm from './templates/SaleTemplateV1/SaleForm';
import useSaleForm from '../hooks/SaleTemplateV1/useSaleForm';
import MetaDataForm from './templates/SaleTemplateV1/MetaDataForm';
import useMetaDataForm from '../hooks/SaleTemplateV1/useMetaDataForm';
import TxSentToast from './TxSentToast';

type SaleFormModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onDeploy?: () => void;
    onDeployConfirmed?: () => void;
    onInformationSaved?: () => void;
    onInformationCanceled?: () => void;
}

export default function SaleFormModal({isOpen, onClose, onDeploy, onDeployConfirmed, onInformationSaved, onInformationCanceled}: SaleFormModalProps) {
    const { address } = useAccount();
    const toast = useToast({position: 'top-right', isClosable: true,});
    const { colorMode, setColorMode, toggleColorMode } = useColorMode();
    const [step, setStep] = useState<1|2>(1);
    const [contractAddress, setContractAddress] = useState<`0x${string}`|undefined>(undefined);

    const { formikProps, approvals, prepareFn, writeFn, waitFn, tokenData, balance } = useSaleForm({
        address: address as `0x${string}`,
        onSubmitSuccess: (result) => {
            setStep(2);
            onDeploy && onDeploy();
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
            onDeployConfirmed && onDeployConfirmed();
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

    const { formikProps: metaFormikProps } = useMetaDataForm({
        contractId: contractAddress,
        minRaisedAmount: formikProps.values.minRaisedAmount,
        onSubmitSuccess: (response) => {
            handleClose();
            onInformationSaved && onInformationSaved();
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
            if(
                formikProps.values.token && 
                (owner as string).toLowerCase() === (address as string).toLowerCase() && 
                (tokenAddr as string).toLowerCase() === (formikProps.values.token as string).toLowerCase()
            ) {
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
            blockScrollOnMount={false}
            isCentered={true}
        >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Create new sale</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                    <Steps mx={'auto'} maxW={'450px'} pb={6} px={10} stepParams={stepParams} currentStep={step} />
                    {
                        step === 1 ? <SaleForm 
                            formikProps={formikProps} 
                            address={address as `0x${string}`}
                            approvals={approvals}
                            writeFn={writeFn}
                            tokenData={tokenData}
                            balance={balance}
                        /> :
                        <MetaDataForm formikProps={metaFormikProps} waitFn={waitFn} onSkip={() => {
                            onInformationCanceled && onInformationCanceled()
                            handleClose()
                        }} />
                    }
                    
                </ModalBody>
            </ModalContent>
        </Modal>
        </CustomProvider>
    )
  }