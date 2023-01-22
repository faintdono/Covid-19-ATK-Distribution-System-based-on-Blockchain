pragma solidity ^0.8.0;

import "./ProductRegistration.sol";

contract Transfer {

    ProductRegistration private productRegistration;

    constructor(address _productRegistrationAddress) public {
        productRegistration = ProductRegistration(_productRegistrationAddress);
    }

    function transferProduct(string memory _LotID, address _newOwner, int256 _newLocationLat, int256 _newLocationLong, string memory _newStatus, string memory _newComment) public {
        ProductRegistration.Product storage product = productRegistration.products[_LotID];
        require(product.LotID != "");
        require(_newOwner != address(0));
        require(_newLocationLat != 0 && _newLocationLong != 0);
        require(_newStatus != "");
        product.Owner = _newOwner;
        product.Location = (_newLocationLat, _newLocationLong);
        product.Status = _newStatus;
        product.Comment = _newComment;
    }
}
