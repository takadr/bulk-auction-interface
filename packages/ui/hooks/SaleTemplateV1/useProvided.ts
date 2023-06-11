import { useContractReads } from "wagmi";
import { NULL_ADDRESS } from "lib/constants";
import SaleTemplateV1ABI from 'lib/constants/abis/SaleTemplateV1.json';
import Big, { getBigNumber } from "lib/utils/bignumber";

export default function useProvided(contractAddress: `0x${string}`, address: `0x${string}`|undefined): {
    provided: Big,
    totalProvided: Big,
    isLoading: boolean,
    isError: boolean,
    refetch: () => Promise<any>
} {
    const saleContractConfig ={
        address: contractAddress,
        abi: SaleTemplateV1ABI,
    }

    const { data, isError, refetch, isLoading } = useContractReads({
        contracts: [
          {
            ...saleContractConfig,
            functionName: 'provided',
            args: [address || NULL_ADDRESS],
          },
          {
            ...saleContractConfig,
            functionName: 'totalProvided',
          },
        ],
    })

    return {
        provided: data && data[0] ? getBigNumber(String(data[0])) : Big(0),
        totalProvided: data && data[1] ? getBigNumber(String(data[1])) : Big(0),
        isLoading,
        isError,
        refetch
    }
}