import { useNetwork, usePrepareContractWrite, useContractWrite, useWaitForTransaction } from 'wagmi';
import Template from '../constants/abis/Template.json';

export default function useWithdrawERC20Onsale({
  targetAddress,
  onSuccessWrite,
  onErrorWrite,
  onSuccessConfirm,
  onErrorConfirm,
} : {
  targetAddress: `0x${string}` | null,
  onSuccessWrite?: (data: any) => void,
  onErrorWrite?: (error: Error) => void,
  onSuccessConfirm?: (data: any) => void,
  onErrorConfirm?: (error: Error) => void,
}): {
    prepareFn: any,
    writeFn: any,
    waitFn: ReturnType<typeof useWaitForTransaction>
} {
  const { chain } = useNetwork();
  const enabled: boolean = !!targetAddress && !!chain

  const prepareFn = usePrepareContractWrite({
    chainId: chain?.id,
    address: targetAddress ? targetAddress : '0x00',
    abi: Template,
    functionName: 'withdrawERC20Onsale',
    enabled
  })

  const writeFn = useContractWrite({
    ...prepareFn.config,
    onSuccess(data) {
        console.log('Withdrew!', data)
        onSuccessWrite && onSuccessWrite(data);
    },
    onError(e: Error) {
      onErrorWrite && onErrorWrite(e)
    }
  })

  const waitFn = useWaitForTransaction({
    chainId: chain?.id,
    hash: writeFn.data?.hash,
    onSuccess(data) {
      onSuccessConfirm && onSuccessConfirm(data);
    },
    onError(e: Error) {
      onErrorConfirm && onErrorConfirm(e)
    }
  })

  return {
    prepareFn,
    writeFn,
    waitFn,
  }
}