const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Supply Chain", () => {
  let manufacturer, distributor, wholesaler, retailer;
  let registration, supplychain, ordermanagement;
  let lotID,
    sku,
    manufacturerName,
    manufacturingDate,
    expiryDate,
    productAmount;

  function generateRandomString() {
    const length = 10; // or any other desired length
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters[randomIndex];
    }
    return result;
  }

  async function getUserKey(address) {
    const result = supplychain.getUserKey(address);
    return result;
  }

  async function getRootKey(address) {
    const result = supplychain.getRootKey(address);
    return result;
  }

  async function getLedger(address) {
    const result = supplychain.getLedger(address);
    return result;
  }

  function generateRandomAmount() {
    return Math.floor(Math.random() * 100) + 1;
  }

  function mockUpLedgerKey(
    owner,
    sellerAddress,
    orderID,
    invoice,
    lotID,
    sku,
    key,
    amount
  ) {
    const encoded = web3.eth.abi.encodeParameters(
      [
        "address",
        "address",
        "string",
        "string",
        "string",
        "string",
        "bytes32",
        "uint256",
      ],
      [owner, sellerAddress, orderID, invoice, lotID, sku, key, amount]
    );
    const hash = web3.utils.sha3(encoded, { encoding: "hex" });

    return hash;
  }

  function convertBigNumber(obj) {
    const obj2 = [];
    for (const key in obj) {
      if (typeof obj[key] === "object") {
        obj2[key] = obj[key].toNumber();
      } else {
        obj2[key] = obj[key];
      }
    }
    return obj2;
  }

  async function generateRandomOrderID(userAddress) {
    const timestamp = Date.now();
    const combinedString = `${userAddress}${timestamp}`;
    const randomNum = Math.floor(Math.random() * 100000);
    const finalString = `${combinedString}${randomNum}`;
    return finalString;
  }

  beforeEach(async () => {
    //Add address into roles
    [admin, manufacturer, distributor, wholesaler, retailer] =
      await ethers.getSigners();

    const Registration = await ethers.getContractFactory("Registration");
    registration = await Registration.deploy();

    registration.addUser(123456789, "manufacturer", manufacturer.address);
    registration.addUser(223456789, "distributor", distributor.address);
    registration.addUser(323456789, "wholesaler", wholesaler.address);
    registration.addUser(423456789, "retailer", retailer.address);

    const OrderManagement = await ethers.getContractFactory("OrderManagement");
    ordermanagement = await OrderManagement.deploy(registration.address);

    const SupplyChain = await ethers.getContractFactory("SupplyChain");
    supplychain = await SupplyChain.deploy(
      registration.address,
      ordermanagement.address
    );

    lotID = generateRandomString();
    sku = generateRandomString();
    manufacturerName = generateRandomString();
    manufacturingDate = generateRandomString();
    expiryDate = generateRandomString();
    productAmount = generateRandomAmount();

    //addProduct("lotID", "sku", "manufacturerName", "manufacturingDate", "expiryDate", "productAmount")

    supplychain
      .connect(manufacturer)
      .addProduct(
        lotID,
        sku,
        manufacturerName,
        manufacturingDate,
        expiryDate,
        productAmount
      );
  });

  describe("Create new product", () => {
    it("Manufacturer create new product", async () => {
      const result = supplychain
        .connect(manufacturer)
        .addProduct(
          lotID,
          sku,
          manufacturerName,
          manufacturingDate,
          expiryDate,
          productAmount
        );
      expect(result).to.emit(supplychain, "NewProduct");
    });

    it("[REVERT] Distributor create new product", async () => {
      const result = supplychain
        .connect(distributor)
        .addProduct(
          lotID,
          sku,
          manufacturerName,
          manufacturingDate,
          expiryDate,
          productAmount
        );
      expect(result).to.be.revertedWith("Only manufacturer can add");
    });

    it("[REVERT] Wholesaler create new product", async () => {
      const result = supplychain
        .connect(wholesaler)
        .addProduct(
          lotID,
          sku,
          manufacturerName,
          manufacturingDate,
          expiryDate,
          productAmount
        );
      expect(result).to.be.revertedWith("Only manufacturer can add");
    });

    it("[REVERT] Retailer create new product", async () => {
      const result = supplychain
        .connect(retailer)
        .addProduct(
          lotID,
          sku,
          manufacturerName,
          manufacturingDate,
          expiryDate,
          productAmount
        );
      expect(result).to.be.revertedWith("Only manufacturer can add");
    });
  });

  describe("Sell Product", () => {
    it("Add new product", async () => {
      const result = supplychain
        .connect(manufacturer)
        .addProduct(
          lotID,
          sku,
          manufacturerName,
          manufacturingDate,
          expiryDate,
          productAmount
        );
      expect(result).to.emit(supplychain, "NewProduct");
    });
  });

  describe("Sell Product", () => {
    it("Get LedgerKey", async () => {
      supplychain
        .connect(manufacturer)
        .addProduct(
          lotID,
          sku,
          manufacturerName,
          manufacturingDate,
          expiryDate,
          productAmount
        );
      const keys = await getUserKey(manufacturer.address);
    });

    it("Sell Product", async () => {
      supplychain
        .connect(manufacturer)
        .addProduct(
          lotID,
          sku,
          manufacturerName,
          manufacturingDate,
          expiryDate,
          productAmount
        );
      const keys = await getUserKey(manufacturer.address);
      const ledger101 = await getLedger(keys[0]);
      const ledger = convertBigNumber(ledger101);
      console.log(ledger[0], ledger[1]);
      //console.log("manufacturer (ROOT) key = ", keys[0]);
      const test = mockUpLedgerKey(
        ledger[0],
        ledger[1],
        ledger[2],
        ledger[3],
        ledger[4],
        ledger[5],
        ledger[6]
      );
      console.log(test);
    });

    /*
        it('Sell Product', async () => {
            supplychain.connect(manufacturer).addProduct(lotID, sku, manufacturerName, manufacturingDate, expiryDate, productAmount)
            const keys = await getUserKey(manufacturer.address)
            const ledger1 = await getLedger(keys[0])
            console.log(ledger1)
            console.log('manufacturer (ROOT) key = ', keys[0])
            console.log('===========================')

            const orderID = generateRandomOrderID(distributor.address)
            await ordermanagement.connect(distributor).createOrder(orderID, manufacturer.address, productAmount)
            // const date = await getBlockTimestamp()

            const invoice = generateRandomString()

            await ordermanagement.connect(manufacturer).confirmOrder(orderID, invoice, lotID, sku)
            await supplychain.connect(manufacturer).sellProduct(orderID, keys[0])

            const keys2 = await getUserKey(distributor.address)
            const ledger2 = await getLedger(keys2[0])
            const rootKey = await getRootKey(keys2[0])
            console.log(ledger2)
            console.log('distributor key = ', keys2[0])
            console.log('get ROOT key = ', rootKey)

        })
        */
  });
});
