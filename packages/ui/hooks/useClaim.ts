import {
  useNetwork,
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi";
import Template from "lib/constants/abis/TemplateV1.json";

export default function useClaim({
  targetAddress,
  address,
  onSuccessWrite,
  onSuccessConfirm,
  claimed,
}: {
  targetAddress: `0x${string}` | null;
  address: `0x${string}` | undefined;
  onSuccessWrite?: (data: any) => void;
  onSuccessConfirm?: (data: any) => void;
  claimed: boolean;
}): {
  prepareFn: any;
  writeFn: any;
  waitFn: ReturnType<typeof useWaitForTransaction>;
} {
  const { chain } = useNetwork();
  const enabled: boolean = !!targetAddress && !!address && !!chain && !claimed;

  const prepareFn = usePrepareContractWrite({
    chainId: chain?.id,
    address: targetAddress ? targetAddress : "0x00",
    abi: Template,
    functionName: "claim",
    args: [address, address], // Contributer, Reciepient
    enabled,
  });

  const writeFn = useContractWrite({
    ...prepareFn.config,
    onSuccess(data) {
      onSuccessWrite && onSuccessWrite(data);
    },
  });

  const waitFn = useWaitForTransaction({
    chainId: chain?.id,
    hash: writeFn.data?.hash,
    onSuccess(data) {
      onSuccessConfirm && onSuccessConfirm(data);
    },
  });

  return {
    prepareFn,
    writeFn,
    waitFn,
  };
}
