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

  async function generateRandomAmount() {
    return Math.floor(Math.random() * 100) + 1;
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
});
