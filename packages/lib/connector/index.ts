import {
  WagmiConfig,
  createClient,
  configureChains,
  mainnet,
  goerli,
  sepolia,
  Chain,
} from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { infuraProvider } from "wagmi/providers/infura";
import { publicProvider } from "wagmi/providers/public";

import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { InjectedConnector } from "wagmi/connectors/injected";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";

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

// Configure chains & providers with the Alchemy provider.
// Two popular providers are Alchemy (alchemy.com) and Infura (infura.io)
const { chains, provider, webSocketProvider } = configureChains(
  [...getSupportedChain()],
  [
    infuraProvider({ apiKey: process.env.NEXT_PUBLIC_INFURA_API_TOKEN! }),
    publicProvider(),
  ]
);

// Set up client
const client: any = createClient({
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
    //     shimDisconnect: true,
    //   },
    // }),
  ],
  provider,
  webSocketProvider,
});

export default client;
