const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('Registration', () => {
    let manufacturer, distributor, wholesaler, retailer
    let registration

    beforeEach(async () => {

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

        it('[REVERT] add existing address into the same role', async () => {
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

    describe('Get user details', () => {

        async function getUserDetails(address) {
            const result = registration.getUserDetails(address)
            return result;
        }

        async function mockUpUserDetails(role, address) {
            let num;

            if (role === 'manufacturer') {
                num = 0;
            }
            else if (role === 'distributor') {
                num = 1;
            }
            else if (role === 'wholesaler') {
                num = 2;
            }
            else if (role === 'retailer') {
                num = 3;
            }

            const obj = [
                num,
                address,
                '',
                '',
            ];
            obj.role = num;
            obj.id_ = address;
            obj.name = '';
            obj.email = '';

            return obj
        }

        it('get manufacturer', async () => {
            registration.addUser("manufacturer", manufacturer.address)
            const detail = await getUserDetails(manufacturer.address);
            const mockUp = await mockUpUserDetails('manufacturer', manufacturer.address);
            const result = (JSON.stringify.detail === JSON.stringify.mockUp)
            expect(result).to.be.equal(true)
        });

        it('get distributor', async () => {
            registration.addUser("distributor", distributor.address)
            const detail = await getUserDetails(distributor.address);
            const mockUp = await mockUpUserDetails('distributor', distributor.address);
            const result = (JSON.stringify.detail === JSON.stringify.mockUp)
            expect(result).to.be.equal(true)
        });

        it('get wholesaler', async () => {
            registration.addUser("wholesaler", wholesaler.address)
            const detail = await getUserDetails(wholesaler.address);
            const mockUp = await mockUpUserDetails('wholesaler', wholesaler.address);
            const result = (JSON.stringify.detail === JSON.stringify.mockUp)
            expect(result).to.be.equal(true)
        });

        it('get retailer', async () => {
            registration.addUser("retailer", retailer.address)
            const detail = await getUserDetails(retailer.address);
            const mockUp = await mockUpUserDetails('retailer', retailer.address);
            const result = (JSON.stringify.detail === JSON.stringify.mockUp)
            expect(result).to.be.equal(true)
        });
    })

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
    let registration, supplychain, ordermanagement
    let lotID, sku, manufacturerName, manufacturingDate, expiryDate, productAmount

    function generateRandomString() {
        const length = 10; // or any other desired length
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
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
        [admin, manufacturer, distributor, wholesaler, retailer] = await ethers.getSigners()

        const Registration = await ethers.getContractFactory('Registration')
        registration = await Registration.deploy()

        registration.addUser("manufacturer", manufacturer.address)
        registration.addUser("distributor", distributor.address)
        registration.addUser("wholesaler", wholesaler.address)
        registration.addUser("retailer", retailer.address)

        const OrderManagement = await ethers.getContractFactory('OrderManagement')
        ordermanagement = await OrderManagement.deploy(registration.address)

        const SupplyChain = await ethers.getContractFactory('SupplyChain');
        supplychain = await SupplyChain.deploy(registration.address, ordermanagement.address)

        lotID = generateRandomString()
        sku = generateRandomString()
        manufacturerName = generateRandomString()
        manufacturingDate = generateRandomString()
        expiryDate = generateRandomString()
        productAmount = generateRandomAmount()

        //addProduct("lotID", "sku", "manufacturerName", "manufacturingDate", "expiryDate", "productAmount")

        supplychain.connect(manufacturer).addProduct(lotID, sku, manufacturerName, manufacturingDate, expiryDate, productAmount)

    })

    describe('Create new product', () => {
        it('Manufacturer create new product', async () => {
            const result = supplychain.connect(manufacturer).addProduct(lotID, sku, manufacturerName, manufacturingDate, expiryDate, productAmount)
            expect(result).to.emit(supplychain, 'NewProduct')
        })

        it('[REVERT] Distributor create new product', async () => {
            const result = supplychain.connect(distributor).addProduct(lotID, sku, manufacturerName, manufacturingDate, expiryDate, productAmount)
            expect(result).to.be.revertedWith('Only manufacturer can add')
        })

        it('[REVERT] Wholesaler create new product', async () => {
            const result = supplychain.connect(wholesaler).addProduct(lotID, sku, manufacturerName, manufacturingDate, expiryDate, productAmount)
            expect(result).to.be.revertedWith('Only manufacturer can add')
        })

        it('[REVERT] Retailer create new product', async () => {
            const result = supplychain.connect(retailer).addProduct(lotID, sku, manufacturerName, manufacturingDate, expiryDate, productAmount)
            expect(result).to.be.revertedWith('Only manufacturer can add')
        })
    })

    describe('Sell Product', () => {

        it('Get Order', async () => {
            const result = supplychain.connect(manufacturer).addProduct(lotID, sku, manufacturerName, manufacturingDate, expiryDate, productAmount)
            expect(result).to.emit(supplychain, 'NewProduct')
        })
    })
})