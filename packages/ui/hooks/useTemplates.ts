import useSWR, { SWRResponse } from "swr";

const useTemplates = (): SWRResponse<any | undefined, Error> => {
  const fetcher = (url: string): Promise<any | undefined> =>
    fetch(url)
      .then((res) => res.json())
      .then((result) => {
        return { templates: result.data.templates };
      });
  return useSWR<any | undefined, Error>(`/api/templates`, fetcher, {
    errorRetryCount: 2,
  });
};

export default useTemplates;
