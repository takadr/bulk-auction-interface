import { SWRConfiguration } from "swr";
import useSWRInfinite from "swr/infinite";
import { MetaData } from "lib/types/Sale";

interface SWRMetaDataStore {
  metaDataList: MetaData[];
  isLast: boolean;
  error?: Error;
  fetcher: (lastEvaluatedKey: [MetaData, number]) => Promise<MetaData[]>;
  loadMoreMetaData: () => void;
}

// TODO Send limit as a param
const LIMIT = 10;

export const useSWRMetaDataList = (
  config: SWRConfiguration
): SWRMetaDataStore => {
  const getKey = (pageIndex: number, previousPageData: MetaData[]) => {
    if (previousPageData && !previousPageData.length) return null;
    const lastEvaluatedKey =
      previousPageData === null
        ? 0
        : previousPageData[previousPageData.length - 1];
    return [lastEvaluatedKey, pageIndex];
  };

  const fetcher = async (
    lastEvaluatedKey: [MetaData, number]
  ): Promise<MetaData[]> => {
    const url = lastEvaluatedKey[0]
      ? `/api/metadata?lastEvaluatedKeyId=${lastEvaluatedKey[0].id}&lastEvaluatedKeyCreatedAt=${lastEvaluatedKey[0].createdAt}`
      : `/api/metadata`;
    return await fetch(url)
      .then((res) => res.json())
      .then((data) => data.metaData);
  };

  const {
    data: metaData,
    error,
    size,
    setSize,
  } = useSWRInfinite<MetaData[], Error>(getKey, fetcher, config);

  const loadMoreMetaData = () => {
    setSize(size + 1);
  };

  const isLast = metaData
    ? metaData.filter((list) => list.length < LIMIT).length > 0
    : false;
  const metaDataList = metaData ? metaData.flat() : [];

  return {
    metaDataList,
    isLast,
    error,
    fetcher,
    loadMoreMetaData,
  };
};
