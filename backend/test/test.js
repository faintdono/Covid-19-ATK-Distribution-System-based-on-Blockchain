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

        async function generateRandomAmount() {
            return Math.floor(Math.random() * 100) + 1;
        }

        async function getBlockTimestamp() {
            const blockNumBefore = await ethers.provider.getBlockNumber();
            const blockBefore = await ethers.provider.getBlock(blockNumBefore);
            const timestampBefore = blockBefore.timestamp;
            return timestampBefore
        }

        async function getOrder(orderID) {
            const result = ordermanagement.getOrder(orderID)
            return result;
        }

        async function getProductInfo(orderID) {
            const order = await getOrder(orderID);
            const invoice = Object.values(order)[13];
            const lotID = Object.values(order)[14];
            const sku = Object.values(order)[15];
            return { invoice, lotID, sku };
        }


        it('Create New Order', async () => {
            const orderID = generateRandomOrderID(distributor.address)
            const amount = generateRandomAmount()
            const result = await ordermanagement
                .connect(distributor)
                .createOrder(orderID, manufacturer.address, amount)
            const timestamp = await getBlockTimestamp()
            expect(result)
                .to.emit(ordermanagement, 'NewOrder')
                .withArgs(orderID, manufacturer.address, distributor.address, amount, timestamp)
        })

        it('Confirm Order', async () => {
            const orderID = generateRandomOrderID(distributor.address)
            const amount = generateRandomAmount()
            await ordermanagement.connect(distributor).createOrder(orderID, manufacturer.address, amount)

            const ProductInfo = await getProductInfo(orderID)
            const invoice = Object.values(ProductInfo)[0]
            const lotID = Object.values(ProductInfo)[1]
            const sku = Object.values(ProductInfo)[2]

            const result = await ordermanagement
                .connect(manufacturer)
                .confirmOrder(orderID, invoice, lotID, sku)

            const timestamp = await getBlockTimestamp()

            expect(result)
                .to.emit(ordermanagement, 'OrderStatusChange')
                .withArgs(orderID, timestamp)
        })

        it('Ship Order', async () => {
            const orderID = generateRandomOrderID(distributor.address)
            const amount = generateRandomAmount()
            await ordermanagement.connect(distributor).createOrder(orderID, manufacturer.address, amount)

            const ProductInfo = await getProductInfo(orderID)
            const invoice = Object.values(ProductInfo)[0]
            const lotID = Object.values(ProductInfo)[1]
            const sku = Object.values(ProductInfo)[2]
            await ordermanagement.connect(manufacturer).confirmOrder(orderID, invoice, lotID, sku)

            const result = await ordermanagement
                .connect(manufacturer)
                .shipOrder(orderID)

            const timestamp = await getBlockTimestamp()

            expect(result)
                .to.emit(ordermanagement, 'OrderStatusChange')
                .withArgs(orderID, timestamp)
        })

        it('Accept Order', async () => {
            const orderID = generateRandomOrderID(distributor.address)
            const amount = generateRandomAmount()
            await ordermanagement.connect(distributor).createOrder(orderID, manufacturer.address, amount)

            const ProductInfo = await getProductInfo(orderID)
            const invoice = Object.values(ProductInfo)[0]
            const lotID = Object.values(ProductInfo)[1]
            const sku = Object.values(ProductInfo)[2]
            await ordermanagement.connect(manufacturer).confirmOrder(orderID, invoice, lotID, sku)

            await ordermanagement.connect(manufacturer).shipOrder(orderID)

            const result = await ordermanagement
                .connect(distributor)
                .acceptOrder(orderID)

            const timestamp = await getBlockTimestamp()

            expect(result)
                .to.emit(ordermanagement, 'OrderStatusChange')
                .withArgs(orderID, timestamp)
        })

        it('Reject Order', async () => {
            const orderID = generateRandomOrderID(distributor.address)
            const amount = generateRandomAmount()
            await ordermanagement.connect(distributor).createOrder(orderID, manufacturer.address, amount)

            const ProductInfo = await getProductInfo(orderID)
            const invoice = Object.values(ProductInfo)[0]
            const lotID = Object.values(ProductInfo)[1]
            const sku = Object.values(ProductInfo)[2]
            await ordermanagement.connect(manufacturer).confirmOrder(orderID, invoice, lotID, sku)

            const result = await ordermanagement
                .connect(manufacturer)
                .rejectOrder(orderID)

            const timestamp = await getBlockTimestamp()

            expect(result)
                .to.emit(ordermanagement, 'OrderStatusChange')
                .withArgs(orderID, timestamp)
        })

        it('Cancel Order', async () => {
            const orderID = generateRandomOrderID(distributor.address)
            const amount = generateRandomAmount()
            await ordermanagement.connect(distributor).createOrder(orderID, manufacturer.address, amount)

            const ProductInfo = await getProductInfo(orderID)
            const invoice = Object.values(ProductInfo)[0]
            const lotID = Object.values(ProductInfo)[1]
            const sku = Object.values(ProductInfo)[2]
            await ordermanagement.connect(manufacturer).confirmOrder(orderID, invoice, lotID, sku)

            const result = await ordermanagement
                .connect(distributor)
                .cancelOrder(orderID)

            const timestamp = await getBlockTimestamp()

            expect(result)
                .to.emit(ordermanagement, 'OrderStatusChange')
                .withArgs(orderID, timestamp)
        })

        it('Onhold Order', async () => {
            const orderID = generateRandomOrderID(distributor.address)
            const amount = generateRandomAmount()
            await ordermanagement.connect(distributor).createOrder(orderID, manufacturer.address, amount)

            const ProductInfo = await getProductInfo(orderID)
            const invoice = Object.values(ProductInfo)[0]
            const lotID = Object.values(ProductInfo)[1]
            const sku = Object.values(ProductInfo)[2]
            await ordermanagement.connect(manufacturer).confirmOrder(orderID, invoice, lotID, sku)

            await ordermanagement.connect(manufacturer).shipOrder(orderID)

            const result = await ordermanagement
                .connect(manufacturer)
                .onholdOrder(orderID)

            const timestamp = await getBlockTimestamp()

            expect(result)
                .to.emit(ordermanagement, 'OrderStatusChange')
                .withArgs(orderID, timestamp)
        })
    })

    /*
    describe('Get Orders', () => {
        async function generateRandomOrderIDWithTimestamp(userAddress) {
            const timestamp = Date.now();
            const combinedString = `${userAddress}${timestamp}`;
            const randomNum = Math.floor(Math.random() * 100000);
            const finalString = `${combinedString}${randomNum}`;
            return { finalString, timestamp };
        }

        async function generateRandomAmount() {
            return Math.floor(Math.random() * 100) + 1;
        }

        async function mockUpgetOrder(orderID, buyerAddress, sellerAddress, amount, date) {
            const obj = {
                0: orderID,
                1: buyerAddress,
                2: sellerAddress,
                3: new BigNumber(amount),
                4: new BigNumber(date),
                5: '',
                6: 0,
                7: new BigNumber(date),
                orderID: orderID,
                buyerAddress: buyerAddress,
                sellerAddress: sellerAddress,
                amount: new BigNumber(amount),
                date: new BigNumber(date),
                lotID: '',
                status: 0,
                lastUpdated: new BigNumber(date)
            };
            return obj;
        }

        function convertBigNumberProps(obj) {
            for (let prop in obj) {
                if (obj[prop] instanceof ethers.BigNumber) {
                    //obj[prop] = Object.values(obj[prop])[0];
                    //obj[prop] = parseInt(Object.values(obj[prop])[0], 16)
                    obj[prop] = parseInt(obj[prop].toString(), 10);
                    console.log(obj[prop])
                    console.log(parseInt(Object.values(obj[prop])[0], 16))
                    console.log(typeof (Object.values(obj[prop])[0]))
                } else if (typeof obj[prop] === 'object') {
                    convertBigNumberProps(obj[prop]);
                }
            }
            return obj;
        }

        function convertBigNumberProps(obj) {
            const stack = [obj];
            while (stack.length > 0) {
                const item = stack.pop();
                for (let prop in item) {
                    if (item[prop] instanceof ethers.BigNumber) {
                        item[prop] = parseInt(item[prop].toString(), 10);
                    } else if (typeof item[prop] === 'object') {
                        stack.push(item[prop]);
                    }
                }
            }
            return obj;
        }

        it('get Order', async () => {
            async function getOrder(orderID) {
                const result = ordermanagement.getOrder(orderID)
                return result;
            }

            const orderIDWithTime = await generateRandomOrderIDWithTimestamp(distributor.address)
            const orderID = Object.values(orderIDWithTime)[0]
            const date = Object.values(orderIDWithTime)[1]
            const amount = generateRandomAmount()
            await ordermanagement.connect(distributor).createOrder(orderID, manufacturer.address, amount)

            const result = await getOrder(orderID)
            //console.log(result)
            //console.log(Object.values(result)[13]) //invoice
            //console.log(typeof (Object.values(result)[3]))
            //console.log(typeof (Object.values(result)[4]))
            const result2 = convertBigNumberProps(result)
            //console.log(typeof (Object.values(result2)[3]))
            //console.log(typeof (Object.values(result2)[4]))
            //console.log(result2)

            // const mockUp = mockUpgetOrder(orderID, distributor.address, manufacturer.address, amount, date)
            // console.log(mockUp)
        })
        //note for testing 
        //Status [placed --> pending --> shipped --> delivered]
        //rejected = status: pending
        //cancelled = status: pending [something might be wrong about this]
        //onhold = status: shipped
        //returned = ?
    })
    */
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