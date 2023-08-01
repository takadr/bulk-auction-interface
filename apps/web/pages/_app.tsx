import type { AppProps } from "next/app";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { WagmiConfig } from "wagmi";
import { ApolloProvider } from "@apollo/client";
import theme from "ui/themes";
import config from "lib/connector";
import apolloClient from "lib/apollo/client";
import { CurrentUserProvider } from "ui/components/providers/CurrentUserProvider";
import "assets/css/styles.css";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <WagmiConfig config={config}>
        <ApolloProvider client={apolloClient}>
          <CurrentUserProvider>
            <ColorModeScript initialColorMode={"dark"} />
            <Component {...pageProps} />
          </CurrentUserProvider>
        </ApolloProvider>
      </WagmiConfig>
    </ChakraProvider>
  );
}
