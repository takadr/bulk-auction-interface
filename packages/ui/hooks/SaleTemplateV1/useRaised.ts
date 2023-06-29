import { useContractReads } from "wagmi";
import { NULL_ADDRESS } from "lib/constants";
import SaleTemplateV1ABI from "lib/constants/abis/SaleTemplateV1.json";
import Big, { getBigNumber } from "lib/utils/bignumber";

export default function useRaised(
  contractAddress: `0x${string}`,
  address: `0x${string}` | undefined
): {
  raised: Big;
  totalRaised: Big;
  isLoading: boolean;
  isError: boolean;
  refetch: () => Promise<any>;
} {
  const saleContractConfig = {
    address: contractAddress,
    abi: SaleTemplateV1ABI,
  };

  const { data, isError, refetch, isLoading } = useContractReads({
    contracts: [
      {
        ...saleContractConfig,
        functionName: "raised",
        args: [address || NULL_ADDRESS],
      },
      {
        ...saleContractConfig,
        functionName: "totalRaised",
      },
    ],
  });

  return {
    raised: data && data[0] ? getBigNumber(String(data[0])) : Big(0),
    totalRaised: data && data[1] ? getBigNumber(String(data[1])) : Big(0),
    isLoading,
    isError,
    refetch,
  };
}
