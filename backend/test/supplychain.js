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

  function checkObjects(obj1, obj2) {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) {
      return false;
    }

    // Check if keys are the same
    for (let i = 0; i < keys1.length; i++) {
      const key = keys1[i];

      if (obj1[key] !== obj2[key]) {
        return false;
      }
    }

    // If all checks passed, return true
    return true;
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

  function mockUpgetLedger(
    owner,
    role,
    sellerAddress,
    orderID,
    invoice,
    key,
    amount
  ) {
    const obj = [owner, role, sellerAddress, orderID, invoice, key, amount];
    obj.owner = owner;
    obj.role = role;
    obj.sellerAddress = sellerAddress;
    obj.orderID = orderID;
    obj.invoice = invoice;
    obj.key = key;
    obj.amount = amount;

    return obj;
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

  async function generateRandomOrderID() {
    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    let nonce = await ordermanagement.getNonce();
    nonce = nonce.toString();
    const step = nonce.length / 3;
    let finalString = "OD";
    for (var x = 0; x < 3; x++) {
      var start = step * x;
      var end = start + step;
      var part = nonce.substring(start, end);
      finalString += part;
      if (x == 0) {
        finalString += year;
      } else if (x == 1) {
        finalString += month;
      } else if (x == 2) {
        finalString += day;
      }
    }
    return finalString;
  }

  beforeEach(async () => {
    //Add address into roles
    [admin, manufacturer, distributor, wholesaler, retailer] =
      await ethers.getSigners();

    const Registration = await ethers.getContractFactory("Registration");
    registration = await Registration.deploy();

    registration.addUser(
      123456789,
      "manufacturer",
      manufacturer.address,
      "test",
      "test@examples.com"
    );
    registration.addUser(
      223456789,
      "distributor",
      distributor.address,
      "test",
      "test@examples.com"
    );
    registration.addUser(
      323456789,
      "wholesaler",
      wholesaler.address,
      "test",
      "test@examples.com"
    );
    registration.addUser(
      423456789,
      "retailer",
      retailer.address,
      "test",
      "test@examples.com"
    );

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

    /*
    it("Get Ledger", async () => {
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

      const manufacturerKey = getUserKey(manufacturer.address);
      const rootKey = manufacturerKey[0];

      let orderID = "1";
      let invoice = "";

      await ordermanagement
        .connect(distributor)
        .createOrder(orderID, manufacturer.address, productAmount);

      await ordermanagement
        .connect(manufacturer)
        .confirmOrder(orderID, invoice, lotID, sku);

      await supplychain.connect(manufacturer).sellProduct(orderID, rootKey);

      const distributorKey = getUserKey(distributor.address);
      const leafKey = distributorKey[0];

      const rawLedger = getLedger(leafKey);
      const ledger = convertBigNumber(rawLedger);

      console.log(ledger);

      const mockUpLedger = mockUpgetLedger(
        distributor.address,
        1,
        manufacturer.address,
        orderID,
        invoice,
        rootKey,
        productAmount
      );

      console.log('hi');
      console.log(mockUpLedger);

      const result = checkObjects(ledger, mockUpLedger);
      expect(result).to.be.equal(true);
    });
*/

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

      const manufacturerKey = await getUserKey(manufacturer.address);
      const ledgerKey = manufacturerKey[0];

      let Bytes0 = ethers.utils.formatBytes32String("");

      const mockUpKey = mockUpLedgerKey(
        manufacturer.address,
        "0x0000000000000000000000000000000000000000",
        "",
        "",
        lotID,
        sku,
        Bytes0, //root key
        productAmount
      );

      expect(ledgerKey).to.equal(mockUpKey);
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
      const manufacturerKey = await getUserKey(manufacturer.address);
      const rootKey = manufacturerKey[0];

      let orderID = "1";
      let amount = 20;
      let invoice = "";

      await ordermanagement
        .connect(distributor)
        .createOrder(orderID, manufacturer.address, amount);

      await ordermanagement
        .connect(manufacturer)
        .confirmOrder(orderID, invoice, lotID, sku);

      await supplychain.connect(manufacturer).sellProduct(orderID, rootKey);

      const distributorKey = await getUserKey(distributor.address);
      const firstKey = distributorKey[0];

      await ordermanagement.connect(manufacturer).shipOrder(orderID);
      await ordermanagement.connect(distributor).acceptOrder(orderID);
      await supplychain.connect(distributor).updateLedgerStatus(firstKey);

      orderID = "2";
      amount = 10;

      await ordermanagement
        .connect(wholesaler)
        .createOrder(orderID, distributor.address, amount);

      await ordermanagement
        .connect(distributor)
        .confirmOrder(orderID, invoice, lotID, sku);

      await supplychain.connect(distributor).sellProduct(orderID, firstKey);

      const wholesalerKey = await getUserKey(wholesaler.address);
      const secondKey = wholesalerKey[0];

      const firstRootKey = await getRootKey(firstKey);
      const secondRootKey = await getRootKey(secondKey);
      const trytoget = await getRootKey(rootKey);
      // console.log("rootOfroot:",trytoget);
      // console.log("rootKey:",rootKey);
      // console.log("firstKey:", firstKey);
      // console.log("secondKey:", secondKey);
      // console.log("firstRootKey:", firstRootKey);
      // console.log("secondRootKey:", secondRootKey);
      const result = firstRootKey === rootKey && secondRootKey === rootKey;

      expect(result).to.be.equal(true);
    });

    it("Verify Product", async () => {
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
      const manufacturerKey = await getUserKey(manufacturer.address);
      const rootKey = manufacturerKey[0];

      let orderID = await generateRandomOrderID();
      let amount = 20;
      let invoice = "";

      await ordermanagement
        .connect(distributor)
        .createOrder(orderID, manufacturer.address, amount);

      await ordermanagement
        .connect(manufacturer)
        .confirmOrder(orderID, invoice, lotID, sku);

      await supplychain.connect(manufacturer).sellProduct(orderID, rootKey);

      const distributorKey = await getUserKey(distributor.address);
      const firstKey = distributorKey[0];
      const result = await supplychain
        .connect(manufacturer)
        .verifyProduct(lotID, sku, manufacturerName, expiryDate, firstKey);

      expect(result).to.be.equal(true);
    });
  });
});
