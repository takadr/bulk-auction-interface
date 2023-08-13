import { useEffect, useRef, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { useToast, useColorMode } from "@chakra-ui/react";
import { useAccount, useContractEvent } from "wagmi";
import { CustomProvider } from "rsuite";
import FactoryABI from "lib/constants/abis/Factory.json";
import { Steps } from "./Steps";
import AuctionForm from "./templates/TemplateV1/AuctionForm";
import useAuctionForm from "../hooks/TemplateV1/useAuctionForm";
import MetaDataForm from "./templates/TemplateV1/MetaDataForm";
import useMetaDataForm from "../hooks/TemplateV1/useMetaDataForm";
import { useLocale } from "../hooks/useLocale";
import TxSentToast from "./TxSentToast";

type AuctionFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onDeploy?: () => void;
  onDeployConfirmed?: () => void;
  onInformationSaved?: () => void;
  onInformationCanceled?: () => void;
};

export default function AuctionFormModal({
  isOpen,
  onClose,
  onDeploy,
  onDeployConfirmed,
  onInformationSaved,
  onInformationCanceled,
}: AuctionFormModalProps) {
  const { address } = useAccount();
  const toast = useToast({ position: "top-right", isClosable: true });
  const { colorMode, setColorMode, toggleColorMode } = useColorMode();
  const [step, setStep] = useState<1 | 2>(1);
  const [contractAddress, setContractAddress] = useState<
    `0x${string}` | undefined
  >(undefined);
  const { t } = useLocale();
  const [tx, setTx] = useState<string | undefined>(undefined);
  const txRef = useRef(tx);
  useEffect(() => {
    txRef.current = tx;
  }, [tx]);

  const {
    formikProps,
    approvals,
    prepareFn,
    writeFn,
    waitFn,
    tokenData,
    balance,
  } = useAuctionForm({
    address: address as `0x${string}`,
    onSubmitSuccess: (result) => {
      setTx(result.hash);
      setStep(2);
      onDeploy && onDeploy();
      toast({
        title: t("TRANSACTION_SENT"),
        status: "success",
        duration: 5000,
        render: (props) => <TxSentToast txid={result.hash} {...props} />,
      });
    },
    onSubmitError: (e: any) => {
      toast({
        description: e.message,
        status: "error",
        duration: 5000,
      });
    },
    onWaitForTransactionSuccess: (result: any) => {
      onDeployConfirmed && onDeployConfirmed();
      toast({
        title: t("TRANSACTION_CONFIRMED"),
        status: "success",
        duration: 5000,
      });
    },
    onWaitForTransactionError: (e: Error) => {
      toast({
        description: e.message,
        status: "error",
        duration: 5000,
      });
    },
    onApprovalTxSent: (result: any) => {
      toast({
        title: t("TRANSACTION_SENT"),
        status: "success",
        duration: 5000,
        render: (props) => <TxSentToast txid={result.hash} {...props} />,
      });
    },
    onApprovalTxConfirmed: (result: any) => {
      toast({
        title: t("APPROVAL_CONFIRMED"),
        status: "success",
        duration: 5000,
      });
    },
  });

  const handleClose = () => {
    formikProps.resetForm();
    metaFormikProps.resetForm();
    onClose();
    setStep(1);
  };

  const { formikProps: metaFormikProps } = useMetaDataForm({
    contractId: contractAddress,
    minRaisedAmount: formikProps.values.minRaisedAmount,
    onSubmitSuccess: (response) => {
      handleClose();
      onInformationSaved && onInformationSaved();
      toast({
        title: t("SALE_INFORMATION_SUCCESSFULLY_SAVED"),
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

  const unwatch = useContractEvent({
    address: process.env.NEXT_PUBLIC_FACTORY_ADDRESS as `0x${string}`,
    abi: FactoryABI,
    eventName: "Deployed",
    listener: (logs: any[]) => {
      const { args, transactionHash } = logs[0];
      if (
        (transactionHash as string).toLowerCase() ===
        (txRef.current as string).toLowerCase()
      ) {
        unwatch && unwatch();
        setContractAddress(args.deployedAddress as `0x${string}`);
        setTx(undefined);
      }
    },
  });

  const stepParams = [
    { number: 1, label: t("DEPLOY_CONTRACT") },
    { number: 2, label: t("INPUT_INFORMATION") },
  ];

  return (
    <CustomProvider theme={colorMode}>
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        closeOnOverlayClick={false}
        size={step === 1 ? "lg" : "4xl"}
        blockScrollOnMount={false}
        isCentered={true}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t("CREATE_NEW_SALE")}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Steps
              mx={"auto"}
              maxW={"450px"}
              pb={6}
              px={10}
              stepParams={stepParams}
              currentStep={step}
            />
            {step === 1 ? (
              <AuctionForm
                formikProps={formikProps}
                address={address as `0x${string}`}
                approvals={approvals}
                writeFn={writeFn}
                tokenData={tokenData}
                balance={balance}
              />
            ) : (
              <MetaDataForm
                formikProps={metaFormikProps}
                waitFn={waitFn}
                onSkip={() => {
                  onInformationCanceled && onInformationCanceled();
                  handleClose();
                }}
              />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </CustomProvider>
  );
}
