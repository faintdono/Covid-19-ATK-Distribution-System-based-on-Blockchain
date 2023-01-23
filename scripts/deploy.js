async function main() {
  const provider = new ethers.providers.JsonRpcProvider(
    "http://localhost:18545"
  );
  const signer = new ethers.Wallet(
    "c87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3",
    provider
  );
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
