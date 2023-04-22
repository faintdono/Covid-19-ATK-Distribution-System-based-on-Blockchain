require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-truffle5");
require("@nomiclabs/hardhat-ethers");
require("dotenv").config();

const {
ACC_PRIV1,
ACC_PRIV2,
ACC_PRIV3,
ACC_PRIV4,
} = process.env;

const { task } = require("hardhat/config");

task("accounts", "Prints the list of accounts", async () => {
  const accounts = await ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

module.exports = {
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
    },
  },
  networks: {
    sepolia: {
      url: "https://goerli.infura.io/v3/9352c4ea35594880b179f70ece40051e",
      accounts: [
        `${ACC_PRIV1}`,
        `${ACC_PRIV2}`,
        `${ACC_PRIV3}`,
        `${ACC_PRIV4}`,
      ],
    },
  },
};
