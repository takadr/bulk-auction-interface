import useSWR, {SWRResponse} from 'swr';
import { User } from '../../types';

export const useCurrentUser = (config?: any): SWRResponse<User, Error> => {
    const fetcher = (url: string): Promise<User> => fetch(url, {credentials: 'same-origin'}).then(res => res.json()).then(data => data);
    return useSWR<User, Error>(`/api/me`, fetcher, Object.assign({ fallbackData: { currentUser: undefined }}, config))
}