import { createContext } from 'react';
import { KeyedMutator } from 'swr';
import { User } from '../../types';
import { useCurrentUser } from '../../hooks/Auth/useCurrentUser';

type currentUserContextType ={
    currentUser: User | undefined;
    mutate: KeyedMutator<User>;
    error: Error | undefined;
}
export const CurrentUserContext = createContext<currentUserContextType|undefined>(undefined);
export const CurrentUserProvider = (props: any) => {
    const { data, mutate, error } = useCurrentUser();

    return (
        <CurrentUserContext.Provider value={{ currentUser: data, mutate, error }}>
            {props.children}
        </CurrentUserContext.Provider>
    )
}