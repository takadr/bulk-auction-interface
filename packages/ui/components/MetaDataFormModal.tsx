import { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { useToast, useColorMode } from "@chakra-ui/react";
import { useAccount } from "wagmi";
import { CustomProvider } from "rsuite";
import MetaDataForm from "./templates/SaleTemplateV1/MetaDataForm";
import useMetaDataForm from "../hooks/SaleTemplateV1/useMetaDataForm";
import { MetaData } from "lib/types/Sale";

export default function MetaDataFormModal({
  isOpen,
  onClose,
  existingContractAddress,
  saleMetaData,
  minRaisedAmount,
  onSubmitSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  existingContractAddress?: `0x${string}`;
  saleMetaData?: MetaData;
  minRaisedAmount: number;
  onSubmitSuccess?: () => void;
}) {
  const { address } = useAccount();
  const toast = useToast({ position: "top-right", isClosable: true });
  const { colorMode, setColorMode, toggleColorMode } = useColorMode();
  const [step, setStep] = useState<1 | 2>(1);
  const [contractAddress, setContractAddress] = useState<
    `0x${string}` | undefined
  >(existingContractAddress ? existingContractAddress : undefined);

  const handleClose = () => {
    onClose();
  };

  const { formikProps } = useMetaDataForm({
    contractId: contractAddress,
    minRaisedAmount: minRaisedAmount,
    saleMetaData,
    onSubmitSuccess: (response) => {
      onSubmitSuccess && onSubmitSuccess();
      handleClose();
      toast({
        title: `Sale information successfully saved!`,
        status: "success",
        duration: 5000,
      });
    },
    onSubmitError: (e: any) => {
      toast({
        description: e.message,
        status: "error",
        duration: 5000,
      });
    },
  });

  return (
    <CustomProvider theme={colorMode}>
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        closeOnOverlayClick={false}
        size={"4xl"}
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
  );
}
