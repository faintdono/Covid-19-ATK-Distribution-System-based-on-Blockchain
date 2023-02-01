# Usage
You can use these command to deploy and using hardhat console to interact with contract

```
npx hardhat compile
npx hardhat run scripts/deploy.js
npx console --network yournetwork //default network is hardhat localhost
```

In hardhat console

```
const Product = await ethers.getContractFactory('Product');
const product = await Product.attach('Deploy Address');
await product.createProduct('your data');
```
