import { SWRConfiguration } from "swr";
import useSWRInfinite from "swr/infinite";
import { useQuery } from "wagmi";
import client from "lib/apollo/client";
import {
  LIST_ACTIVE_AND_UPCOMING_SALE_QUERY,
  LIST_ACTIVE_SALE_QUERY,
  LIST_UPCOMING_SALE_QUERY,
  LIST_CLOSED_SALE_QUERY,
} from "lib/apollo/query";
import { Sale } from "lib/types/Sale";
import { DocumentNode } from "@apollo/client";

interface SWRSaleStore {
  sales: Sale[];
  isLast: boolean;
  error?: Error;
  isLoading: boolean;
  isValidating: boolean;
  fetcher: (args: [number, number]) => Promise<Sale[]>;
  loadMoreSales: () => void;
}

type SalesParams = {
  first?: number;
  skip?: number;
  keySuffix?: string;
};

export enum QueryType {
  ACTIVE_AND_UPCOMING,
  ACTIVE,
  UPCOMING,
  CLOSED,
}

// TODO Send limit as a param
const LIMIT = 50;
const NOW = Math.floor(new Date().getTime() / 1000);

const getQuery = (queryType: QueryType): DocumentNode => {
  switch (queryType) {
    case QueryType.ACTIVE_AND_UPCOMING:
      return LIST_ACTIVE_AND_UPCOMING_SALE_QUERY;
    case QueryType.ACTIVE:
      return LIST_ACTIVE_SALE_QUERY;
    case QueryType.UPCOMING:
      return LIST_UPCOMING_SALE_QUERY;
    case QueryType.CLOSED:
      return LIST_CLOSED_SALE_QUERY;
    default:
      return LIST_ACTIVE_AND_UPCOMING_SALE_QUERY;
  }
};

export const useSWRSales = (
  config: SalesParams & SWRConfiguration,
  queryType: QueryType = QueryType.ACTIVE_AND_UPCOMING
): SWRSaleStore => {
  const getKey = (pageIndex: number, previousPageData: Sale[]) => {
    if (previousPageData && !previousPageData.length) return null;
    const skip = previousPageData === null ? 0 : previousPageData.length;
    return [
      config.skip ? config.skip : skip,
      config.first ? config.first : LIMIT,
      NOW,
      `queryType_${queryType.toString()}${
        config.keySuffix ? `_${config.keySuffix}` : ""
      }`,
    ];
  };

  const fetcher = async (args: [number, number]): Promise<Sale[]> => {
    return client
      .query({
        query: getQuery(queryType),
        variables: {
          skip: args[0],
          first: args[1],
          now: NOW,
        },
      })
      .then((result) => {
        return result.data.sales;
      });
  };

  const {
    data: saleList,
    error,
    size,
    setSize,
    isLoading,
    isValidating,
  } = useSWRInfinite<Sale[], Error>(getKey, fetcher, config);

  const loadMoreSales = () => {
    setSize(size + 1);
  };

  const isLast = saleList
    ? saleList.filter((list) => list.length < LIMIT).length > 0
    : false;
  const sales = saleList ? saleList.flat() : [];

  return {
    sales,
    isLast,
    error,
    isLoading,
    isValidating,
    fetcher,
    loadMoreSales,
  };
};
