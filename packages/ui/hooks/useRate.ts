import { useContractRead } from "wagmi";
import PRICE_FEED_ABI from "lib/constants/abis/ChainlinkPriceFeed.json";

const useRate = () => {
  const contractRead = useContractRead({
    address: process.env.NEXT_PUBLIC_CHAINLINK_ETH_USD_PRICE_FEED as `0x${string}`,
    abi: PRICE_FEED_ABI,
    functionName: "latestRoundData",
    scopeKey: "eth-usd",
    cacheTime: 60_000,
    staleTime: 60_000,
    select: (data): number | undefined => {
      const result = data as (bigint | number)[];
      return typeof result[1] === "bigint" ? Number(result[1]) / 1e8 : undefined;
    },
  });
  return contractRead;
};
export default useRate;
