import "@nomicfoundation/hardhat-ethers";
import * as dotenv from 'dotenv';
dotenv.config()
const { INFURA_API_TOKEN, PRIVATE_KEY } = process.env;

const config = {
  networks: {
    mainnet: {
      url: `https://mainnet.infura.io/v3/${INFURA_API_TOKEN}`,
      accounts: [`${PRIVATE_KEY}`],
      saveDeployments: true,
    },
    goerli: {
      url: `https://goerli.infura.io/v3/${INFURA_API_TOKEN}`,
      accounts: [`${PRIVATE_KEY}`],
      saveDeployments: true,
    },
    sepolia: {
      url: `https://sepolia.infura.io/v3/${INFURA_API_TOKEN}`,
      accounts: [`${PRIVATE_KEY}`],
      saveDeployments: true,
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      accounts: ["0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"],
    },
    hardhat: {
        forking: {
            url: `https://sepolia.infura.io/v3/${INFURA_API_TOKEN}`,
        }
    },
  },
};

module.exports = config;