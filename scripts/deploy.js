const { ethers } = require("hardhat");

require("dotenv").config();

async function main() {
  // const { besu_dev_acc_priv1, besu_dev_acc_priv2 } = process.env;
  // const provider = new ethers.providers.JsonRpcProvider(
  //   "http://localhost:18545"
  // );
  // const signer = new ethers.Wallet(besu_dev_acc_priv1, provider);
  // const deployer = signer;

  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const Registry = await ethers.getContractFactory("Registry");
  const registry = await Registry.deploy();
  console.log("Registry address:", registry.address);
  const Man = await ethers.getContractFactory("Manufacturer");
  const man = await Man.deploy(registry.address);
  console.log("Manufacturer address:", man.address);
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
