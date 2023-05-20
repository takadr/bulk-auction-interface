import { useNetwork, usePrepareContractWrite, useContractWrite, useWaitForTransaction } from 'wagmi';
import Template from '../constants/abis/Template.json';

export default function useWithdrawUnclaimedERC20OnSale({
  targetAddress,
  onSuccessWrite,
  onSuccessConfirm,
} : {
  targetAddress: `0x${string}` | null,
  onSuccessWrite?: (data: any) => void,
  onSuccessConfirm?: (data: any) => void,
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
    functionName: 'withdrawUnclaimedERC20OnSale',
    enabled
  })

  const writeFn = useContractWrite({
    ...prepareFn.config,
    onSuccess(data) {
      console.log('Withdrew!', data)
      onSuccessWrite && onSuccessWrite(data)
    }
  })

  const waitFn = useWaitForTransaction({
    chainId: chain?.id,
    hash: writeFn.data?.hash,
    onSuccess(data) {
      console.log('Withdrew!', data)
      onSuccessConfirm && onSuccessConfirm(data)
  }
  })

  return {
    prepareFn,
    writeFn,
    waitFn,
  }
}