const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('Products', () => {
    let manufacturer, distributor, wholesaler, retailer
    let types, products

    //NEED Mockup-Data and require all function to be public (internal -> public) before testing
    //will do this to setup before start testing
    beforeEach(async () => {

        //Add address into roles

        [manufacturer, distributor, wholesaler, retailer] = await ethers.getSigners()

        //need implement add these into enum
        
        const Types = await ethers.getContractFactory('Types')
        types = await Types.deploy()

        const Products = await ethers.getContractFactory('Products')
        products = await Products.deploy()

    })
    
    it('create new product', async () => {
        const signer = await ethers.getSigner()
        const result = products.createProduct([1,2, signer.address ,4,5,6])
        expect(result).to.emit() // need to add NewProduct emit here.
    } )

    it('only manufacturer can create product', async () => {
        const result = products.createProduct([1,2, manufacturer.address ,4,5,6])
        await expect(result).to.be.revertedWith("Only manufacturer can add")
    })

    // for meme I'm ว่าง
    describe('Base function', () => {

        it('test compare string: true', async() => {
            const result = await products.compareStrings('abcdefg', 'abcdefg')
            expect(result).to.be.equal(true)
        })

        it('test compare string: false', async() => {
            const result = await products.compareStrings('abcdefg', 'abcdefh')
            expect(result).to.be.equal(false)
        })
    })
})