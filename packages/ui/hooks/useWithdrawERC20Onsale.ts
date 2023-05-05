import { useNetwork, usePrepareContractWrite, useContractWrite, useWaitForTransaction } from 'wagmi';
import Template from '../constants/abis/Template.json';

export default function useWithdrawERC20Onsale(targetAddress: `0x${string}` | null): {
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
    }
  })

  const waitFn = useWaitForTransaction({
    chainId: chain?.id,
    hash: writeFn.data?.hash,
  })

  return {
    prepareFn,
    writeFn,
    waitFn,
  }
}