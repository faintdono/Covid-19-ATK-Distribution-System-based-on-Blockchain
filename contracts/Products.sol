// SPDX-License-Identifier: Unlicense
pragma experimental ABIEncoderV2;
pragma solidity ^0.8.0;

import "./Types.sol";

contract Products {
    Types.Product[] internal products;
    mapping(string => Types.Product) internal product;
    mapping(address => string[]) internal userLinkedProducts;
    mapping(string => Types.ProductHistory) internal productHistory;

    // event that notifies clients about the new product
    event NewProduct(
        string lotID,
        string manufacturerName,
        string manufacturingDate,
        uint256 productAmount
    );

    function createProduct(Types.Product memory _product) internal {
        require(
            _product.manufacturer == msg.sender,
            "Only manufacturer can add"
        );
        products.push(_product);
        product[_product.lotID] = _product;
        productHistory[_product.lotID].manufacturer = Types.UserHistory({
            id: msg.sender,
            amount: _product.productAmount,
            date: block.timestamp
        });
        userLinkedProducts[msg.sender].push(_product.lotID);
        emit NewProduct(
            _product.lotID,
            _product.manufacturerName,
            _product.manufacturingDate,
            _product.productAmount
        );
    }

    function sell(
        address _partyID,
        string memory _lotID,
        uint256 _amount,
        Types.UserDetails memory _party
    ) internal {
        Types.Product memory product_ = product[_lotID];

        // Updating product history
        Types.UserHistory memory _userHistory = Types.UserHistory({
            id: _partyID,
            amount: _amount,
            date: block.timestamp
        });
        if (Types.UserRole(_party.role) == Types.UserRole.distributor) {
            productHistory[_lotID].distributor.push(_userHistory);
        } else if (Types.UserRole(_party.role) == Types.UserRole.wholesaler) {
            productHistory[_lotID].wholesaler.push(_userHistory);
        } else if (Types.UserRole(_party.role) == Types.UserRole.retailer) {
            productHistory[_lotID].retailer.push(_userHistory);
        } else {
            // Not in the assumption scope
            revert("Not valid operation");
        }
        verify(_lotID);
    }

    function verify(string memory _lotID) internal view returns (bool) {
        uint256 total;
        for (
            uint256 i = 0;
            i < productHistory[_lotID].distributor.length;
            i++
        ) {
            total += productHistory[_lotID].distributor[i].amount;
        }
        for (uint256 i = 0; i < productHistory[_lotID].wholesaler.length; i++) {
            total += productHistory[_lotID].wholesaler[i].amount;
        }
        for (uint256 i = 0; i < productHistory[_lotID].retailer.length; i++) {
            total += productHistory[_lotID].retailer[i].amount;
        }
        if (productHistory[_lotID].manufacturer.amount >= total) {
            return true;
        }
        return false;
    }
    function history(string memory _lotID) public returns (string[] memory){
        string[] memory history = new string[](productHistory[_lotID].distributor.length + productHistory[_lotID].wholesaler.length + productHistory[_lotID].retailer.length + 1);
        history[0] = string(abi.encodePacked("Manufacturer: ", productHistory[_lotID].manufacturer.id, " ", productHistory[_lotID].manufacturer.amount, " ", productHistory[_lotID].manufacturer.date));
        for (uint256 i = 0; i < productHistory[_lotID].distributor.length; i++) {
            history[i+1] = string(abi.encodePacked("Distributor: ", productHistory[_lotID].distributor[i].id, " ", productHistory[_lotID].distributor[i].amount, " ", productHistory[_lotID].distributor[i].date));
        }
        for (uint256 i = 0; i < productHistory[_lotID].wholesaler.length; i++) {
            history[i+1+productHistory[_lotID].distributor.length] = string(abi.encodePacked("Wholesaler: ", productHistory[_lotID].wholesaler[i].id, " ", productHistory[_lotID].wholesaler[i].amount, " ", productHistory[_lotID].wholesaler[i].date));
        }
        for (uint256 i = 0; i < productHistory[_lotID].retailer.length; i++) {
            history[i+1+productHistory[_lotID].distributor.length+productHistory[_lotID].wholesaler.length] = string(abi.encodePacked("Retailer: ", productHistory[_lotID].retailer[i].id, " ", productHistory[_lotID].retailer[i].amount, " ", productHistory[_lotID].retailer[i].date));
        }
        return history;
    }
    function hash(
        string memory _lotID,
        address _sender
    ) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(_lotID, _sender));
    }

    function compareStrings(
        string memory a,
        string memory b
    ) internal pure returns (bool) {
        return (keccak256(abi.encodePacked(a)) ==
            keccak256(abi.encodePacked(b)));
    }
}
