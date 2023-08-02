import { useContractReads } from "wagmi";
import SaleTemplateV1ABI from "lib/constants/abis/SaleTemplateV1.json";
import Big, { getBigNumber } from "lib/utils/bignumber";
import { Sale } from "lib/types/Sale";
import { ContractFunctionConfig, Abi } from "viem";

export default function useRaised(
  sale: Sale,
  address: `0x${string}` | undefined
): {
  raised: Big;
  totalRaised: Big;
  isLoading: boolean;
  isError: boolean;
  refetch: (() => Promise<any>) | (() => void);
} {
  
  const saleContractConfig = {
    address: sale.id as `0x${string}`,
    abi: SaleTemplateV1ABI as Abi
  };

  const { data, isError, refetch, isLoading } = useContractReads<ContractFunctionConfig<Abi, string>[], boolean, any>({
    contracts: [
      {
        ...saleContractConfig,
        functionName: "raised",
        // TODO
        // @ts-ignore
        args: [address],
      },
      // TODO
      // @ts-ignore
      {
        ...saleContractConfig,
        functionName: "totalRaised",
      },
    ],
    enabled: typeof address !== "undefined",
  });

  /*
  To reduce RPC request, it returns 0 raised and totalRaised from Sale object if address is not given.
  */
  if (typeof address === "undefined") {
    return {
      raised: Big(0),
      totalRaised: getBigNumber(sale.totalRaised),
      isLoading: false,
      isError: false,
      refetch: () => {},
    };
  }

  return {
    raised: data && data[0] ? getBigNumber(BigInt(data[0].result).toString()) : Big(0),
    totalRaised: data && data[1] ? getBigNumber(BigInt(data[1].result).toString()) : Big(0),
    isLoading,
    isError,
    refetch,
  };
}
