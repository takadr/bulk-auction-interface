import type { AppProps } from "next/app";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { WagmiConfig } from "wagmi";
import theme from "ui/themes";
import config from "lib/connector";
import { CurrentUserProvider } from "ui/components/providers/CurrentUserProvider";
import "assets/css/styles.css";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <WagmiConfig config={config}>
        <CurrentUserProvider>
          <ColorModeScript initialColorMode={"dark"} />
          <Component {...pageProps} />
        </CurrentUserProvider>
      </WagmiConfig>
    </ChakraProvider>
  );
}
