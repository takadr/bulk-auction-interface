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

export default function SaleFormModal({isOpen, onClose}: {isOpen: boolean, onClose: () => void}) {
    const { address } = useAccount();
    const toast = useToast({position: 'top-right', isClosable: true,});
    const [saleTxs, setSaleTxs] = useAtom(saleTxAtom);
    const [saleClones, setSaleClones] = useAtom(saleClonesAtom);
    const [waitingTransaction, setWaitingTransaction] = useAtom(waitingTransactionAtom);
    const { colorMode, setColorMode, toggleColorMode } = useColorMode();
    const [step, setStep] = useState<1|2>(1);

    // TODO pass template name to the abstracted hook of this one so that we get template specific information
    const { formikProps, approvals, prepareFn, writeFn, tokenData } = useBulksaleV1Form({
        address: address as `0x${string}`,
        onSubmit: (result) => {
            setWaitingTransaction(result.hash);
            handleClose();
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
        }
    });

    const handleClose = () => {
        formikProps.resetForm();
        onClose();
    }

    useContractEvent({
        address: process.env.NEXT_PUBLIC_FACTORY_ADDRESS as `0x${string}`,
        abi: FactoryABI,
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
                        <chakra.div>
                        <Steps pb={6} stepParams={stepParams} currentStep={step} />
                        </chakra.div>
                        {
                            // TODO
                            // Switch form by the selected auction template
                        }
                        <BulksaleV1Form 
                            formikProps={formikProps} 
                            address={address as `0x${string}`}
                            approvals={approvals}
                            writeFn={writeFn}
                            tokenData={tokenData}
                        />
                    </div>
                </ModalBody>
            </ModalContent>
        </Modal>
        </CustomProvider>
    )
  }