const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Order Management", () => {
  let manufacturer, distributor, wholesaler, retailer;
  let registration, ordermanagement;

  beforeEach(async () => {
    [admin, manufacturer, distributor, wholesaler, retailer] =
      await ethers.getSigners();

    const Registration = await ethers.getContractFactory("Registration");
    registration = await Registration.deploy();

    const OrderManagement = await ethers.getContractFactory("OrderManagement");
    ordermanagement = await OrderManagement.deploy(registration.address);

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
  });

  describe("Normal Orders", () => {
    async function generateRandomOrderID(userAddress) {
      const timestamp = Date.now();
      const combinedString = `${userAddress}${timestamp}`;
      const randomNum = Math.floor(Math.random() * 100000);
      const finalString = `${combinedString}${randomNum}`;
      return finalString;
    }

    async function generateRandomAmount() {
      return Math.floor(Math.random() * 100) + 1;
    }

    async function getBlockTimestamp() {
      const blockNumBefore = await ethers.provider.getBlockNumber();
      const blockBefore = await ethers.provider.getBlock(blockNumBefore);
      const timestampBefore = blockBefore.timestamp;
      return timestampBefore;
    }

    async function getOrder(orderID) {
      const result = ordermanagement.getOrder(orderID);
      return result;
    }

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

    async function generateProductInfo() {
      const invoice = generateRandomString();
      const lotID = generateRandomString();
      const sku = generateRandomString();
      return { invoice, lotID, sku };
    }

    it("Create New Order", async () => {
      const orderID = generateRandomOrderID(distributor.address);
      const amount = generateRandomAmount();
      const result = await ordermanagement
        .connect(distributor)
        .createOrder(orderID, manufacturer.address, amount);
      const timestamp = await getBlockTimestamp();

      expect(result)
        .to.emit(ordermanagement, "NewOrder")
        .withArgs(
          orderID,
          manufacturer.address,
          distributor.address,
          amount,
          timestamp
        );
    });

    it("Confirm Order", async () => {
      const orderID = generateRandomOrderID(distributor.address);
      const amount = generateRandomAmount();
      await ordermanagement
        .connect(distributor)
        .createOrder(orderID, manufacturer.address, amount);

      const ProductInfo = await generateProductInfo();
      const invoice = Object.values(ProductInfo)[0];
      const lotID = Object.values(ProductInfo)[1];
      const sku = Object.values(ProductInfo)[2];

      const result = await ordermanagement
        .connect(manufacturer)
        .confirmOrder(orderID, invoice, lotID, sku);

      const timestamp = await getBlockTimestamp();

      expect(result)
        .to.emit(ordermanagement, "OrderStatusChange")
        .withArgs(orderID, timestamp);
    });

    it("Ship Order", async () => {
      const orderID = generateRandomOrderID(distributor.address);
      const amount = generateRandomAmount();
      await ordermanagement
        .connect(distributor)
        .createOrder(orderID, manufacturer.address, amount);

      const ProductInfo = await generateProductInfo();
      const invoice = Object.values(ProductInfo)[0];
      const lotID = Object.values(ProductInfo)[1];
      const sku = Object.values(ProductInfo)[2];
      await ordermanagement
        .connect(manufacturer)
        .confirmOrder(orderID, invoice, lotID, sku);

      const result = await ordermanagement
        .connect(manufacturer)
        .shipOrder(orderID);

      const timestamp = await getBlockTimestamp();

      expect(result)
        .to.emit(ordermanagement, "OrderStatusChange")
        .withArgs(orderID, timestamp, 3);
    });

    it("Accept Order", async () => {
      const orderID = generateRandomOrderID(distributor.address);
      const amount = generateRandomAmount();
      await ordermanagement
        .connect(distributor)
        .createOrder(orderID, manufacturer.address, amount);

      const ProductInfo = await generateProductInfo();
      const invoice = Object.values(ProductInfo)[0];
      const lotID = Object.values(ProductInfo)[1];
      const sku = Object.values(ProductInfo)[2];
      await ordermanagement
        .connect(manufacturer)
        .confirmOrder(orderID, invoice, lotID, sku);

      await ordermanagement.connect(manufacturer).shipOrder(orderID);

      const result = await ordermanagement
        .connect(distributor)
        .acceptOrder(orderID);

      const timestamp = await getBlockTimestamp();

      expect(result)
        .to.emit(ordermanagement, "OrderStatusChange")
        .withArgs(orderID, timestamp);
    });

    it("Reject Order", async () => {
      const orderID = generateRandomOrderID(distributor.address);
      const amount = generateRandomAmount();
      await ordermanagement
        .connect(distributor)
        .createOrder(orderID, manufacturer.address, amount);

      const result = await ordermanagement
        .connect(manufacturer)
        .rejectOrder(orderID);

      const timestamp = await getBlockTimestamp();

      expect(result)
        .to.emit(ordermanagement, "OrderStatusChange")
        .withArgs(orderID, timestamp);
    });

    it("Cancel Order", async () => {
      const orderID = generateRandomOrderID(distributor.address);
      const amount = generateRandomAmount();
      await ordermanagement
        .connect(distributor)
        .createOrder(orderID, manufacturer.address, amount);

      const ProductInfo = await generateProductInfo();
      const invoice = Object.values(ProductInfo)[0];
      const lotID = Object.values(ProductInfo)[1];
      const sku = Object.values(ProductInfo)[2];
      await ordermanagement
        .connect(manufacturer)
        .confirmOrder(orderID, invoice, lotID, sku);

      const result = await ordermanagement
        .connect(distributor)
        .cancelOrder(orderID);

      const timestamp = await getBlockTimestamp();

      expect(result)
        .to.emit(ordermanagement, "OrderStatusChange")
        .withArgs(orderID, timestamp);
    });

    it("Onhold Order", async () => {
      const orderID = generateRandomOrderID(distributor.address);
      const amount = generateRandomAmount();
      await ordermanagement
        .connect(distributor)
        .createOrder(orderID, manufacturer.address, amount);

      const ProductInfo = await generateProductInfo();
      const invoice = Object.values(ProductInfo)[0];
      const lotID = Object.values(ProductInfo)[1];
      const sku = Object.values(ProductInfo)[2];
      await ordermanagement
        .connect(manufacturer)
        .confirmOrder(orderID, invoice, lotID, sku);

      await ordermanagement.connect(manufacturer).shipOrder(orderID);

      const result = await ordermanagement
        .connect(manufacturer)
        .onholdOrder(orderID);

      const timestamp = await getBlockTimestamp();

      expect(result)
        .to.emit(ordermanagement, "OrderStatusChange")
        .withArgs(orderID, timestamp);
    });
  });
});
