import useSWR, { SWRResponse } from "swr";
import { LIST_TEMPLATE_QUERY } from "lib/apollo/query";
import client from "lib/apollo/client";

const useTemplates = (): SWRResponse<any | undefined, Error> => {
  const fetcher = async (key: string): Promise<any | undefined> => {
    const result = await client.query({
      query: LIST_TEMPLATE_QUERY,
    });
    return { templates: result.data.templates };
  };

  return useSWR<any | undefined, Error>(`/api/templates`, fetcher, {
    errorRetryCount: 2,
  });
};

export default useTemplates;
