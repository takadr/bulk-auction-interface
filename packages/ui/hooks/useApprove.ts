import { useNetwork, usePrepareContractWrite, useContractWrite, useWaitForTransaction, useContractRead, erc20ABI } from 'wagmi';
import { BigNumber, constants } from 'ethers';
// import { useDebounce } from './useDebounce';
import { useDebounce } from 'use-debounce';

export default function useApprove(targetAddress: `0x${string}` | null, owner: `0x${string}`, spender: `0x${string}`): {
    prepareFn: any,
    writeFn: any,
    waitFn: ReturnType<typeof useWaitForTransaction>
    readFn: ReturnType<typeof useContractRead>
  } {
  const { chain } = useNetwork();
//   const [approveArgs] = useDebounce<[`0x${string}`, BigNumber]>([spender, BigNumber.from(constants.MaxUint256)], 500)
//   const [enabled] = useDebounce(!!targetAddress && !!owner && !!spender && !!chain, 500)
//   const [allowanceArgs] = useDebounce<[`0x${string}`, `0x${string}`]>([owner, spender], 500)
  const approveArgs: [`0x${string}`, BigNumber] = [spender, BigNumber.from(constants.MaxUint256)]
  const allowanceArgs: [`0x${string}`, `0x${string}`] = [owner, spender]
  const enabled: boolean = !!targetAddress && !!owner && !!spender && !!chain

  const prepareFn = usePrepareContractWrite({
    chainId: chain?.id,
    address: targetAddress,
    abi: erc20ABI,
    functionName: 'approve',
    args: approveArgs,
    enabled
  })

  const writeFn = useContractWrite({
    ...prepareFn.config,
    onSuccess(data) {
        console.log('Approved!', data)
    }
  })

  const waitFn = useWaitForTransaction({
    chainId: chain?.id,
    hash: writeFn.data?.hash,
    // wait: writeFn.data?.wait
  })

  const readFn = useContractRead({
    address: targetAddress,
    abi: erc20ABI,
    functionName: 'allowance',
    args: allowanceArgs,
    enabled
  })

  return {
    prepareFn,
    writeFn,
    waitFn,
    readFn
  }
}