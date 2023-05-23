import { chakra, ButtonProps, Button, useToast } from "@chakra-ui/react";
import { KeyedMutator } from "swr";
import useClaim from '../../../hooks/useClaim';
import { Sale } from "../../../types/BulksaleV1";
import { getExpectedAmount } from "../../../utils";
import Big from "../../../utils/bignumber";

interface Props {
    sale: Sale;
    address: `0x${string}`;
    myTotalProvided: Big;
    isClaimed: boolean;
    mutateIsClaimed: KeyedMutator<boolean | undefined>;
}
export default function ClaimButton({
    sale,
    address,
    myTotalProvided,
    isClaimed,
    mutateIsClaimed,
    ...buttonProps
  }: Props & ButtonProps) {
    const {prepareFn: claimPrepareFn, writeFn: claimWriteFn, waitFn: claimWaitFn} = useClaim({
        targetAddress: sale.id as `0x${string}`, 
        owner: address, 
        onSuccessWrite: (data) => {
            toast({
                description: `Transaction sent! ${data?.hash}`,
                status: 'success',
                duration: 5000,
            })
        },
        onSuccessConfirm: (data) => { 
            toast({
                description: `Transaction confirmed!`,
                status: 'success',
                duration: 5000,
            })
            mutateIsClaimed()
        }
    });
    const expectedAmount = getExpectedAmount(myTotalProvided, Big(0), sale.totalProvided, sale.distributeAmount);
    const toast = useToast({position: 'top-right', isClosable: true,});
    return <Button
        variant={'solid'}
        isDisabled={isClaimed || !claimWriteFn.writeAsync}
        isLoading={claimWriteFn?.isLoading || claimWaitFn?.isLoading}
        {...buttonProps}
        onClick={async() => {
            await claimWriteFn.writeAsync();
        }}
    >
        { isClaimed ? 'Claimed' : (expectedAmount.eq(0) && myTotalProvided.gt(0) ? 'Claim Refund' : 'Claim') }
    </Button>
  };