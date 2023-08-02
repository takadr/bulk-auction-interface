import useSWR, { SWRResponse } from "swr";
import { MetaData } from "lib/types/Sale";
import {
  LOCK_DURATION,
  FEE_RATE_PER_MIL,
  SALE_TEMPLATE_V1_NAME,
} from "lib/constants";
import { useLocale } from "./useLocale";

type Constants = { lockDuration: number; feeRatePerMil: number };

const useSWRMetaData = (
  id: string,
): SWRResponse<
  { metaData: MetaData; constants: Constants } | undefined,
  Error
> => {
  const { t } = useLocale();
  const fetcher = (
    url: string,
  ): Promise<{ metaData: MetaData; constants: Constants } | undefined> =>
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        return {
          metaData: data.metaData
            ? data.metaData
            : ({
                id,
                title: t("UNNAMED_SALE"),
              } as MetaData),
          constants: {
            lockDuration: LOCK_DURATION[SALE_TEMPLATE_V1_NAME],
            feeRatePerMil: FEE_RATE_PER_MIL[SALE_TEMPLATE_V1_NAME],
          },
        };
      });
  return useSWR<
    { metaData: MetaData; constants: Constants } | undefined,
    Error
  >(`/api/metadata/${id}`, fetcher, { errorRetryCount: 2 });
};

export default useSWRMetaData;
