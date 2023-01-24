const { ethers } = require("hardhat");

require("dotenv").config();

async function main() {
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
