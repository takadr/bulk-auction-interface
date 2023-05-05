import { useContractRead, useToken, erc20ABI } from "wagmi";
import bulksaleV1ABI from '../constants/abis/BulksaleV1.json';

// TODO Retrieve from Subgraph or useContractReads
// https://wagmi.sh/react/hooks/useContractReads
export default function useBulksaleV1(contractAddress: `0x${string}`, address: `0x${string}`) {
    const {data: startingAt} = useContractRead({
        address: contractAddress,
        abi: bulksaleV1ABI,
        functionName: 'startingAt',
    });
    const {data: closingAt} = useContractRead({
        address: contractAddress,
        abi: bulksaleV1ABI,
        functionName: 'closingAt',
    });
    const {data: totalDistributeAmount} = useContractRead({
        address: contractAddress,
        abi: bulksaleV1ABI,
        functionName: 'totalDistributeAmount',
    });
    const {data: minimalProvideAmount} = useContractRead({
        address: contractAddress,
        abi: bulksaleV1ABI,
        functionName: 'minimalProvideAmount',
    });
    const {data: totalProvided} = useContractRead({
        address: contractAddress,
        abi: bulksaleV1ABI,
        functionName: 'totalProvided',
        staleTime: 1000,
        cacheTime: 1000,
    });
    const {data: provided} = useContractRead({
        address: contractAddress,
        abi: bulksaleV1ABI,
        functionName: 'provided',
        args: [address],
        staleTime: 1000,
        cacheTime: 1000,
    });
    const {data: owner} = useContractRead({
        address: contractAddress,
        abi: bulksaleV1ABI,
        functionName: 'owner',
        staleTime: 1000,
        cacheTime: 1000,
    });
    const {data: tokenAddress} = useContractRead({
        address: contractAddress,
        abi: bulksaleV1ABI,
        functionName: 'erc20onsale'
    });
    const {data: token}: { data: any } = useToken({
        address: tokenAddress as `0x${string}`
    });

    return {
        startingAt: startingAt ? Number(startingAt) * 1000 : 0,
        closingAt: closingAt ? Number(closingAt) * 1000 : 0,
        totalDistributeAmount: totalDistributeAmount ? BigInt(String(totalDistributeAmount)) : BigInt(0),
        minimalProvideAmount: minimalProvideAmount ? BigInt(String(minimalProvideAmount)) : BigInt(0) ,
        totalProvided: totalProvided ? BigInt(String(totalProvided)) : BigInt(0),
        provided: provided ? BigInt(String(provided)) : BigInt(0),
        token,
        owner
    }
}