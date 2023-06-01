import { QuestionIcon } from "@chakra-ui/icons";
import { useToast, Button, Tooltip, Flex, Box, Heading, chakra } from "@chakra-ui/react";
import { useContractRead, erc20ABI } from "wagmi";
import useWithdrawUnclaimedERC20OnSale from '../../../hooks/useWithdrawUnclaimedERC20OnSale';
import { Sale } from "../../../types/BulksaleV1";
import { getDecimalsForView, tokenAmountFormat } from "../../../utils";
import { getBigNumber } from "../../../utils/bignumber";
import TxSentToast from "../../TxSentToast";

type Props = {
    sale: Sale;
    onSuccessConfirm?: (data: any) => void;
}
export default function WithdrawUnclaimedToken({sale, onSuccessConfirm}: Props) {
    const toast = useToast({position: 'top-right', isClosable: true,})
    const { data: balance } = useContractRead( {
        address: sale.token as `0x${string}`,
        abi: erc20ABI,
        functionName: 'balanceOf',
        args: [sale.id as `0x${string}`],
        watch: true
    })
    const {prepareFn: withdrawUnclaimedERC20PrepareFn, writeFn: withdrawUnclaimedERC20WriteFn, waitFn: withdrawUnclaimedERC20WaitFn} = useWithdrawUnclaimedERC20OnSale({ 
        targetAddress: sale.id as `0x${string}`, 
        onSuccessWrite: (data) => {
            toast({
                title: 'Transaction sent!',
                status: 'success',
                duration: 5000,
                render: (props) => <TxSentToast txid={data?.hash} {...props} />
            })
        },
        onErrorWrite: (e: Error) => {
            toast({
                description: e.message,
                status: 'error',
                duration: 5000,
            })
        },
        onSuccessConfirm: (data) => {
            toast({
                description: `Transaction confirmed!`,
                status: 'success',
                duration: 5000,
            })
            onSuccessConfirm && onSuccessConfirm(data);
        } 
    });

    return <Box>
        <Heading fontSize={'lg'} textAlign={'left'}>
            Unclaimed token balance (削除予定)
            <Tooltip hasArrow label={'Finished, passed lock duration, and still there\'re unsold ERC-20.'}><QuestionIcon mb={1} ml={1} /></Tooltip>
        </Heading>
        <Flex alignItems={'center'} justifyContent={'space-between'}>
            <chakra.p fontSize={'lg'}>{typeof balance !== 'undefined' ? tokenAmountFormat(getBigNumber(balance.toString()), sale.tokenDecimals, getDecimalsForView(getBigNumber(sale.distributeAmount), sale.tokenDecimals)) : '-'} {sale.tokenSymbol}</chakra.p>
            <Button
                variant={'solid'}
                isDisabled={!balance || balance.isZero() || !withdrawUnclaimedERC20WriteFn.writeAsync}
                isLoading={withdrawUnclaimedERC20WriteFn.isLoading || withdrawUnclaimedERC20WaitFn.isLoading}
                onClick={() => withdrawUnclaimedERC20WriteFn.writeAsync()}
            >
                Withdraw Unclaimed Token
            </Button>
        </Flex>
    </Box>
}