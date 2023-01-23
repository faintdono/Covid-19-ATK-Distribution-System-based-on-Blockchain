async function main() {

  const signer = await ethers.getSigner()
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
