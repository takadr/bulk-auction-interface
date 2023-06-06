import {SWRConfiguration} from 'swr';
import useSWRInfinite from 'swr/infinite';
import { useQuery } from 'wagmi';
import client from 'lib/apollo/client';
import { LIST_ACTIVE_SALE_QUERY } from 'lib/apollo/query';
import { Sale } from 'lib/types/BulksaleV1';

interface SWRSaleStore {
  sales: Sale[]
  isLast: boolean
  error?: Error
  isLoading: boolean,
  isValidating: boolean,
  fetcher: (args: [number]) => Promise<Sale[]>
  loadMoreSales: () => void
}

// TODO Send limit as a param
const LIMIT = 50;
const NOW = Math.floor(new Date().getTime() / 1000);

export const useSWRActiveSales = (config: SWRConfiguration): SWRSaleStore => {
  const getKey = (pageIndex: number, previousPageData: Sale[]) => {
    if (previousPageData && !previousPageData.length) return null
    const skip = previousPageData === null ? 0 : previousPageData.length;
    return [skip, NOW, 'activeSales'];
  }

  const fetcher = async (args: [number]): Promise<Sale[]> => {
    return client
    .query({
      query: LIST_ACTIVE_SALE_QUERY,
      variables: {
        skip: args[0], first: LIMIT, now: NOW
      },
    })
    .then((result) => {
      return result.data.sales
    });
  }

  const { data: saleList, error, size, setSize, isLoading, isValidating } = useSWRInfinite<Sale[], Error>(
    getKey,
    fetcher, 
    config
  )

  const loadMoreSales = () => {
    setSize(size + 1)
  }

  const isLast = saleList ? saleList.filter(list => list.length < LIMIT).length > 0 : false
  const sales = saleList ? saleList.flat() : []

  return {
    sales,
    isLast,
    error,
    isLoading,
    isValidating,
    fetcher,
    loadMoreSales
  }
}