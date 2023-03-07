//SPDX-License-Identifier: GPL-3.0
pragma experimental ABIEncoderV2;
pragma solidity ^0.8.0;

import "./Types.sol";

contract Products {
    Types.Product[] internal products;
    mapping(string => Types.Product) internal product;
    // mapping(address => string[]) internal userLinkedProducts;
    mapping(string => Types.ProductHistory) public productHistory;

    // for transaction and verify
    mapping(bytes32 => Types.Ledger) internal ledger;
    mapping(bytes32 => bytes32[]) internal childKey;
    mapping(address => bytes32[]) public userKey;

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
        bytes32 hsh = hash(
            msg.sender,
            "",
            _product.lotID,
            _product.sku,
            "",
            bytes32(0),
            address(0),
            _product.productAmount
        );
        ledger[hsh] = Types.Ledger({
            owner: msg.sender,
            orderID: "",
            invoice: "",
            key: hsh,
            sellerAddress: address(0),
            amount: _product.productAmount
        });

        // create history of this Lot of product
        productHistory[_product.lotID].manufacturer = Types.UserHistory({
            id: msg.sender,
            date: block.timestamp
        });

        //userLinkedProducts[msg.sender].push(_product.lotID);

        emit NewProduct(
            _product.lotID,
            _product.manufacturerName,
            _product.manufacturingDate,
            _product.productAmount
        );
    }

    // need to edit all function below
    // Note: call data need to be updated to match our requirements
    function sell(
        address _partyID,
        string memory _lotID,
        string memory _sku,
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
        // return verify()
    }

    // function can't be used for now due to the incomplete implementation of the function

    function returned(
        address _partyID,
        string memory _lotID,
        Types.UserRole role, // 1: distributor, 2: wholesaler, 3: retailer
        string memory _reason // 1: expired, 2: damaged, 3: other
    ) internal returns (bool) {
        if (Types.UserRole(role) == Types.UserRole.distributor) {
            popMatchHistory(productHistory[_lotID].distributor, _partyID);
        } else if (Types.UserRole(role) == Types.UserRole.wholesaler) {
            popMatchHistory(productHistory[_lotID].wholesaler, _partyID);
        } else if (Types.UserRole(role) == Types.UserRole.retailer) {
            popMatchHistory(productHistory[_lotID].retailer, _partyID);
        } else {
            // Not in the assumption scope
            revert("Not valid operation");
        }
        // NEED TO ADD RETURNED REASON CONDITION
    }

    function transferProduct(
        address _seller,
        address _buyer,
        uint256 _amount,
        string memory _lotID
    ) internal {
        // TODO: create a new key for the buyer and then create a new ledger by that key
    }

    function renounceTransfer(
        address _buyer,
        address _seller,
        string memory _lotID
    ) internal {
        // TODO: delete the ledger of the buyer
    }

    function destroyProduct(address _buyer, string memory _lotID) internal {
        // TODO: sometimes you want to destroy that proudct due to any reason
        // Note: need to implement Types.OrderStatus Struct
    }

    // need to change it to verify only UPPER LEVEL
    function verify(
        bytes32 _rootKey,
        bytes32 _rootAddress
    ) internal view returns (bool) {}

    function popMatchHistory(
        Types.UserHistory[] storage _array,
        address _partyID
    ) internal {
        for (uint256 i = 0; i < _array.length; i++) {
            if (_array[i].id == _partyID) {
                _array[i] = _array[_array.length - 1];
                _array.pop();
                break;
            }
        }
    }

    // need to know [lotID, sku, invoice, orderID, key, sellerAddress]
    function hash(
        address _owner,
        string memory _orderID,
        string memory _lotID,
        string memory _sku,
        string memory _invoice,
        bytes32 _key,
        address _sellerAddress,
        uint256 _amount
    ) internal pure returns (bytes32) {
        return
            keccak256(
                abi.encodePacked(
                    _owner,
                    _orderID,
                    _lotID,
                    _sku,
                    _invoice,
                    _key,
                    _sellerAddress,
                    _amount
                )
            );
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
