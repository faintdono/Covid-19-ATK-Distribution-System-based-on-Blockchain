const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('Order Management', () => {
    let manufacturer, distributor, wholesaler, retailer
    let registration, ordermanagement

    beforeEach(async () => {

        [admin, manufacturer, distributor, wholesaler, retailer] = await ethers.getSigners()

        const Registration = await ethers.getContractFactory('Registration')
        registration = await Registration.deploy()

        const OrderManagement = await ethers.getContractFactory('OrderManagement');
        ordermanagement = await OrderManagement.deploy(registration.address)

    registration.addUser(123456789, "manufacturer", manufacturer.address);
    registration.addUser(223456789, "distributor", distributor.address);
    registration.addUser(323456789, "wholesaler", wholesaler.address);
    registration.addUser(423456789, "retailer", retailer.address);
    })
    
    describe('Get Orders', () => {

        function checkObjects(obj1, obj2) {
            const keys1 = Object.keys(obj1);
            const keys2 = Object.keys(obj2);

            if (keys1.length !== keys2.length) {
                return false;
            }

            // Check if keys are the same
            for (let i = 0; i < keys1.length; i++) {
                const key = keys1[i];

                if (obj1[key] !== obj2[key]) {
                    return false;
                }
            }

            // If all checks passed, return true
            return true;
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

        function mockUpgetOrder(buyerAddress, sellerAddress, orderID, invoice, lotID, sku, amount, date, status, lastUpdate) {
            const obj = [
                buyerAddress,
                sellerAddress,
                orderID,
                invoice,
                lotID,
                sku,
                amount,
                date,
                status,
                lastUpdate
            ];
            obj.buyerAddress = buyerAddress;
            obj.sellerAddress = sellerAddress;
            obj.orderID = orderID;
            obj.invoice = invoice;
            obj.lotID = lotID;
            obj.sku = sku;
            obj.amount = amount;
            obj.date = date;
            obj.status = status;
            obj.lastUpdated = lastUpdate;

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
            const invoice = ''
            const lotID = ''
            const sku = ''
            const status = 0; // placed
            const order = await getOrder(orderID)
            const convertedOrder = convertBigNumber(order)
            const lastUpdate = date

            const mockUp = mockUpgetOrder(distributor.address, manufacturer.address, orderID, invoice, lotID, sku, amount, date, status, lastUpdate)
            const result = (checkObjects(convertedOrder, mockUp))
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

            const mockUp = mockUpgetOrder(distributor.address, manufacturer.address, orderID, invoice, lotID, sku, amount, date, status, lastUpdate)
            const result = (checkObjects(convertedOrder, mockUp))
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

            const mockUp = mockUpgetOrder(distributor.address, manufacturer.address, orderID, invoice, lotID, sku, amount, date, status, lastUpdate)
            const result = (checkObjects(convertedOrder, mockUp))
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

            const mockUp = mockUpgetOrder(distributor.address, manufacturer.address, orderID, invoice, lotID, sku, amount, date, status, lastUpdate)
            const result = (checkObjects(convertedOrder, mockUp))
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

            const order = await getOrder(orderID)
            const convertedOrder = convertBigNumber(order)

            const status = 2;
            const lastUpdate = await getBlockTimestamp()

            const mockUp = mockUpgetOrder(distributor.address, manufacturer.address, orderID, invoice, lotID, sku, amount, date, status, lastUpdate)
            const result = (checkObjects(convertedOrder, mockUp))

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

            const order = await getOrder(orderID)
            const convertedOrder = convertBigNumber(order)

            const status = 5;
            const lastUpdate = await getBlockTimestamp()

            const mockUp = mockUpgetOrder(distributor.address, manufacturer.address, orderID, invoice, lotID, sku, amount, date, status, lastUpdate)
            const result = (checkObjects(convertedOrder, mockUp))

            expect(result).to.be.equal(true)
        })

        it('Get Onhold Order', async () => {
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
            await ordermanagement.connect(manufacturer).onholdOrder(orderID)

            const order = await getOrder(orderID)
            const convertedOrder = convertBigNumber(order)

            const status = 6;
            const lastUpdate = await getBlockTimestamp()

            const mockUp = mockUpgetOrder(distributor.address, manufacturer.address, orderID, invoice, lotID, sku, amount, date, status, lastUpdate)
            const result = (checkObjects(convertedOrder, mockUp))

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