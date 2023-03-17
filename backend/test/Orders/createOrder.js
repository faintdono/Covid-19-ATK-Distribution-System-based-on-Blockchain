const { expect } = require('chai');
const { ethers } = require('hardhat');

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

        async function generateProductInfo() {
            const invoice = generateRandomString();
            const lotID = generateRandomString();
            const sku = generateRandomString();
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

            const ProductInfo = await generateProductInfo()
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

            const ProductInfo = await generateProductInfo()
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
                .withArgs(orderID, timestamp, 3)
        })

        it('Accept Order', async () => {
            const orderID = generateRandomOrderID(distributor.address)
            const amount = generateRandomAmount()
            await ordermanagement.connect(distributor).createOrder(orderID, manufacturer.address, amount)

            const ProductInfo = await generateProductInfo()
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

            const ProductInfo = await generateProductInfo()
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

            const ProductInfo = await generateProductInfo()
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

            const ProductInfo = await generateProductInfo()
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

    describe('Get Orders', () => {

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

        function mockUpgetOrder(orderID, buyerAddress, sellerAddress, amount, date, lotID, status, lastUpdated) {
            const obj = [
                orderID,
                buyerAddress,
                sellerAddress,
                amount,
                date,
                lotID,
                status,
                lastUpdated,
            ];
            obj.orderID = orderID;
            obj.buyerAddress = buyerAddress;
            obj.sellerAddress = sellerAddress;
            obj.amount = amount;
            obj.date = date;
            obj.lotID = lotID;
            obj.status = status;
            obj.lastUpdated = date;

            return obj;
        }

        function convertBigNumber(obj) {
            const obj2 = [];
            for (const key in obj) {
                if (typeof obj[key] === 'object') {
                    obj2[key] = obj[key].toNumber();
                } else {
                    obj2[key] = obj[key]
                }
            }
            return obj2;
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

        async function generateProductInfo() {
            const invoice = generateRandomString();
            const lotID = generateRandomString();
            const sku = generateRandomString();
            return { invoice, lotID, sku };
        }

        it('Get Placed Order', async () => {

            const orderID = generateRandomOrderID(distributor.address)
            const amount = generateRandomAmount()
            await ordermanagement.connect(distributor).createOrder(orderID, manufacturer.address, amount)

            const date = await getBlockTimestamp() // date beginning of this order
            const lotID = '5555555'
            const status = 0; // placed
            const order = await getOrder(orderID)
            const convertedOrder = convertBigNumber(order)

            //mockUpgetOrder(orderID, buyerAddress, sellerAddress, amount, date, lotID, status, lastUpdate)
            const mockUp = mockUpgetOrder(orderID, distributor.address, manufacturer.address, amount, date, lotID, status, date)
            const result = (JSON.stringify.convertedOrder === JSON.stringify.mockUp)
            expect(result).to.be.equal(true)
        })

        it('Get Pending Order', async () => {
            const orderID = generateRandomOrderID(distributor.address)
            const amount = generateRandomAmount()
            await ordermanagement.connect(distributor).createOrder(orderID, manufacturer.address, amount)
            const date = await getBlockTimestamp()

            const ProductInfo = await generateProductInfo()
            const invoice = Object.values(ProductInfo)[0]
            const lotID = Object.values(ProductInfo)[1]
            const sku = Object.values(ProductInfo)[2]
            await ordermanagement.connect(manufacturer).confirmOrder(orderID, invoice, lotID, sku)

            const order = await getOrder(orderID)
            const convertedOrder = convertBigNumber(order)

            const status = 1 // pending
            const lastUpdate = await getBlockTimestamp()

            //mockUpgetOrder(orderID, buyerAddress, sellerAddress, amount, date, lotID, status, lastUpdate)
            const mockUp = mockUpgetOrder(orderID, distributor.address, manufacturer.address, amount, date, lotID, status, lastUpdate)
            const result = (JSON.stringify.convertedOrder === JSON.stringify.mockUp)
            expect(result).to.be.equal(true)
        })

        it('Get Shipped Order', async () => {
            const orderID = generateRandomOrderID(distributor.address)
            const amount = generateRandomAmount()
            await ordermanagement.connect(distributor).createOrder(orderID, manufacturer.address, amount)
            const date = await getBlockTimestamp()

            const ProductInfo = await generateProductInfo()
            const invoice = Object.values(ProductInfo)[0]
            const lotID = Object.values(ProductInfo)[1]
            const sku = Object.values(ProductInfo)[2]
            await ordermanagement.connect(manufacturer).confirmOrder(orderID, invoice, lotID, sku)
            await ordermanagement.connect(manufacturer).shipOrder(orderID)

            const order = await getOrder(orderID)
            const convertedOrder = convertBigNumber(order)

            const status = 3 // shipped
            const lastUpdate = await getBlockTimestamp()
            //mockUpgetOrder(orderID, buyerAddress, sellerAddress, amount, date, lotID, status, lastUpdate)
            const mockUp = mockUpgetOrder(orderID, distributor.address, manufacturer.address, amount, date, lotID, status, lastUpdate)
            const result = (JSON.stringify.convertedOrder === JSON.stringify.mockUp)
            expect(result).to.be.equal(true)
        })

        it('Get Delivered Order', async () => {
            const orderID = generateRandomOrderID(distributor.address)
            const amount = generateRandomAmount()
            await ordermanagement.connect(distributor).createOrder(orderID, manufacturer.address, amount)
            const date = await getBlockTimestamp()

            const ProductInfo = await generateProductInfo()
            const invoice = Object.values(ProductInfo)[0]
            const lotID = Object.values(ProductInfo)[1]
            const sku = Object.values(ProductInfo)[2]
            await ordermanagement.connect(manufacturer).confirmOrder(orderID, invoice, lotID, sku)
            await ordermanagement.connect(manufacturer).shipOrder(orderID)
            await ordermanagement.connect(distributor).acceptOrder(orderID)

            const order = await getOrder(orderID)
            const convertedOrder = convertBigNumber(order)

            const status = 4 // delivered
            const lastUpdate = await getBlockTimestamp()
            //mockUpgetOrder(orderID, buyerAddress, sellerAddress, amount, date, lotID, status, lastUpdate)
            const mockUp = mockUpgetOrder(orderID, distributor.address, manufacturer.address, amount, date, lotID, status, lastUpdate)
            const result = (JSON.stringify.convertedOrder === JSON.stringify.mockUp)
            expect(result).to.be.equal(true)
        })

        it('Get Reject Order', async () => {
            const orderID = generateRandomOrderID(distributor.address)
            const amount = generateRandomAmount()
            await ordermanagement.connect(distributor).createOrder(orderID, manufacturer.address, amount)
            const date = await getBlockTimestamp()

            const ProductInfo = await generateProductInfo()
            const invoice = Object.values(ProductInfo)[0]
            const lotID = Object.values(ProductInfo)[1]
            const sku = Object.values(ProductInfo)[2]
            await ordermanagement.connect(manufacturer).confirmOrder(orderID, invoice, lotID, sku)
            await ordermanagement.connect(manufacturer).rejectOrder(orderID)

            const status = 2;
            const lastUpdate = await getBlockTimestamp()

            //mockUpgetOrder(orderID, buyerAddress, sellerAddress, amount, date, lotID, status, lastUpdate)
            const mockUp = mockUpgetOrder(orderID, distributor.address, manufacturer.address, amount, date, lotID, status, lastUpdate)
            const result = (JSON.stringify.convertedOrder === JSON.stringify.mockUp)
            expect(result).to.be.equal(true)
        })

        it('Get Cancelled Order', async () => {
            const orderID = generateRandomOrderID(distributor.address)
            const amount = generateRandomAmount()
            await ordermanagement.connect(distributor).createOrder(orderID, manufacturer.address, amount)
            const date = await getBlockTimestamp()

            const ProductInfo = await generateProductInfo()
            const invoice = Object.values(ProductInfo)[0]
            const lotID = Object.values(ProductInfo)[1]
            const sku = Object.values(ProductInfo)[2]
            await ordermanagement.connect(manufacturer).confirmOrder(orderID, invoice, lotID, sku)
            await ordermanagement.connect(distributor).cancelOrder(orderID)

            const status = 5;
            const lastUpdate = await getBlockTimestamp()

            //mockUpgetOrder(orderID, buyerAddress, sellerAddress, amount, date, lotID, status, lastUpdate)
            const mockUp = mockUpgetOrder(orderID, distributor.address, manufacturer.address, amount, date, lotID, status, lastUpdate)
            const result = (JSON.stringify.convertedOrder === JSON.stringify.mockUp)
            expect(result).to.be.equal(true)
        })



        
        /*
        note for testing 
        Status [placed --> pending --> shipped --> delivered]
        rejected = status: pending
        cancelled = status: pending [something might be wrong about this]
        onhold = status: shipped
        returned = ?
 
        placed,0
        pending,1
        rejected,2
        shipped,3
        delivered,4
        cancelled,5
        onhold,6
        returned,7
        */

    })
})