import useSWR, { SWRResponse } from "swr";
import { zeroAddress } from "viem";
import client from "lib/apollo/client";
import { GET_SALE_QUERY } from "lib/apollo/query";

const useAuction = (
  id: `0x${string}`,
  address: `0x${string}` = zeroAddress,
): SWRResponse<any | undefined, Error> => {
  const params = new URLSearchParams({
    address,
  }).toString();

  const fetcher = async (key: string): Promise<any | undefined> => {
    const result = await client.query({
      query: GET_SALE_QUERY,
      variables: {
        id: id as string,
        address: (address as `0x${string}`).toLowerCase(),
      },
    });
    return { auction: result.data.auction };
  };

  return useSWR<any | undefined, Error>(`/api/auctions/${id}?${params}`, fetcher, {
    errorRetryCount: 2,
  });
};

export default useAuction;
