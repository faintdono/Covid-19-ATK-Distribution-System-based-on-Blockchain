const { expect } = require("chai");
const { ethers, assert } = require("hardhat");

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
    const hash = web3.utils.soliditySha3(
      { type: "address", value: owner },
      { type: "address", value: sellerAddress },
      { type: "string", value: orderID },
      { type: "string", value: invoice },
      { type: "string", value: lotID },
      { type: "string", value: sku },
      { type: "bytes32", value: key },
      { type: "uint256", value: amount }
    );

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

    it("Generate LedgerKey", async () => {
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
      const firstKey = keys[0];
      const ledger = await getLedger(firstKey);
      let Bytes0 = ethers.utils.formatBytes32String("");

      const testValue = mockUpLedgerKey(
        ledger[0],
        ledger[2],
        ledger[3],
        ledger[4],
        lotID,
        sku,
        Bytes0,
        ledger[6]
      );

      expect(firstKey).to.equal(testValue);
    });

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

    it("Get RootKey", async () => {
      supplychain
        .connect(manufacturer)
        .addProduct(
          lotID,
          sku,
          manufacturerName,
          manufacturingDate,
          expiryDate,
          100
        );
      const keys1 = await getUserKey(manufacturer.address);
      const RootKey = keys1[0];

      let orderID = "1";
      let amount = 20;
      let invoice = "";

      await ordermanagement
        .connect(distributor)
        .createOrder(orderID, manufacturer.address, amount);

      await ordermanagement
        .connect(manufacturer)
        .confirmOrder(orderID, invoice, lotID, sku);

      await supplychain.connect(manufacturer).sellProduct(orderID, RootKey);

      const keys2 = await getUserKey(distributor.address);
      const last2Key = keys2[0];

      orderID = "2";
      amount = 10;

      await ordermanagement
        .connect(wholesaler)
        .createOrder(orderID, distributor.address, amount);

      await ordermanagement
        .connect(distributor)
        .confirmOrder(orderID, invoice, lotID, sku);

      await supplychain.connect(distributor).sellProduct(orderID, RootKey);

      const keys3 = await getUserKey(wholesaler.address);
      const last3Key = keys3[0];

      expect(await getRootKey(last2Key)).to.equal(RootKey);
      expect(await getRootKey(last3Key)).to.equal(RootKey);
    });
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
