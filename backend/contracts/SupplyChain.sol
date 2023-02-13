//SPDX-License-Identifier: GPL-3.0
pragma experimental ABIEncoderV2;
pragma solidity ^0.8.0;

// inherited contracts
import "./Types.sol";
import "./Products.sol";
import "./Registration.sol";

contract SupplyChain is Products {
    RegistrationCaller registration;

    constructor(address _Address) {
        registration = RegistrationCaller(_Address);
    }

    function addProduct(
        string memory lotID,
        string memory manufacturerName,
        string memory manufacturingDate,
        string memory expiryDate,
        uint256 productAmount
    ) public onlyManufacturer {
        Types.Product memory product = Types.Product(
            lotID,
            manufacturerName,
            msg.sender,
            manufacturingDate,
            expiryDate,
            productAmount
        );
        createProduct(product);
    }

    function sellProduct(
        string memory lotID,
        address buyerID,
        uint256 amount
    ) public verifyCaller(msg.sender) verifyUser(buyerID) {
        sell(buyerID, lotID, amount, registration.getUserDetails(buyerID));
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

    function addProduct(
        string memory lotID,
        string memory manufacturerName,
        string memory manufacturingDate,
        string memory expiryDate,
        uint256 productAmount
    ) public {
        supplyChain.addProduct(
            lotID,
             manufacturerName,
            manufacturingDate,
            expiryDate,
            productAmount
        );
    }

    function sellProduct(
        string memory lotID,
        address buyerID,
        uint256 amount
    ) public {
        supplyChain.sellProduct(lotID, buyerID, amount);
    }
}
