import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
  erc20ABI,
  useContractRead,
  useToken,
} from "wagmi";
import { isAddress } from "viem";
import { AbiCoder } from "ethers";
import { useDebounce } from "use-debounce";
import { useFormik, FormikProps } from "formik";
import useApprove from "../useApprove";
import { AuctionForm } from "lib/types/Auction";
import Big, { multiply } from "lib/utils/bignumber";
import FactoryABI from "lib/constants/abis/Factory.json";
import { TEMPLATE_V1_NAME } from "lib/constants/templates";
import "rsuite/dist/rsuite-no-reset.min.css";
import "assets/css/rsuite-override.css";

const now = new Date().getTime();
export default function useAuctionForm({
  address,
  onSubmitSuccess,
  onSubmitError,
  onContractWriteSuccess,
  onContractWriteError,
  onWaitForTransactionSuccess,
  onWaitForTransactionError,
  onApprovalTxSent,
  onApprovalTxConfirmed,
}: {
  address: `0x${string}`;
  onSubmitSuccess?: (result: any) => void;
  onSubmitError?: (e: any) => void;
  onContractWriteSuccess?: (result: any) => void;
  onContractWriteError?: (e: any) => void;
  onWaitForTransactionSuccess?: (result: any) => void;
  onWaitForTransactionError?: (e: any) => void;
  onApprovalTxSent?: (result: any) => void;
  onApprovalTxConfirmed?: (result: any) => void;
}): {
  formikProps: FormikProps<AuctionForm>;
  approvals: ReturnType<typeof useApprove>;
  prepareFn: any;
  writeFn: ReturnType<typeof useContractWrite>;
  waitFn: ReturnType<typeof useWaitForTransaction>;
  tokenData: any;
  balance: bigint | undefined;
} {
  const emptyAuction: AuctionForm = {
    templateName: TEMPLATE_V1_NAME,
    token: null,
    startingAt: now + 60 * 60 * 24 * 7 * 1000,
    eventDuration: 60 * 60 * 24 * 7,
    allocatedAmount: 1,
    minRaisedAmount: 0,
    owner: address,
  };

  const getArgs = (): string => {
    try {
      return AbiCoder.defaultAbiCoder().encode(
        ["address", "uint256", "uint256", "address", "uint256", "uint256"],
        [
          debouncedAuction.owner,
          Math.round(debouncedAuction.startingAt / 1000),
          debouncedAuction.eventDuration,
          debouncedAuction.token,
          multiply(
            debouncedAuction.allocatedAmount,
            tokenData?.decimals ? Big(10).pow(tokenData.decimals) : 1,
          ).toString(),
          multiply(
            debouncedAuction.minRaisedAmount,
            Big(10).pow(18),
          ).toString(),
        ],
      );
    } catch (e) {
      return "";
    }
  };

  const validate = (values: AuctionForm) => {
    const errors: any = {};

    if (!values.templateName) {
      errors.templateName = "Template is required";
    }

    if (!values.token) {
      errors.token = "Token is required";
    } else if (!tokenData && tokenFetched) {
      errors.token = `Invalid token address`;
    }

    if (values.startingAt <= new Date().getTime()) {
      errors.startingAt = `Start date must be in the future`;
    }

    if (values.eventDuration < 60 * 60 * 24) {
      errors.eventDuration = `Auction duration must be more than or equal to 1 day`;
    }

    if (values.eventDuration > 60 * 60 * 24 * 30) {
      errors.eventDuration = `Auction duration must be less than or equal to 30 days`;
    }

    if (
      balance &&
      tokenData &&
      Big(balance.toString()).lt(
        Big(formikProps.values.allocatedAmount).mul(
          Big(10).pow(tokenData.decimals),
        ),
      )
    ) {
      errors.allocatedAmount = `You need to have enough balance for allocation`;
    }

    if (
      tokenData &&
      !!multiply(
        formikProps.values.allocatedAmount,
        Big(10).pow(tokenData.decimals),
      ).lt(Big(10).pow(6))
    ) {
      errors.allocatedAmount = `The allocation is too small, and some participants may not be
      able to complete their claims. Unclaimed tokens cannot be
      withdrawn by you either. Please consider increasing the
      allocation amount.`;
    }

    return errors;
  };

  const handleSubmit = async (auction: AuctionForm) => {
    try {
      const result = await writeFn!.writeAsync!();
      onSubmitSuccess && onSubmitSuccess(result);
    } catch (e: any) {
      onSubmitError && onSubmitError(e);
    }
  };

  const formikProps = useFormik<AuctionForm>({
    enableReinitialize: true,
    initialValues: Object.assign({}, emptyAuction),
    onSubmit: handleSubmit,
    validate,
  });

  const [debouncedAuction] = useDebounce(formikProps.values, 500);
  const { data: balance } = useContractRead({
    address: debouncedAuction.token as `0x${string}`,
    abi: erc20ABI,
    functionName: "balanceOf",
    args: [address],
    watch: true,
    enabled: !!debouncedAuction.token && isAddress(debouncedAuction.token),
  });

  const {
    data: tokenData,
    isLoading: tokenLoading,
    isFetched: tokenFetched,
  } = useToken({
    address: debouncedAuction.token as `0x${string}`,
    enabled: !!debouncedAuction.token && isAddress(debouncedAuction.token),
  });

  const prepareFn = usePrepareContractWrite({
    address: process.env.NEXT_PUBLIC_FACTORY_ADDRESS as `0x${string}`, //factory
    abi: FactoryABI,
    functionName: "deployAuction",
    args: [
      debouncedAuction.templateName, //TEMPLATE_V1_NAME
      getArgs(),
    ],
    enabled: !!debouncedAuction.token && isAddress(debouncedAuction.token),
  });

  const writeFn = useContractWrite({
    ...prepareFn.config,
    onSuccess(data) {
      onContractWriteSuccess && onContractWriteSuccess(data);
    },
    onError(e: Error) {
      console.log(e.message);
      onContractWriteError && onContractWriteError(e);
    },
  });

  const waitFn = useWaitForTransaction({
    hash: writeFn.data?.hash,
    onSuccess(data) {
      onWaitForTransactionSuccess && onWaitForTransactionSuccess(data);
    },
    onError(e: Error) {
      console.log(e.message);
      onWaitForTransactionError && onWaitForTransactionError(e);
    },
  });

  const approvals = useApprove({
    targetAddress: debouncedAuction.token,
    owner: address as `0x${string}`,
    spender: process.env.NEXT_PUBLIC_FACTORY_ADDRESS as `0x${string}`,
    onSuccessWrite(data) {
      onApprovalTxSent && onApprovalTxSent(data);
    },
    onSuccessConfirm(data) {
      onApprovalTxConfirmed && onApprovalTxConfirmed(data);
      prepareFn.refetch();
    },
    enabled: !!debouncedAuction.token && isAddress(debouncedAuction.token),
  });

  return {
    formikProps,
    approvals,
    prepareFn,
    writeFn,
    waitFn,
    tokenData,
    balance,
  };
}
