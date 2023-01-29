const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('Products', () => {

    //will do this to setup before start testing
    beforeEach(async () => {

        const Types = await ethers.getContractFactory('Types')
        types = await Types.deploy()

        const Products = await ethers.getContractFactory('Products')
        products = await Products.deploy()

    })

    it('create new product', async () => {
        const signer = await ethers.getSigner()
        const createProduct = await products.createProduct([1,2, signer.address ,4,5,6])
    })

})