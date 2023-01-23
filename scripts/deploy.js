require("dotenv").config();

async function main() {
  const { besu_dev_acc_priv1, besu_dev_acc_priv2 } = process.env;
  const provider = new ethers.providers.JsonRpcProvider(
    "http://localhost:18545"
  );
  const signer = new ethers.Wallet(besu_dev_acc_priv1, provider);
  const deployer = signer;

  console.log("Deploying contracts with the account:", deployer.address);
  const Product = await ethers.getContractFactory("Manufacturer");
  const product = await Product.deploy();
  console.log("Contract address:", product.address);
  
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
