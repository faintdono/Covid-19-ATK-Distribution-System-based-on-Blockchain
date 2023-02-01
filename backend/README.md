# Covid-19-ATK-Distribution-System-based-on-Blockchain
Covid-19 Antigen Test Kit Distribution System based-on Blockchain Technology
## Usage
You can use these command to deploy and using hardhat console to interact with contract if you are using besu as your node.

```
npx hardhat compile
npx hardhat run scripts/deploy.js
npx console --network besu_dev
```

In hardhat console

```
const Product = await ethers.getContractFactory('Manufacturer');
const product = await Product.attach('Deploy Address');
await product.genProduct('your data');
await product.getLotID();
await product.getProduct('LotID');
```
