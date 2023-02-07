const { ethers } = require("hardhat");

require("dotenv").config();

async function main() {
  const deployer = await ethers.getSigner();
  console.log("Deploying contracts with the account:", deployer.address);

  const Registration = await ethers.getContractFactory("Registration");
  const reg = await Registration.deploy();
  console.log("Registration address:", reg.address);
  const SupplyChain = await ethers.getContractFactory("SupplyChain");
  const sc = await SupplyChain.deploy(reg.address);
  console.log("SupplyChain address:", sc.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
