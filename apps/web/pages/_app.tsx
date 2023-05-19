import type { AppProps } from "next/app";
import { ChakraProvider } from '@chakra-ui/react';
import { WagmiConfig } from 'wagmi';
import { ApolloProvider } from '@apollo/client';
import theme from 'ui/themes';
import client from 'ui/connector'; 
import apolloClient from 'ui/apollo/client';
import { CurrentUserProvider } from 'ui/components/providers/CurrentUserProvider';
import { NonceProvider } from 'ui/components/providers/NonceProvider';
import "ui/styles.css";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <WagmiConfig client={client}>
        <ApolloProvider client={apolloClient}>
          <CurrentUserProvider>
            <NonceProvider>
              <Component {...pageProps} />
            </NonceProvider>
          </CurrentUserProvider>
        </ApolloProvider>
      </WagmiConfig>
    </ChakraProvider>
  );
}