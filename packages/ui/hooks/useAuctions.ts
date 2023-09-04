import { KeyedMutator, SWRConfiguration } from "swr";
import useSWRInfinite from "swr/infinite";
import { QueryType } from "lib/apollo/query";
import { AuctionProps } from "lib/types/Auction";
import { zeroAddress } from "viem";

interface SWRAuctionStore {
  auctions: AuctionProps[];
  isLast: boolean;
  error?: Error;
  isLoading: boolean;
  isValidating: boolean;
  fetcher: (args: [number, number, `0x${string}`]) => Promise<AuctionProps[]>;
  loadMoreAuctions: () => void;
  mutate: KeyedMutator<AuctionProps[][]>;
}

type AuctionsParams = {
  first?: number;
  skip?: number;
  id?: `0x${string}`;
  keySuffix?: string;
};

// TODO Send limit as a param
const LIMIT = 50;
const NOW = Math.floor(new Date().getTime() / 1000);

export const useSWRAuctions = (
  config: AuctionsParams & SWRConfiguration,
  queryType: QueryType = QueryType.ACTIVE_AND_UPCOMING,
): SWRAuctionStore => {
  const getKey = (pageIndex: number, previousPageData: AuctionProps[]) => {
    if (previousPageData && !previousPageData.length) return null;
    const skip = previousPageData === null ? 0 : previousPageData.length;
    return [
      config.skip ? config.skip : skip,
      config.first ? config.first : LIMIT,
      config.id ? config.id : zeroAddress,
      NOW,

      `queryType_${queryType.toString()}${config.keySuffix ? `_${config.keySuffix}` : ""}`,
    ];
  };

  const fetcher = async (args: [number, number, `0x${string}`]): Promise<AuctionProps[]> => {
    const params = new URLSearchParams({
      queryTypeIndex: queryType.toString(),
      skip: args[0].toString(),
      first: args[1].toString(),
      id: args[2].toString(),
      now: NOW.toString(),
    }).toString();

    return fetch(`/api/auctions/?${params}`).then(async (stream) => {
      const result = await stream.json();
      return result.data.auctions;
    });
  };

  const {
    data: auctionList,
    error,
    size,
    setSize,
    isLoading,
    isValidating,
    mutate,
  } = useSWRInfinite<AuctionProps[], Error>(getKey, fetcher, config);

  const loadMoreAuctions = () => {
    setSize(size + 1);
  };

  const isLast = auctionList ? auctionList.filter((list) => list.length < LIMIT).length > 0 : false;
  const auctions = auctionList ? auctionList.flat() : [];

  return {
    auctions,
    isLast,
    error,
    isLoading,
    isValidating,
    fetcher,
    loadMoreAuctions,
    mutate,
  };
};
