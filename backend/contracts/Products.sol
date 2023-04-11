//SPDX-License-Identifier: GPL-3.0
pragma experimental ABIEncoderV2;
pragma solidity ^0.8.0;

import "./Types.sol";

contract Products {
    Types.Product[] internal products;
    mapping(bytes32 => Types.Product) internal product; // bytes32 = generateLedgetrKey(owner, seller, orderID, lotID, sku, invoice, key, amount) => hash function

    // for transaction and verify
    mapping(bytes32 => Types.Ledger) internal ledger; // bytes32 = generateLedgetrKey(owner, seller, orderID, lotID, sku, invoice, key, amount) => hash function
    mapping(bytes32 => bytes32[]) internal childKey; // bytes32 = generateLedgetrKey(owner, seller, orderID, lotID, sku, invoice, key, amount) => hash function
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
        string lotID,
        string sku,
        uint256 value
    );

    function createProduct(Types.Product memory _product) internal {
        require(
            _product.manufacturer == msg.sender,
            "Only manufacturer can add"
        );
        bytes32 hsh = generateLedgerKey(
            msg.sender,
            address(0),
            "",
            "",
            _product.lotID,
            _product.sku,
            bytes32(0),
            _product.productAmount
        );

        products.push(_product);
        product[hsh] = _product;

        // Note: address(0) = 0x0000000000000000000000000000000000000000
        ledger[hsh] = Types.Ledger({
            owner: msg.sender,
            role: Types.UserRole.manufacturer,
            orderID: "",
            invoice: "",
            key: bytes32(0),
            sellerAddress: address(0),
            amount: _product.productAmount,
            status: Types.LedgerStatus.saleable
        });

        userKey[msg.sender].push(hsh); // add ledgerKey to user

        emit NewProduct(
            _product.lotID,
            _product.sku,
            _product.manufacturerName,
            _product.manufacturingDate,
            _product.productAmount
        );
    }

    function sell(
        address _partyID,
        string memory _orderID,
        string memory _invoice,
        string memory _lotID,
        string memory _sku,
        bytes32 _ledgerKey,
        uint256 _amount,
        Types.UserRole _partyRole
    ) internal {
        verifyTransfer(_ledgerKey, _amount);
        bytes32 _newLedgerKey = generateLedgerKey(
            _partyID,
            msg.sender,
            _orderID,
            _invoice,
            _lotID,
            _sku,
            _ledgerKey,
            _amount
        );
        userKey[_partyID].push(_newLedgerKey);
        transferProduct(
            _partyID,
            msg.sender,
            _orderID,
            _invoice,
            _newLedgerKey, // ownerKey
            _ledgerKey, // sellerKey
            _amount,
            _partyRole // Role of that party
        );
        emit transferAProduct(
            msg.sender,
            _partyID,
            _orderID,
            _invoice,
            _lotID,
            _sku,
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
        uint256 _amount,
        Types.UserRole _role
    ) internal {
        ledger[_ownerKey] = Types.Ledger({
            owner: _owner,
            role: _role,
            sellerAddress: _sellerAddress,
            orderID: _orderID,
            invoice: _invoice,
            key: _sellerKey,
            amount: _amount,
            status: Types.LedgerStatus.unsaleable
        });
        childKey[_sellerKey].push(_ownerKey);
    }

    function verifyTransfer(
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

    function renounceTransfer(address _partyID, bytes32 _ledgerKey) internal {
        popMatchKey(userKey[_partyID], _ledgerKey);
        popMatchKey(childKey[ledger[_ledgerKey].key], _ledgerKey);
        delete ledger[_ledgerKey];
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

    //geter function
    function getUserKey(
        address _userAddress
    ) external view returns (bytes32[] memory) {
        return userKey[_userAddress];
    }

    function getLedger(bytes32 _key) external view returns (Types.Ledger memory) {
        return ledger[_key];
    }

    function getRootKey(bytes32 _key) internal view returns (bytes32) {
        if (ledger[_key].key == bytes32(0)) {
            return _key;
        }
        return (getRootKey(ledger[_key].key));
    }

    function getProduct(
        bytes32 _key
    ) external view returns (Types.Product memory) {
        return product[_key];
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

    function compareStrings(
        string memory a,
        string memory b
    ) internal pure returns (bool) {
        return (keccak256(abi.encodePacked(a)) ==
            keccak256(abi.encodePacked(b)));
    }
}
