import { useState } from "react";
import { ButtonProps, Button, useToast } from "@chakra-ui/react";
import { ApolloQueryResult } from "@apollo/client/core/types";
import { TemplateV1 } from "lib/types/Auction";
import { getExpectedAmount } from "lib/utils";
import Big from "lib/utils/bignumber";
import useClaim from "../../../hooks/useClaim";
import TxSentToast from "../../TxSentToast";
import { useLocale } from "../../../hooks/useLocale";

interface Props {
  auction: TemplateV1;
  address: `0x${string}`;
  myContribution: Big;
  isClaimed: boolean;
  mutateIsClaimed: () => Promise<ApolloQueryResult<any>>;
}
export default function ClaimButton({
  auction,
  address,
  myContribution,
  isClaimed,
  mutateIsClaimed,
  ...buttonProps
}: Props & ButtonProps) {
  // Local state to change the claim button state after claim
  const [claimSucceeded, setClaimSucceeded] = useState<boolean>(false);
  // Local state to show that it is waiting for updateed subgraph data after the claim tx is confirmed
  const [waitForSubgraphUpdate, setWaitForSubgraphUpdate] = useState<boolean>(false);

  const {
    prepareFn: claimPrepareFn,
    writeFn: claimWriteFn,
    waitFn: claimWaitFn,
  } = useClaim({
    targetAddress: auction.id as `0x${string}`,
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
      setClaimSucceeded(true);
      setWaitForSubgraphUpdate(true);
      // Wait for 5 sec to make sure that the subgraph data is updated
      setTimeout(() => {
        mutateIsClaimed();
        setWaitForSubgraphUpdate(false);
      }, 5000);
    },
    claimed: isClaimed,
  });
  const expectedAmount = getExpectedAmount(
    myContribution,
    Big(0),
    auction.totalRaised[0].amount,
    auction.allocatedAmount,
  );
  const toast = useToast({ position: "top-right", isClosable: true });
  const { t } = useLocale();
  return (
    <Button
      variant={"solid"}
      isDisabled={isClaimed || claimSucceeded || !claimWriteFn.writeAsync}
      isLoading={claimWriteFn?.isLoading || claimWaitFn?.isLoading || waitForSubgraphUpdate}
      {...buttonProps}
      onClick={async () => {
        await claimWriteFn.writeAsync();
      }}
    >
      {isClaimed || claimSucceeded
        ? t("CLAIMED")
        : expectedAmount.eq(0) && myContribution.gt(0)
        ? t("CLAIM_REFUND")
        : t("CLAIM")}
    </Button>
  );
}
