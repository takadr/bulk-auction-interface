import "ui/styles.css";
import type { AppProps } from "next/app";
import { ChakraProvider } from '@chakra-ui/react';
import theme from 'ui/themes';
import { WagmiConfig } from 'wagmi';
import client from 'ui/connector'; 
import { CurrentUserProvider } from 'ui/components/providers/CurrentUserProvider';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <WagmiConfig client={client}>
        <CurrentUserProvider>
          <Component {...pageProps} />
        </CurrentUserProvider>
      </WagmiConfig>
    </ChakraProvider>
  );
}