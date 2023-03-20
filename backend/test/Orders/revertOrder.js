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

    registration.addUser(123456789, "manufacturer", manufacturer.address);
    registration.addUser(223456789, "distributor", distributor.address);
    registration.addUser(323456789, "wholesaler", wholesaler.address);
  });

  describe("Order NotABLE", () => {
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

    function generateRandomOrderID(userAddress) {
      const timestamp = Date.now();
      const combinedString = `${userAddress}${timestamp}`;
      const randomNum = Math.floor(Math.random() * 100000);
      const finalString = `${combinedString}${randomNum}`;
      return finalString;
    }

    function generateRandomAmount() {
      return Math.floor(Math.random() * 100) + 1;
    }

    async function generateProductInfo() {
      const invoice = generateRandomString();
      const lotID = generateRandomString();
      const sku = generateRandomString();
      return { invoice, lotID, sku };
    }

    it("[REVERT] Only receiver can use this function", async () => {
      const orderID = generateRandomOrderID(distributor.address);
      const amount = generateRandomAmount();
      await ordermanagement
        .connect(distributor)
        .createOrder(orderID, manufacturer.address, amount);

      const ProductInfo = await generateProductInfo();
      const invoice = Object.values(ProductInfo)[0];
      const lotID = Object.values(ProductInfo)[1];
      const sku = Object.values(ProductInfo)[2];

      const result = ordermanagement
        .connect(distributor)
        .confirmOrder(orderID, invoice, lotID, sku);

      await expect(result).to.be.revertedWith(
        "Only order's receiver can use this function"
      );
    });

    it("[REVERT] Only sender can use this function", async () => {
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
      const result = ordermanagement.connect(manufacturer).acceptOrder(orderID);

      await expect(result).to.be.revertedWith(
        "Only order's sender can use this function"
      );
    });

    it("[REVERT] Order is not confirmable", async () => {
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
      const result = ordermanagement
        .connect(manufacturer)
        .confirmOrder(orderID, invoice, lotID, sku);

      await expect(result).to.be.revertedWith("Order is not confirmable");
    });

    it("[REVERT] Order is not rejectable", async () => {
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

      const result = ordermanagement.connect(manufacturer).rejectOrder(orderID);

      await expect(result).to.be.revertedWith("Order is not rejectable");
    });

    it("[REVERT] Order is not shipable", async () => {
      const orderID = generateRandomOrderID(distributor.address);
      const amount = generateRandomAmount();
      await ordermanagement
        .connect(distributor)
        .createOrder(orderID, manufacturer.address, amount);

      const result = ordermanagement.connect(manufacturer).shipOrder(orderID);

      await expect(result).to.be.revertedWith("Order is not shipable");
    });

    it("[REVERT] Order is not acceptable", async () => {
      const orderID = generateRandomOrderID(distributor.address);
      const amount = generateRandomAmount();
      await ordermanagement
        .connect(distributor)
        .createOrder(orderID, manufacturer.address, amount);

      const result = ordermanagement.connect(distributor).acceptOrder(orderID);

      await expect(result).to.be.revertedWith("Order is not acceptable");
    });

    it("[REVERT] Order is not cancellable", async () => {
      const orderID = generateRandomOrderID(distributor.address);
      const amount = generateRandomAmount();
      await ordermanagement
        .connect(distributor)
        .createOrder(orderID, manufacturer.address, amount);

      const result = ordermanagement.connect(distributor).cancelOrder(orderID);

      await expect(result).to.be.revertedWith("Order is not cancellable");
    });

    it("[REVERT] Order is not onholdable", async () => {
      const orderID = generateRandomOrderID(distributor.address);
      const amount = generateRandomAmount();
      await ordermanagement
        .connect(distributor)
        .createOrder(orderID, manufacturer.address, amount);

      const result = await ordermanagement
        .connect(manufacturer)
        .onholdOrder(orderID);

      expect(result).to.be.revertedWith("Order is not onholdable");
    });

    it("[REVERT] Only registered users can call this function", async () => {
      const orderID = generateRandomOrderID(distributor.address);
      const amount = generateRandomAmount();
      const result = ordermanagement
        .connect(retailer)
        .createOrder(orderID, manufacturer.address, amount);

      await expect(result).to.be.revertedWith(
        "Only registered users can call this function."
      );
    });
  });
});
