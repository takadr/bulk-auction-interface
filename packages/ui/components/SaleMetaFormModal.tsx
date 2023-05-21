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
import { useAccount } from 'wagmi';
import { CustomProvider } from 'rsuite';
import MetaDataForm from './templates/BulksaleV1/MetaDataForm';
import useBulksaleV1MetaForm from '../hooks/BulksaleV1/useBulksaleV1MetaForm';
import { MetaData } from '../types/BulksaleV1';

export default function SaleMetaFormModal({isOpen, onClose, existingContractAddress, saleMetaData, minimumProvided, onSubmitSuccess}: {isOpen: boolean, onClose: () => void, onSuccess?: () => void, existingContractAddress?: `0x${string}`, saleMetaData?: MetaData, minimumProvided: number, onSubmitSuccess?: () => void}) {
    const { address } = useAccount();
    const toast = useToast({position: 'top-right', isClosable: true,});
    const { colorMode, setColorMode, toggleColorMode } = useColorMode();
    const [step, setStep] = useState<1|2>(1);
    const [contractAddress, setContractAddress] = useState<`0x${string}`|undefined>(existingContractAddress ? existingContractAddress : undefined);

    const handleClose = () => {
        onClose();
    }

    const { formikProps } = useBulksaleV1MetaForm({
        contractId: contractAddress,
        minimumProvided: minimumProvided,
        saleMetaData,
        onSubmitSuccess: (response) => {
            onSubmitSuccess && onSubmitSuccess();
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

    return (
        <CustomProvider theme={colorMode}>
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            closeOnOverlayClick={false}
            size={'4xl'}
        >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Update sale information</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                    <MetaDataForm formikProps={formikProps} />
                </ModalBody>
            </ModalContent>
        </Modal>
        </CustomProvider>
    )
  }