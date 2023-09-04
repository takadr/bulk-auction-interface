import useSWR, { SWRResponse } from "swr";
import { zeroAddress } from "viem";

const useAuction = (
  id: `0x${string}`,
  address: `0x${string}` = zeroAddress,
): SWRResponse<any | undefined, Error> => {
  const params = new URLSearchParams({
    address,
  }).toString();

  const fetcher = (url: string): Promise<any | undefined> =>
    fetch(url)
      .then((res) => res.json())
      .then((result) => {
        return { auction: result.data.auction };
      });
  return useSWR<any | undefined, Error>(`/api/auctions/${id}?${params}`, fetcher, {
    errorRetryCount: 2,
  });
};

export default useAuction;
