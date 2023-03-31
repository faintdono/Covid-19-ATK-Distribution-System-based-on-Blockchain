require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-truffle5");
require("@nomiclabs/hardhat-ethers");
require("dotenv").config();

const {
  GOERLI_ACC_PRIV1,
  GOERLI_ACC_PRIV2,
  GOERLI_ACC_PRIV3,
  GOERLI_ACC_PRIV4,
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
    goerli: {
      url: "https://goerli.infura.io/v3/9352c4ea35594880b179f70ece40051e",
      accounts: [
        `${GOERLI_ACC_PRIV1}`,
        `${GOERLI_ACC_PRIV2}`,
        `${GOERLI_ACC_PRIV3}`,
        `${GOERLI_ACC_PRIV4}`,
        // `${GOERLI_ACC_PRIV5}`,
      ],
    },
  },
};
