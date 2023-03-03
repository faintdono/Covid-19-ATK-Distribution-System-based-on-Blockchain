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

        supplychain.addProduct(1, 2, 3, 4, 5)

    })

    describe('Creating products', () => {
        it('Manufacturer create new product', async () => {
            const result = supplychain.addProduct(2, 3, 4, 5, 6)
            expect(result).to.emit(supplychain, 'NewProduct')
        })
    })
})

describe('Order Management', () => {
    let ordermanagement

    beforeEach(async () => {

        [admin, manufacturer, distributor, wholesaler, retailer] = await ethers.getSigners()

        const Registration = await ethers.getContractFactory('Registration')
        registration = await Registration.deploy()

        const OrderManagement = await ethers.getContractFactory('OrderManagement');
        ordermanagement = await OrderManagement.deploy(registration.address)

        registration.addUser("manufacturer", manufacturer.address)
        registration.addUser("distributor", distributor.address)
        registration.addUser("wholesaler", wholesaler.address)
        registration.addUser("retailer", retailer.address)
    })

    describe('Normal Orders', () => {

        async function generateRandomOrderID(userAddress) {
            const timestamp = Date.now();
            const combinedString = `${userAddress}${timestamp}`;
            const randomNum = Math.floor(Math.random() * 100000);
            const finalString = `${combinedString}${randomNum}`;
            return finalString;
        }

        it('Create New Order', async () => {
            const orderID = generateRandomOrderID(distributor.address)
            const result = ordermanagement
                .connect(distributor)
                .createOrder(orderID, manufacturer.address, 1)
            expect(result)
                .to.emit(ordermanagement, 'NewOrder')
                .withArgs(orderID, manufacturer.address, 1)
        })

        it('Confirm Order', async () => {
            const orderID = generateRandomOrderID(distributor.address)
            ordermanagement.connect(distributor).createOrder(orderID, manufacturer.address, 1)
            const result = ordermanagement
                .connect(manufacturer)
                .confirmOrder(orderID)
            expect(result)
                .to.emit(ordermanagement, 'OrderStatusChange')
                .withArgs(orderID)
        })

        it('Ship Order', async () => {
            const orderID = generateRandomOrderID(distributor.address)
            ordermanagement.connect(distributor).createOrder(orderID, manufacturer.address, 1)
            ordermanagement.connect(manufacturer).confirmOrder(orderID)
            const result = ordermanagement
                .connect(manufacturer)
                .shipOrder(orderID)
            expect(result)
                .to.emit(ordermanagement, 'OrderStatusChange')
                .withArgs(orderID)
        })

        it('Accept Order', async () => {
            const orderID = generateRandomOrderID(distributor.address)
            ordermanagement.connect(distributor).createOrder(orderID, manufacturer.address, 1)
            ordermanagement.connect(manufacturer).confirmOrder(orderID)
            ordermanagement.connect(manufacturer).shipOrder(orderID)
            const result = ordermanagement
                .connect(distributor)
                .acceptOrder(orderID)
            expect(result)
                .to.emit(ordermanagement, 'OrderStatusChange')
                .withArgs(orderID)
        })

        it('Reject Order', async () => {
            const orderID = generateRandomOrderID(distributor.address)
            ordermanagement.connect(distributor).createOrder(orderID, manufacturer.address, 1)
            ordermanagement.connect(manufacturer).confirmOrder(orderID)
            const result = ordermanagement
                .connect(manufacturer)
                .rejectOrder(orderID)
            expect(result)
                .to.emit(ordermanagement, 'OrderStatusChange')
                .withArgs(orderID)
        })

        //Why Cancel look like Reject Order above ? dev might need to fix this ?

        it('Cancel Order', async () => {
            const orderID = generateRandomOrderID(distributor.address)
            ordermanagement.connect(distributor).createOrder(orderID, manufacturer.address, 1)
            ordermanagement.connect(manufacturer).confirmOrder(orderID)
            const result = ordermanagement
                .connect(manufacturer)
                .cancelOrder(orderID)
            expect(result)
                .to.emit(ordermanagement, 'OrderStatusChange')
                .withArgs(orderID)
        })

        it('Onhold Order', async () => {
            const orderID = generateRandomOrderID(distributor.address)
            ordermanagement.connect(distributor).createOrder(orderID, manufacturer.address, 1)
            ordermanagement.connect(manufacturer).confirmOrder(orderID)
            ordermanagement.connect(manufacturer).shipOrder(orderID)
            const result = ordermanagement
                .connect(manufacturer)
                .onholdOrder(orderID)
            expect(result)
                .to.emit(ordermanagement, 'OrderStatusChange')
                .withArgs(orderID)
        })
    })

    describe('Get Orders', () => {
        async function generateRandomOrderID(userAddress) {
            const timestamp = Date.now();
            const combinedString = `${userAddress}${timestamp}`;
            const randomNum = Math.floor(Math.random() * 100000);
            const finalString = `${combinedString}${randomNum}`;
            return finalString;
        }
        //note for testing 
        //Status [placed --> pending --> shipped --> delivered]
        //rejected = status: pending
        //cancelled = status: pending [something might be wrong about this]
        //onhold = status: shipped
        //returned = ?
    })
})