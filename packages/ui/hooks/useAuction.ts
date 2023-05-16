import useSWR, {SWRResponse} from 'swr';
import { MetaData } from '../types/BulksaleV1';
import { LOCK_DURATION, EXPIRATION_DURATION, FEE_RATE_PER_MIL } from '../constants';

type Constants = { lockDuration: number, expirationDuration: number, feeRatePerMil: number }

const useSWRAuction = (id: string): SWRResponse<{metaData: MetaData, constants: Constants}|undefined, Error> => {
    const fetcher = (url: string): Promise<{metaData: MetaData, constants: Constants}|undefined> => fetch(url)
    .then(res => res.json())
    .then(data => { 
        return {
            metaData: data.auction, 
            constants: {
                lockDuration: LOCK_DURATION[data.auction.templateName],
                expirationDuration: EXPIRATION_DURATION[data.auction.templateName],
                feeRatePerMil: FEE_RATE_PER_MIL[data.auction.templateName],
            }
        }
    })
    console.log(LOCK_DURATION['0x53616c6554656d706c6174655631000000000000000000000000000000000000'])
    return useSWR<{metaData: MetaData, constants: Constants}|undefined, Error>(`/api/auctions/${id}`, fetcher);
}

// const useSWRAuction = (id: string): SWRResponse<MetaData|undefined, Error> => {
//     const fetcher = (url: string): Promise<MetaData|undefined> => fetch(url)
//     .then(res => res.json())
//     .then(data => data.auction)
//     return useSWR<MetaData|undefined, Error>(`/api/auctions/${id}`, fetcher);
// }

export default useSWRAuction;