## Project Structure

```
backend
├── README.md
├── node_modules
├── package.json
├── hardhat.config.js
├── .gitignore
└── contracts
|   ├── AccessControl
|   │   ├── DistributorRole.sol
|   │   ├── ManufacturerRole.sol
|   │   ├── RetailerRole.sol
|   │   ├── Roles.sol
|   |   └── WholesalerRole.sol
|   ├── Ordermanagement.sol
|   ├── Products.sol
|   ├── Registration.sol
|   ├── Registry.sol
|   ├── SupplyChain.sol
|   └── Types.sol
├── scripts
|   └── deploy.js
└── test
    └── test.js       
```


## Available Scripts

In the project directory, you can run:

### Hardhat framework
#### `npx hardhat node`
Hardhat Network can run in a stand-alone fashion so that external clients can connect to it. This could be MetaMask, your Dapp front-end, or a script.  
This will start Hardhat Network, and expose it as a JSON-RPC and WebSocket server.  
Then, just connect your wallet or application to http://127.0.0.1:8545.  
If you want to connect Hardhat to this node, you just need to run using --network localhost.  

#### `npx hardhat compile`



#### `npx hardhat test`



#### `npx hardhat run scripts/deploy.js`



#### `npx hardhat accounts`



#### `npx hardhat console`
