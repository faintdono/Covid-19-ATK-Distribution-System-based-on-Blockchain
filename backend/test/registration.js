const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Registration", () => {
  let manufacturer, distributor, wholesaler, retailer;
  let registration;

  beforeEach(async () => {
    [admin, manufacturer, distributor, wholesaler, retailer] =
      await ethers.getSigners();

    const Registration = await ethers.getContractFactory("Registration");
    registration = await Registration.deploy();
  });

  describe("Add accounts", () => {
    it("add manufacturer", async () => {
      const result = registration.addUser(
        123456789,
        "manufacturer",
        manufacturer.address
      );
      await expect(result)
        .to.emit(registration, "UserAdded")
        .withArgs(manufacturer.address);
    });

    it("add distributor", async () => {
      const result = registration.addUser(
        223456789,
        "distributor",
        distributor.address
      );
      await expect(result)
        .to.emit(registration, "UserAdded")
        .withArgs(distributor.address);
    });

    it("add wholesaler", async () => {
      const result = registration.addUser(
        323456789,
        "wholesaler",
        wholesaler.address
      );
      await expect(result)
        .to.emit(registration, "UserAdded")
        .withArgs(wholesaler.address);
    });

    it("add retailer", async () => {
      const result = registration.addUser(
        423456789,
        "retailer",
        retailer.address
      );
      await expect(result)
        .to.emit(registration, "UserAdded")
        .withArgs(retailer.address);
    });

    it("[REVERT] add existing address into the same role", async () => {
      registration.addUser(423456789, "retailer", retailer.address);
      const result = registration.addUser(
        423456789,
        "retailer",
        retailer.address
      );
      await expect(result).to.be.reverted;
    });

    // write Registration.sol to detect existing address into other roles too.
    /*
        it('add existing address into others role role', async () => {
            registration.addUser("manufacturer", retailer.address)
            registration.addUser("retailer", retailer.address)
            const result = registration.getUserDetails(retailer.address)
                .then(function (result) {
                    console.log(result)
                });
        });
        */
  });

  describe("Get user details", () => {
    async function getUserDetails(address) {
      const result = registration.getUserDetails(address);
      return result;
    }

    async function mockUpUserDetails(role, address) {
      let num;

      if (role === "manufacturer") {
        num = 0;
      } else if (role === "distributor") {
        num = 1;
      } else if (role === "wholesaler") {
        num = 2;
      } else if (role === "retailer") {
        num = 3;
      }

      const obj = [num, address, "", ""];
      obj.role = num;
      obj.id_ = address;
      obj.name = "";
      obj.email = "";

      return obj;
    }

    it("get manufacturer", async () => {
      registration.addUser("manufacturer", manufacturer.address);
      const detail = await getUserDetails(manufacturer.address);
      const mockUp = await mockUpUserDetails(
        "manufacturer",
        manufacturer.address,
        123456789
      );
      const result = JSON.stringify.detail === JSON.stringify.mockUp;
      expect(result).to.be.equal(true);
    });

    it("get distributor", async () => {
      registration.addUser("distributor", distributor.address);
      const detail = await getUserDetails(distributor.address);
      const mockUp = await mockUpUserDetails(
        "distributor",
        distributor.address,
        223456789
      );
      const result = JSON.stringify.detail === JSON.stringify.mockUp;
      expect(result).to.be.equal(true);
    });

    it("get wholesaler", async () => {
      registration.addUser("wholesaler", wholesaler.address);
      const detail = await getUserDetails(wholesaler.address);
      const mockUp = await mockUpUserDetails(
        "wholesaler",
        wholesaler.address,
        323456789
      );
      const result = JSON.stringify.detail === JSON.stringify.mockUp;
      expect(result).to.be.equal(true);
    });

    it("get retailer", async () => {
      registration.addUser("retailer", retailer.address);
      const detail = await getUserDetails(retailer.address);
      const mockUp = await mockUpUserDetails(
        "retailer",
        retailer.address,
        423456789
      );
      const result = JSON.stringify.detail === JSON.stringify.mockUp;
      expect(result).to.be.equal(true);
    });
  });

  describe("Others function", () => {
    it("reject non-admin to add account", async () => {
      await expect(
        registration
          .connect(manufacturer)
          .addUser(123456789, "manufacturer", manufacturer.address)
      ).to.be.rejectedWith("Only owner can call this function.");
    });
  });
});
