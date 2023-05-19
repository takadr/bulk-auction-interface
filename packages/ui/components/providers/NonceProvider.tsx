import { createContext } from 'react';
import { useNonce } from '../../hooks/Auth/useNonce';

export const NonceContext = createContext<string|undefined>(undefined);
export const NonceProvider = (props: any) => {
    const { data } = useNonce();
    console.log("Nonce: ", data)
    return (
        <NonceContext.Provider value={data}>
            {props.children}
        </NonceContext.Provider>
    )
}