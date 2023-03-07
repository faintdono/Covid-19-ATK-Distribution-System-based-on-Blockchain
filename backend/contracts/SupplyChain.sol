//SPDX-License-Identifier: GPL-3.0
pragma experimental ABIEncoderV2;
pragma solidity ^0.8.0;

// inherited contracts
import "./Types.sol";
import "./Products.sol";
import "./Registration.sol";
import "./OrderManagement.sol";

contract SupplyChain is Products {
    RegistrationCaller registration;
    OrderManagementCaller orderManagement;

    constructor(address _Address) {
        registration = RegistrationCaller(_Address);
        orderManagement = OrderManagementCaller(_Address);
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
        string memory orderID
    ) public verifyCaller(msg.sender) verifyUser() {
        
    }

    function returnProduct(
        string memory lotID,
        string memory reason
    ) public verifyCaller(msg.sender) {
        Types.UserRole role = registration.getUserDetails(msg.sender).role;
        returned(msg.sender, lotID, role, reason);
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

    modifier onlyManufacturer() {
        require(registration.isManufacturer(msg.sender));
        _;
    }
}

contract SupplyChainCaller {
    SupplyChain supplyChain;

    constructor(address _Address) {
        supplyChain = SupplyChain(_Address);
    }

    function sellProduct(
        string memory lotID,
        address buyerID,
        uint256 amount
    ) external {
        supplyChain.sellProduct(lotID, buyerID, amount);
    }
}
