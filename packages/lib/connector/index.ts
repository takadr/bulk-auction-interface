import { Chain, configureChains, createConfig, mainnet, sepolia } from "wagmi";
import { goerli } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { infuraProvider } from "wagmi/providers/infura";
import { publicProvider } from "wagmi/providers/public";

import { CoinbaseWalletConnector } from "@wagmi/core/connectors/coinbaseWallet";
import { InjectedConnector } from "@wagmi/core/connectors/injected";
import { MetaMaskConnector } from "@wagmi/core/connectors/metaMask";
import { WalletConnectConnector } from "@wagmi/core/connectors/walletConnect";

const getSupportedChain = (): Chain[] => {
  if (process.env.NEXT_PUBLIC_CHAIN_ID === "1") {
    return [mainnet];
  } else if (process.env.NEXT_PUBLIC_CHAIN_ID === "5") {
    return [goerli];
  } else if (process.env.NEXT_PUBLIC_CHAIN_ID === "11155111") {
    return [sepolia];
  }
  return [sepolia];
};

const { chains, publicClient, webSocketPublicClient } = configureChains<Chain>(
  getSupportedChain(),
  [
    infuraProvider({ apiKey: process.env.NEXT_PUBLIC_INFURA_API_TOKEN! }),
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY! }),
    publicProvider(),
  ],
);

const config: any = createConfig({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: "DFGC Bulksale Maker",
      },
    }),
    new WalletConnectConnector({
      chains,
      options: {
        projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_ID!,
        qrModalOptions: {
          themeVariables: {
            "--wcm-z-index": "2000",
          },
        },
      },
    }),
    // new InjectedConnector({
    //   chains,
    //   options: {
    //     name: 'Injected',
    //     shimDisconnect: false,
    //   },
    // }),
  ],
  publicClient,
  webSocketPublicClient,
});

export default config;
