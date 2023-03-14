//SPDX-License-Identifier: GPL-3.0
pragma experimental ABIEncoderV2;
pragma solidity ^0.8.0;

import "./Types.sol";

contract Products {
    Types.Product[] internal products;
    mapping(bytes32 => Types.Product) internal product; // bytes32 = generateProductKey(lotID,sku,manufacturerName) => hash function
    mapping(address => bytes32[]) internal userLinkedProducts;
    mapping(bytes32 => Types.ProductHistory) public productHistory; // bytes32 = same as above

    // for transaction and verify
    mapping(bytes32 => Types.Ledger) internal ledger; // bytes32 = generateLedgetrKey(owner, seller, orderID, lotID, sku, invoice, key, amount) => hash function
    mapping(bytes32 => bytes32[]) internal childKey; // bytes32 = still the same as above => it's a parent key
    mapping(address => bytes32[]) internal userKey;

    // event that notifies clients about the new product
    event NewProduct(
        string lotID,
        string sku,
        string manufacturerName,
        string manufacturingDate,
        uint256 productAmount
    );

    event transferAProduct(
        address indexed from,
        address indexed to,
        string orderID,
        string invoice,
        uint256 value
    );

    function createProduct(Types.Product memory _product) internal {
        require(
            _product.manufacturer == msg.sender,
            "Only manufacturer can add"
        );
        bytes32 hsh1 = generateProductKey(
            _product.lotID,
            _product.sku,
            _product.manufacturerName,
            _product.manufacturer,
            _product.manufacturingDate,
            _product.expiryDate,
            _product.productAmount
        );
        // add product
        products.push(_product);
        product[hsh1] = _product;

        // create ledger of this Lot of product
        bytes32 hsh2 = generateLedgerKey(
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
        ledger[hsh2] = Types.Ledger({
            owner: msg.sender,
            orderID: "",
            invoice: "",
            key: hsh2,
            sellerAddress: address(0),
            amount: _product.productAmount
        });

        // create history of this product
        productHistory[hsh1].manufacturer = Types.UserHistory({
            id: msg.sender,
            date: block.timestamp
        });

        userLinkedProducts[msg.sender].push(hsh1); // add product to user
        userKey[msg.sender].push(hsh2); // add ledgerKey to user

        emit NewProduct(
            _product.lotID,
            _product.sku,
            _product.manufacturerName,
            _product.manufacturingDate,
            _product.productAmount
        );
    }

    // _lotID, _sku, _manufacturerName, _manufacturer, _manufacturingDate, _expiryDate, _productAmount use for generate productKey
    // _lotID, _sku, _orderID, _invoice, _key, _amount use for generate ledgerKey
    function verifyProduct(
        // payload
    )
        internal
        view
        returns (
            bool
        )
    {
        // 1: check product is valid
        // 2: check orderID is valid (if orderID is not empty)
        // 3: check parentKey is valid (ledgerKey generated from that parentKey need to equal one we provided)
    }

    function sell(
        address _partyID,
        string memory _orderID,
        string memory _invoice,
        string memory _lotID,
        string memory _sku,
        bytes32 _ledgerKey,
        bytes32 _productKey,
        uint256 _amount,
        Types.UserDetails memory _party
    ) internal {
        // Updating product history
        Types.UserHistory memory _userHistory = Types.UserHistory({
            id: _partyID,
            date: block.timestamp
        });
        verify(_ledgerKey, _amount);
        if (Types.UserRole(_party.role) == Types.UserRole.distributor) {
            productHistory[_productKey].distributor.push(_userHistory);
        } else if (Types.UserRole(_party.role) == Types.UserRole.wholesaler) {
            productHistory[_productKey].wholesaler.push(_userHistory);
        } else if (Types.UserRole(_party.role) == Types.UserRole.retailer) {
            productHistory[_productKey].retailer.push(_userHistory);
        } else {
            // Not in the assumption scope
            revert("Not valid operation");
        }
        // add product to user
        userLinkedProducts[_partyID].push(_productKey);
        bytes32 _newLedgerKey = generateLedgerKey(
            _partyID,
            msg.sender,
            _orderID,
            _lotID,
            _sku,
            _invoice,
            _ledgerKey,
            _amount
        );

        transferProduct(
            _partyID,
            msg.sender,
            _orderID,
            _invoice,
            _newLedgerKey, // ownerKey
            _ledgerKey, // sellerKey
            _amount
        );
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
        emit transferAProduct(
            _sellerAddress,
            _owner,
            _orderID,
            _invoice,
            _amount
        );
    }

    // verify only UPPER LEVEL
    function verify(
        bytes32 _rootKey,
        uint256 _amount
    ) internal view returns (bool) {
        bytes32[] memory childKeys = childKey[_rootKey];
        uint256 totalAmount = 0;
        for (uint256 i = 0; i < childKeys.length; i++) {
            totalAmount += ledger[childKeys[i]].amount;
            if (totalAmount >= ledger[_rootKey].amount) {
                revert("Maximum amount reached");
            }
        }
        totalAmount += _amount;
        if (totalAmount > ledger[_rootKey].amount) {
            revert("insufficient amount");
        }
        return true;
    }

    function renounceTransfer(
        address _partyID,
        bytes32 _ledgerKey,
        bytes32 _productKey,
        Types.UserDetails memory _party
    ) internal {
        // Updating product history
        if (Types.UserRole(_party.role) == Types.UserRole.distributor) {
            popMatchHistory(productHistory[_productKey].distributor, _partyID);
        } else if (Types.UserRole(_party.role) == Types.UserRole.wholesaler) {
            popMatchHistory(productHistory[_productKey].wholesaler, _partyID);
        } else if (Types.UserRole(_party.role) == Types.UserRole.retailer) {
            popMatchHistory(productHistory[_productKey].retailer, _partyID);
        } else {
            // Not in the assumption scope
            revert("Not valid operation");
        }
        // remove product from user
        popMatchKey(userLinkedProducts[_partyID], _productKey);
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

    function popMatchKey(
        bytes32[] storage _array,
        bytes32 _ledgerKey
    ) internal {
        for (uint256 i = 0; i < _array.length; i++) {
            if (_array[i] == _ledgerKey) {
                _array[i] = _array[_array.length - 1];
                _array.pop();
                break;
            }
        }
    }

    function popMatchProductKey(
        bytes32[] storage _array,
        bytes32 _productKey
    ) internal {
        for (uint256 i = 0; i < _array.length; i++) {
            if (_array[i] == _productKey) {
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

    function generateProductKey(
        string memory _lotID,
        string memory _sku,
        string memory _manufacturingName
    ) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(_lotID, _sku, _manufacturingName));
    }

    function compareStrings(
        string memory a,
        string memory b
    ) internal pure returns (bool) {
        return (keccak256(abi.encodePacked(a)) ==
            keccak256(abi.encodePacked(b)));
    }
}
