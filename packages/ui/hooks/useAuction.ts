import useSWR, {SWRResponse} from 'swr';
import { MetaData } from '../types/BulksaleV1';

const useSWRAuction = (id: string): SWRResponse<MetaData|undefined, Error> => {
    const fetcher = (url: string): Promise<MetaData|undefined> => fetch(url)
    .then(res => res.json())
    .then(data => data.auction)
    return useSWR<MetaData|undefined, Error>(`/api/auctions/${id}`, fetcher);
}

export default useSWRAuction;