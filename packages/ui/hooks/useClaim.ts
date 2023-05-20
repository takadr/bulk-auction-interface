import { useNetwork, usePrepareContractWrite, useContractWrite, useWaitForTransaction } from 'wagmi';
import Template from '../constants/abis/Template.json';

export default function useClaim({
  targetAddress,
  owner,
  onSuccessWrite,
  onSuccessConfirm,
} : {
  targetAddress: `0x${string}` | null,
  owner: `0x${string}`|undefined,
  onSuccessWrite?: (data: any) => void,
  onSuccessConfirm?: (data: any) => void,
}): {
  prepareFn: any,
  writeFn: any,
  waitFn: ReturnType<typeof useWaitForTransaction>,
} {
  const { chain } = useNetwork();
  const enabled: boolean = !!targetAddress && !!owner && !!chain

  const prepareFn = usePrepareContractWrite({
    chainId: chain?.id,
    address: targetAddress ? targetAddress : '0x00',
    abi: Template,
    functionName: 'claim',
    args: [owner, owner], // Contributer, Reciepient
    enabled
  })

  const writeFn = useContractWrite({
    ...prepareFn.config,
    onSuccess(data) {
      console.log('Claimed!', data)
      onSuccessWrite && onSuccessWrite(data)
    }
  })

  const waitFn = useWaitForTransaction({
    chainId: chain?.id,
    hash: writeFn.data?.hash,
    onSuccess(data){
      console.log('Claim Confirmed!', data)
      onSuccessConfirm && onSuccessConfirm(data)
    }
  })

  return {
    prepareFn,
    writeFn,
    waitFn,
  }
}