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

        it('add existing address same role', async () => {
            registration.addUser("retailer", retailer.address)
            const result = registration.addUser("retailer", retailer.address)
            await expect(result).to.be.reverted
        });

        it('reject non-admin add account', async () => {
            await expect(registration
                .connect(manufacturer)
                .addUser("manufacturer", manufacturer.address))
                .to.be.rejectedWith("Only owner can call this function.");
        });
    })
})