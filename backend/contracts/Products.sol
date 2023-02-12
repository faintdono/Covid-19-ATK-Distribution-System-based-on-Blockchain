//SPDX-License-Identifier: GPL-3.0
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

    event transferAProduct(
        address indexed from,
        address indexed to,
        uint256 value,
        string lotID
    );

    function createProduct(Types.Product memory _product) internal {
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
    ) internal returns (bool) {
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
        return verify(_lotID);
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
        store[hsh1].amount -= _amount;
        store[hsh2] = Types.Storage({sellerAddress: _seller, amount: _amount});
        emit transferAProduct(_seller, _buyer, _amount, _lotID);
    }

    function renounceTransfer(address _buyer,address _seller,string memory _lotID) internal {
        bytes32 hsh1 = hash(_lotID, _seller);
        bytes32 hsh2 = hash(_lotID, _buyer);
        store[hsh1].amount += store[hsh2].amount;
        delete store[hsh2];
    }

    function destroyProduct(address _buyer,string memory _lotID) internal {
        bytes32 hsh1 = hash(_lotID, _buyer);
        bytes32 hsh2 = hash(_lotID, 0x0000000000000000000000000000000000000000);
        store[hsh1].amount += store[hsh2].amount;
        delete store[hsh2];
    }

    function verify(string memory _lotID) internal view returns (bool) {
        uint256 totalProduct = product[_lotID].productAmount;
        uint256 count = store[hash(_lotID, productHistory[_lotID].manufacturer.id)].amount;
        for ( uint256 i = 0; i < productHistory[_lotID].distributor.length; i++
        ) {
            bytes32 hsh = hash(_lotID,productHistory[_lotID].distributor[i].id);
            count += store[hsh].amount;
        }
        for (uint256 i = 0; i < productHistory[_lotID].wholesaler.length; i++) {
            bytes32 hsh = hash(_lotID, productHistory[_lotID].wholesaler[i].id);
            count += store[hsh].amount;
        }
        for (uint256 i = 0; i < productHistory[_lotID].retailer.length; i++) {
            bytes32 hsh = hash(_lotID, productHistory[_lotID].retailer[i].id);
            count += store[hsh].amount;
        }
        count += store[hash(_lotID,0x0000000000000000000000000000000000000000)].amount;
        if (count == totalProduct) {
            return true;
        }
        return false;
    }

    function history(string memory _lotID) internal returns (string[] memory) {
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
        string memory a,
        string memory b
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
