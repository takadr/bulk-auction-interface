import useSWR, { SWRResponse } from "swr";

export const useNonce = (): SWRResponse<string | undefined, Error> => {
  const fetcher = (url: string): Promise<string | undefined> =>
    fetch(url).then((res) => res.text());
  return useSWR<string | undefined, Error>(`/api/nonce`, fetcher, {
    dedupingInterval: 5000,
  });
};
