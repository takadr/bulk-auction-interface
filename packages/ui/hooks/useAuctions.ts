import { KeyedMutator, SWRConfiguration } from "swr";
import useSWRInfinite from "swr/infinite";
import { QueryType } from "lib/apollo/query";
import { AuctionProps } from "lib/types/Auction";
import { zeroAddress } from "viem";
import { useCallback } from "react";

interface SWRAuctionStore {
  auctions: AuctionProps[];
  isLast: boolean;
  error?: Error;
  isLoading: boolean;
  isValidating: boolean;
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
    const skip = pageIndex * LIMIT;

    const params = new URLSearchParams({
      queryTypeIndex: queryType.toString(),
      skip: (config.skip ? config.skip + skip : skip).toString(),
      first: (config.first ? config.first : LIMIT).toString(),
      id: (config.id ? config.id : zeroAddress).toString(),
      now: NOW.toString(),
    }).toString();

    return params;
  };

  const fetcher = async (params: string) => {
    let auctions: AuctionProps[] = [];
    try {
      const result = await fetch(`/api/auctions/?${params}`);
      if (!result.ok) throw new Error();
      const json = await result.json();
      auctions = json.data.auctions;
    } catch (e) {
      console.error(e);
    }
    return auctions;
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
    loadMoreAuctions,
    mutate,
  };
};
