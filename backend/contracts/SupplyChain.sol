//SPDX-License-Identifier: GPL-3.0
pragma experimental ABIEncoderV2;
pragma solidity ^0.8.0;

// inherited contracts
import "./Types.sol";
import "./Products.sol";
import "./Registration.sol";
import "./OrderManagement.sol";

contract SupplyChain is Products {
    Registration registration;
    OrderManagement orderMan;

    constructor(address _RegAddress, address _OrderAddress) {
        registration = Registration(_RegAddress);
        orderMan = OrderManagement(_OrderAddress);
    }

    function addProduct(
        string memory lotID,
        string memory sku,
        string memory manufacturerName,
        string memory manufacturingDate,
        string memory expiryDate,
        uint256 productAmount
    ) public onlyManufacturer {
        Types.Product memory product = Types.Product(
            lotID,
            sku,
            manufacturerName,
            msg.sender,
            manufacturingDate,
            expiryDate,
            productAmount
        );
        createProduct(product);
    }

    function sellProduct(
        string memory orderID,
        bytes32 _ledgerKey
    ) public verifyCaller(msg.sender) verifyOwnership(_ledgerKey) {
        Types.Order memory _order = orderMan.getOrder(orderID);
        Types.UserDetails memory _user = registration.getUserDetails(
            _order.buyerAddress
        );
        if (ledger[_ledgerKey].status != Types.LedgerStatus.saleable) {
            revert("Product is not saleable");
        } else {
            sell(
                _order.buyerAddress,
                orderID,
                _order.invoice,
                _order.lotID,
                _order.sku,
                _ledgerKey,
                _order.amount,
                _user.role
            );
        }
    }

    function updateLedgerStatus(
        bytes32 _ledgerKey
    ) public verifyCaller(msg.sender) {
        Types.Order memory _order = orderMan.getOrder(
            ledger[_ledgerKey].orderID
        );
        if (_order.status != Types.OrderStatus.delivered) {
            revert("Order is not delivered can't update ledger status");
        } else {
            ledger[_ledgerKey].status = Types.LedgerStatus.saleable;
        }
    }

    function returnProduct(
        string memory orderID,
        bytes32 _ledgerKey
    ) public verifyCaller(msg.sender) {
        Types.Order memory _order = orderMan.getOrder(orderID);
        if (_order.status != Types.OrderStatus.shipped) {
            revert("Order is not shipped can't return product");
        } else {
            renounceTransfer(_order.buyerAddress, _ledgerKey);
        }
    }

    function verifyProduct(
        string memory _lotID,
        string memory _sku,
        string memory _manufacturerName,
        string memory _expireDate,
        bytes32 _ledgerKey
    ) public view returns (bool) {
        bytes32 Key = getRootKey(_ledgerKey);
        Types.Product memory _product = product[Key];
        return
            compareStrings(_product.lotID, _lotID) &&
            compareStrings(_product.sku, _sku) &&
            compareStrings(_product.manufacturerName, _manufacturerName) &&
            compareStrings(_product.expiryDate, _expireDate);
    }

    modifier verifyCaller(address _address) {
        require(
            (msg.sender == _address) &&
                ((registration.isDistributor(_address)) ||
                    (registration.isManufacturer(_address)) ||
                    (registration.isRetailer(_address)) ||
                    (registration.isWholesaler(_address)))
        );
        _;
    }

    modifier verifyUser(address _address) {
        require(
            ((registration.isDistributor(_address)) ||
                (registration.isManufacturer(_address)) ||
                (registration.isRetailer(_address)) ||
                (registration.isWholesaler(_address)))
        );
        _;
    }

    modifier verifyOwnership(bytes32 _key) {
        require(ledger[_key].owner == msg.sender);
        _;
    }

    modifier onlyManufacturer() {
        require(registration.isManufacturer(msg.sender));
        _;
    }
}
