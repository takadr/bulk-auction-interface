import useSWR, {SWRResponse} from 'swr';
import { MetaData } from 'lib/types/BulksaleV1';
import { LOCK_DURATION, EXPIRATION_DURATION, FEE_RATE_PER_MIL, SALE_TEMPLATE_V1_NAME } from 'lib/constants';

type Constants = { lockDuration: number, expirationDuration: number, feeRatePerMil: number }

const useSWRAuction = (id: string): SWRResponse<{metaData: MetaData, constants: Constants}|undefined, Error> => {
    const fetcher = (url: string): Promise<{metaData: MetaData, constants: Constants}|undefined> => fetch(url)
    .then(res => res.json())
    .then(data => { 
        return {
            metaData: data.auction ? data.auction : {
                id,
                title: 'Unnamed Sale',
            } as MetaData,
            constants: {
                lockDuration: LOCK_DURATION[SALE_TEMPLATE_V1_NAME],
                expirationDuration: EXPIRATION_DURATION[SALE_TEMPLATE_V1_NAME],
                feeRatePerMil: FEE_RATE_PER_MIL[SALE_TEMPLATE_V1_NAME],
            }
        }
    })
    return useSWR<{metaData: MetaData, constants: Constants}|undefined, Error>(`/api/auctions/${id}`, fetcher, {errorRetryCount: 2});
}

export default useSWRAuction;