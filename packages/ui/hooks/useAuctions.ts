import {SWRConfiguration} from 'swr';
import useSWRInfinite from 'swr/infinite';
import { Auction } from '../types';

interface SWRAuctionStore {
  auctions: Auction[]
  isLast: boolean
  error?: Error
  fetcher: (lastEvaluatedKey: [Auction, number]) => Promise<Auction[]>
  loadMoreAuctions: () => void
}

// TODO Send limit as a param
const LIMIT = 10;

export const useSWRAuctions = (config: SWRConfiguration): SWRAuctionStore => {
  const getKey = (pageIndex: number, previousPageData: Auction[]) => {
    if (previousPageData && !previousPageData.length) return null
    const lastEvaluatedKey = previousPageData === null ? 0 : previousPageData[previousPageData.length - 1];
    return [lastEvaluatedKey, pageIndex];
  }

  const fetcher = async (lastEvaluatedKey: [Auction, number]): Promise<Auction[]> => {
    const url = lastEvaluatedKey[0] ? `/api/auctions?lastEvaluatedKeyId=${lastEvaluatedKey[0].id}&lastEvaluatedKeyCreatedAt=${lastEvaluatedKey[0].createdAt}` : `/api/auctions`;
    return await fetch(url).then(res => res.json()).then(data => data.auctions );
  }

  const { data: auctionsList, error, size, setSize } = useSWRInfinite<Auction[], Error>(
    getKey,
    fetcher, 
    config
  )

  const loadMoreAuctions = () => {
    setSize(size + 1)
  }

  const isLast = auctionsList ? auctionsList.filter(list => list.length < LIMIT).length > 0 : false
  const auctions = auctionsList ? auctionsList.flat() : []

  return {
    auctions,
    isLast,
    error,
    fetcher,
    loadMoreAuctions
  }
}