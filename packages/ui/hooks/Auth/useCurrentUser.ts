import useSWR, { SWRResponse } from "swr";
import { User } from "lib/types";

export const useCurrentUser = (): SWRResponse<User | undefined, Error> => {
  const fetcher = (url: string): Promise<User | undefined> =>
    fetch(url, { credentials: "same-origin" })
      .then((res) => res.json())
      .then((data) => data.user);
  return useSWR<User | undefined, Error>(`/api/me`, fetcher);
};
