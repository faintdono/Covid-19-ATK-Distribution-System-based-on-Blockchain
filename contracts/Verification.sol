pragma solidity ^0.8.0;

import "./ProductRegistration.sol";

contract Verification {

    ProductRegistration private productRegistration;

    constructor(address _productRegistrationAddress) public {
        productRegistration = ProductRegistration(_productRegistrationAddress);
    }

    function verifyProduct(string memory _LotID) public view returns (bool) {
        ProductRegistration.Product storage product = productRegistration.products[_LotID];
        return (product.LotID != "");
    }
}