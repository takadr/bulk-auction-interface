import { useContractRead, erc20ABI } from 'wagmi';

export default function useTokenBasicInfo(targetAddress: `0x${string}` | null): {
    name: string | undefined,
    symbol: string | undefined,
    decimals: number | undefined,
  } {

  const { data: name } = useContractRead({
    address: targetAddress ? targetAddress : '0x00',
    abi: erc20ABI,
    functionName: 'name',
  })

  const { data: symbol } = useContractRead({
    address: targetAddress ? targetAddress : '0x00',
    abi: erc20ABI,
    functionName: 'symbol',
  })

  const { data: decimals } = useContractRead({
    address: targetAddress ? targetAddress : '0x00',
    abi: erc20ABI,
    functionName: 'decimals',
  })

  return {
    name,
    symbol,
    decimals,
  }
}