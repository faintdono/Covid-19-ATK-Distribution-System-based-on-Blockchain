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
    mapping(bytes32 => Types.Ledger) internal ledger; // bytes32 = generateLedgetrKey(owner, seller, orderID, lotID, sku, invoice, key, amount) => hash function
    mapping(bytes32 => bytes32[]) internal childKey; // bytes32 = still the same as above => it's a parent key
    mapping(address => bytes32[]) internal userKey;

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

        // create ledger of this Lot of product
        bytes32 hsh = generateLedgerKey(
            msg.sender,
            address(0),
            "",
            _product.lotID,
            _product.sku,
            "",
            bytes32(0),
            _product.productAmount
        );

        // Note: address(0) = 0x0000000000000000000000000000000000000000
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
        string memory _orderID,
        string memory _invoice,
        string memory _lotID,
        string memory _sku,
        bytes32 _key,
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
        verify()
        bytes32 hsh = generateLedgerKey(
            _partyID,
            msg.sender,
            _orderID,
            _lotID,
            _sku,
            _invoice,
            _key,
            _amount
        );

        transferProduct(
            _partyID,
            msg.sender,
            _orderID,
            _invoice,
            hsh,
            _key,
            _amount
        );
        // return verify()
    }

    function transferProduct(
        address _owner,
        address _sellerAddress,
        string memory _orderID,
        string memory _invoice,
        bytes32 _ownerKey,
        bytes32 _sellerKey,
        uint256 _amount
    ) internal {
        ledger[_ownerKey] = Types.Ledger({
            owner: _owner,
            sellerAddress: _sellerAddress,
            orderID: _orderID,
            invoice: _invoice,
            key: _sellerKey,
            amount: _amount
        });
        childKey[_sellerKey].push(_ownerKey);
    }

    // verify only UPPER LEVEL
    function verify(
        bytes32 _rootKey,
    ) internal view returns (bool) {
        childKeys = childKey[_rootKey];
        uint256 totalAmount = 0;
        for (uint256 i = 0; i < childKeys.length; i++) {
            totalAmount += ledger[childKeys[i]].amount;
            if (totalAmount >= ledger[_rootKey].amount) {
                return false;
            }
        }
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

    //geter function
    function getUserKey(
        address _userAddress
    ) internal view returns (bytes32[] memory) {
        return userKey[_userAddress];
    }

    function getLedger(
        bytes32 _key
    ) internal view returns (Types.Ledger memory) {
        return ledger[_key];
    }

    // need to know [lotID, sku, invoice, orderID, key, sellerAddress]
    function generateLedgerKey(
        address _owner,
        address _sellerAddress,
        string memory _orderID,
        string memory _invoice,
        string memory _lotID,
        string memory _sku,
        bytes32 _key,
        uint256 _amount
    ) internal pure returns (bytes32) {
        return
            keccak256(
                abi.encodePacked(
                    _owner,
                    _sellerAddress,
                    _orderID,
                    _invoice,
                    _lotID,
                    _sku,
                    _key,
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
