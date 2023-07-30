import { ButtonProps, Button, useToast } from "@chakra-ui/react";
import { KeyedMutator } from "swr";
import useClaim from "../../../hooks/useClaim";
import TxSentToast from "../../TxSentToast";
import { useLocale } from "../../../hooks/useLocale";
import { Sale } from "lib/types/Sale";
import { getExpectedAmount } from "lib/utils";
import Big from "lib/utils/bignumber";
import { ApolloQueryResult } from "@apollo/client/core/types";

interface Props {
  sale: Sale;
  address: `0x${string}`;
  myContribution: Big;
  isClaimed: boolean;
  mutateIsClaimed: () => Promise<ApolloQueryResult<any>>;
}
export default function ClaimButton({
  sale,
  address,
  myContribution,
  isClaimed,
  mutateIsClaimed,
  ...buttonProps
}: Props & ButtonProps) {
  const {
    prepareFn: claimPrepareFn,
    writeFn: claimWriteFn,
    waitFn: claimWaitFn,
  } = useClaim({
    targetAddress: sale.id as `0x${string}`,
    address,
    onSuccessWrite: (data) => {
      toast({
        title: "Transaction sent!",
        status: "success",
        duration: 5000,
        render: (props) => <TxSentToast txid={data?.hash} {...props} />,
      });
    },
    onSuccessConfirm: (data) => {
      toast({
        title: `Transaction confirmed!`,
        status: "success",
        duration: 5000,
      });
      mutateIsClaimed();
    },
  });
  const expectedAmount = getExpectedAmount(
    myContribution,
    Big(0),
    sale.totalRaised,
    sale.allocatedAmount
  );
  const toast = useToast({ position: "top-right", isClosable: true });
  const { t } = useLocale();
  return (
    <Button
      variant={"solid"}
      isDisabled={isClaimed || !claimWriteFn.writeAsync}
      isLoading={claimWriteFn?.isLoading || claimWaitFn?.isLoading}
      {...buttonProps}
      onClick={async () => {
        await claimWriteFn.writeAsync();
      }}
    >
      {isClaimed
        ? t("CLAIMED")
        : expectedAmount.eq(0) && myContribution.gt(0)
        ? t("CLAIM_REFUND")
        : t("CLAIM")}
    </Button>
  );
}
