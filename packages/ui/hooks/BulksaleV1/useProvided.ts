import { useContractRead } from "wagmi";
import SaleTemplateV1ABI from '../../constants/abis/SaleTemplateV1.json';

export default function useProvided(contractAddress: `0x${string}`, address: `0x${string}`|undefined): {
    provided: BigInt,
    isLoading: boolean,
    refetch: () => Promise<any>
} {
    const {data: provided, refetch, isLoading} = useContractRead({
        address: contractAddress,
        abi: SaleTemplateV1ABI,
        functionName: 'provided',
        args: [address],
        staleTime: 1000,
        cacheTime: 1000,
    });

    return {
        provided: provided ? BigInt(String(provided)) : BigInt(0),
        isLoading,
        refetch
    }
}