const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('Registration', () => {
    let manufacturer, distributor, wholesaler, retailer
    let registration

    beforeEach(async () => {

        //Add address into roles
        [admin, manufacturer, distributor, wholesaler, retailer] = await ethers.getSigners()

        const Registration = await ethers.getContractFactory('Registration')
        registration = await Registration.deploy()
    })

    describe('Add accounts', () => {
        it('add manufacturer', async () => {
            const result = registration.addUser("manufacturer", manufacturer.address)
            await expect(result)
                .to.emit(registration, 'UserAdded')
                .withArgs(manufacturer.address);
        });

        it('add distributor', async () => {
            const result = registration.addUser("distributor", distributor.address)
            await expect(result)
                .to.emit(registration, 'UserAdded')
                .withArgs(distributor.address);
        });

        it('add wholesaler', async () => {
            const result = registration.addUser("wholesaler", wholesaler.address)
            await expect(result)
                .to.emit(registration, 'UserAdded')
                .withArgs(wholesaler.address);
        });

        it('add retailer', async () => {
            const result = registration.addUser("retailer", retailer.address)
            await expect(result)
                .to.emit(registration, 'UserAdded')
                .withArgs(retailer.address);
        });

        it('reject to add existing address into the same role', async () => {
            registration.addUser("retailer", retailer.address)
            const result = registration.addUser("retailer", retailer.address)
            await expect(result).to.be.reverted
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
    })

    /* IDK how to check inside object but I can make it print lol
    describe('Get user details', () => {
        it('get manufacturer', async () => {
            registration.addUser("manufacturer", manufacturer.address)
            const result = registration.getUserDetails(manufacturer.address)
                .then(function (result) {
                    console.log(result)
                });
            expect(result[0]).to.be.equal(0)
        });
    })
    */

    describe('Others function', () => {
        it('reject non-admin to add account', async () => {
            await expect(registration
                .connect(manufacturer)
                .addUser("manufacturer", manufacturer.address))
                .to.be.rejectedWith("Only owner can call this function.");
        });
    })
})

describe('Supply Chain', () => {
    let manufacturer, distributor, wholesaler, retailer
    let registration, supplychain

    beforeEach(async () => {

        //Add address into roles
        [admin, manufacturer, distributor, wholesaler, retailer] = await ethers.getSigners()

        const Registration = await ethers.getContractFactory('Registration')
        registration = await Registration.deploy()

        registration.addUser("manufacturer", manufacturer.address)
        registration.addUser("distributor", distributor.address)
        registration.addUser("wholesaler", wholesaler.address)
        registration.addUser("retailer", retailer.address)

        const SupplyChain = await ethers.getContractFactory('SupplyChain');
        supplychain = await SupplyChain.deploy(registration.address)

    })

    describe('Creating products', () => {
        it('Manufacturer create new product', async () => {
            const result = supplychain.addProduct(1, 2, 3, 4, 5)
            expect(result).to.emit(supplychain, 'NewProduct')
        })
    })
})