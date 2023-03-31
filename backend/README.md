## Project Structure

```text
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

## Installation

```bash
npm install
```

## Available Scripts

In the project directory, you can run:

### Hardhat framework

#### `Start Hardhat node`

```bash
npx hardhat node
```

#### `Compile smart contracts`

```bash
npx hardhat compile
```

#### `Run tests`

```bash
npx hardhat test
```

#### `Create coverage report`

```bash
npx hardhat coverage
```

#### `Deploy smart contracts`

```bash
npx hardhat run scripts/deploy.js --network localhost
```

#### `List Accounts`

```bash
npx hardhat accounts
```

#### `Access Hardhat console`

```bash
npx hardhat console
```

## Deployment Contract and Use

1. start hardhat node

   ```bash
   npx hardhat node
   ```

2. deploy contract

   ```bash
   npx hardhat run scripts/deploy.js --network localhost
   ```

3. put the contract address in the frontend

   frontend\my-eth-app\packages\contracts\src\address.js

   ```js
   const addresses = {
     registraton: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
     orderManagement: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
     supplyChain: "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9",
   };
   ```

   > note1: the contract address is different for each deployment  

   > note2: Address in the frontend is the address of the contract, not the address of the account

   > note3: Addresses in code block above are mockup address
