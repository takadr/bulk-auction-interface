import "@nomicfoundation/hardhat-ethers";
import * as dotenv from "dotenv";
dotenv.config();
const { NEXT_PUBLIC_INFURA_API_TOKEN, PRIVATE_KEY } = process.env;

const config = {
  networks: {
    mainnet: {
      url: `https://mainnet.infura.io/v3/${NEXT_PUBLIC_INFURA_API_TOKEN}`,
      accounts: [`${PRIVATE_KEY}`],
      saveDeployments: true,
    },
    goerli: {
      url: `https://goerli.infura.io/v3/${NEXT_PUBLIC_INFURA_API_TOKEN}`,
      accounts: [`${PRIVATE_KEY}`],
      saveDeployments: true,
    },
    sepolia: {
      url: `https://sepolia.infura.io/v3/${NEXT_PUBLIC_INFURA_API_TOKEN}`,
      accounts: [`${PRIVATE_KEY}`],
      saveDeployments: true,
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      accounts: [`${PRIVATE_KEY}`],
    },
    hardhat: {
      forking: {
        url: `https://sepolia.infura.io/v3/${NEXT_PUBLIC_INFURA_API_TOKEN}`,
      },
    },
  },
};

module.exports = config;
