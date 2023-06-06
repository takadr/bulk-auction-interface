import { createContext } from 'react';
import { KeyedMutator } from 'swr';
import { User } from 'lib/types';
import { useCurrentUser } from '../../hooks/Auth/useCurrentUser';

export type CurrentUserContextType ={
    currentUser?: User | undefined;
    mutate?: KeyedMutator<User|undefined>;
    error?: Error | undefined;
}
export const CurrentUserContext = createContext<CurrentUserContextType>({});
export const CurrentUserProvider = (props: any) => {
    const { data, mutate, error } = useCurrentUser();

    return (
        <CurrentUserContext.Provider value={{ currentUser: data, mutate, error }}>
            {props.children}
        </CurrentUserContext.Provider>
    )
}