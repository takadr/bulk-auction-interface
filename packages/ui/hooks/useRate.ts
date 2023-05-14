import useSWR, {SWRResponse} from 'swr';
import { COINGECKO_URL } from '../constants';

const useRate = (tokenName: string, fiatSymbol: string): SWRResponse<any, Error> => {
    const url = `${COINGECKO_URL}?ids=${tokenName}&vs_currencies=${fiatSymbol}`;
    const fetcher = (url: string): Promise<any> => fetch(url)
    .then(res => res.json())
    .then(data => data[tokenName])
    return useSWR<any, Error>(`${url}`, fetcher);
    
};
export default useRate;