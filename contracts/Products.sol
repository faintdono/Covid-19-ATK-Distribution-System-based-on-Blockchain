// SPDX-License-Identifier: Unlicense
pragma experimental ABIEncoderV2;
pragma solidity ^0.8.0;

import "./Types.sol";

contract Products {
    Types.Product[] internal products;
    mapping(string => Types.Product) internal product;
    mapping(address => string[]) internal userLinkedProducts;
    mapping(string => Types.ProductHistory) public productHistory;
    mapping(bytes32 => Types.Storage) public store;

    // event that notifies clients about the new product
    event NewProduct(
        string lotID,
        string manufacturerName,
        string manufacturingDate,
        uint256 productAmount
    );

    function createProduct(Types.Product memory _product) public {
        require(
            _product.manufacturer == msg.sender,
            "Only manufacturer can add"
        );
        // add product
        products.push(_product);
        product[_product.lotID] = _product;

        // add amount of product to storage
        bytes32 hsh = hash(_product.lotID, msg.sender);
        store[hsh].amount = _product.productAmount;

        // create history of this Lot of product
        productHistory[_product.lotID].manufacturer = Types.UserHistory({
            id: msg.sender,
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
    ) public {
        // Updating product history
        Types.UserHistory memory _userHistory = Types.UserHistory({
            id: _partyID,
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
        transferProduct(msg.sender, _partyID, _amount, _lotID);
    }

    function transferProduct(
        address _seller,
        address _buyer,
        uint256 _amount,
        string memory _lotID
    ) internal {
        // TODO: transfer the product from address to address
        bytes32 hsh1 = hash(_lotID, _seller);
        bytes32 hsh2 = hash(_lotID, _buyer);
        // These lines are probably needed
        // if (!hashexist(store[hsh2],"")) {
        // store[hsh1].amount -= _amount;
        // store[hsh2] = Types.Storage({
        // sellerAddress: _seller,
        // amount: _amount
        // });
        // } else {
        // store[hsh1].amount -= _amount;
        // store[hsh2].amount += _amount;
        // }
        store[hsh1].amount -= _amount;
        store[hsh2] = Types.Storage({sellerAddress: _seller, amount: _amount});
    }

    function verify(string memory _lotID) internal view returns (bool) {
        //TO DO: validate that the amount of product is the same
    }

    function history(string memory _lotID) public returns (string[] memory) {
        //TO DO: get the history of _lotID that user buy
    }

    function hash(
        string memory _lotID,
        address _sender
    ) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(_lotID, _sender));
    }

    function hashexist(
        string memory _lotID,
        string a,
        string b
    ) internal pure returns (bool) {
        return (keccak256(abi.encodePacked(_lotID, a)) ==
            keccak256(abi.encodePacked(_lotID, b)));
    }

    function compareStrings(
        string memory a,
        string memory b
    ) internal pure returns (bool) {
        return (keccak256(abi.encodePacked(a)) ==
            keccak256(abi.encodePacked(b)));
    }
}
