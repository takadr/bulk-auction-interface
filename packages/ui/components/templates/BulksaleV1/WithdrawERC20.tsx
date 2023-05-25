import { QuestionIcon } from "@chakra-ui/icons";
import { chakra, useToast, Button, Tooltip, Flex, Box, Heading } from "@chakra-ui/react";
import { useContractRead, erc20ABI } from "wagmi";
import useWithdrawERC20Onsale from '../../../hooks/useWithdrawERC20Onsale';
import { Sale } from "../../../types/BulksaleV1";
import { tokenAmountFormat } from "../../../utils";
import { getBigNumber } from "../../../utils/bignumber";
import TxSentToast from "../../TxSentToast";

type Props = {
    sale: Sale;
    onSuccessConfirm?: (data: any) => void;
}
export default function WithdrawERC20({sale, onSuccessConfirm}: Props) {
    const toast = useToast({position: 'top-right', isClosable: true,})
    const { data: balance } = useContractRead( {
        address: sale.token as `0x${string}`,
        abi: erc20ABI,
        functionName: 'balanceOf',
        args: [sale.id as `0x${string}`],
        watch: true
    })
    const {prepareFn: withdrawERC20PrepareFn, writeFn: withdrawERC20WriteFn, waitFn: withdrawERC20WaitFn} = useWithdrawERC20Onsale({
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
            Token balance of Sale contract
            <Tooltip hasArrow label={'Token withdrawals will be available immediately after the end of the sale if the sale could not achieve the minimum threshold that is set in the contract.'}><QuestionIcon mb={1} ml={1} /></Tooltip>
        </Heading>
        <Flex alignItems={'center'} justifyContent={'space-between'}>
            <chakra.p fontSize={'lg'}>{typeof balance !== 'undefined' ? tokenAmountFormat(getBigNumber(balance.toString()), sale.tokenDecimals, 2) : '-'} {sale.tokenSymbol}</chakra.p>
            <Button
                variant={'solid'}
                isDisabled={!balance || balance.isZero() || !withdrawERC20WriteFn.writeAsync}
                isLoading={withdrawERC20WriteFn.isLoading || withdrawERC20WaitFn.isLoading}
                onClick={() => withdrawERC20WriteFn.writeAsync()}
            >
                Withdraw Token
            </Button>
        </Flex>
    </Box>
}