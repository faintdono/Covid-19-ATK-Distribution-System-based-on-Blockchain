require("@nomicfoundation/hardhat-toolbox");
<<<<<<< HEAD
=======
require("@nomiclabs/hardhat-truffle5");
require("@nomiclabs/hardhat-ethers");
require("dotenv").config();
const {besu_dev_acc_priv1, besu_dev_acc_priv2} = process.env;

const { task } = require("hardhat/config");

task("accounts", "Prints the list of accounts", async () => {
  const accounts = await ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});
>>>>>>> main

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
};