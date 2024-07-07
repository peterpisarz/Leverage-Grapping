require('dotenv').config()
require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-verify");

const privateKey = process.env.PRIVATE_KEY || ""

module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
    },
  },
  networks: {
    hardhat: {
      forking: {
        url: `https://base-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_BASE}`,
        accounts: [process.env.PRIVATE_KEY]
      }
    },
    base: {
      url: `https://base-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_BASE}`,
      accounts: [privateKey],
    },
    sepolia: {
      url: `https://base-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_BASE}`,
      accounts: [privateKey],
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  },
};
