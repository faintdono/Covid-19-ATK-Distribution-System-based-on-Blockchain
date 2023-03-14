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
    OrderManagementCaller orderMan;

    constructor(address _RegAddress, address _OrderAddress) {
        registration = RegistrationCaller(_RegAddress);
        orderMan = OrderManagementCaller(_OrderAddress);
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
    )
        public
        verifyCaller(msg.sender) //verifyUser()
    {
        Types.Order memory _order = orderMan.getOrder(orderID);
        Types.UserDetails memory _user = registration.getUserDetails(
            msg.sender
        );
        // if _order.status # I will do it next time
        sell(
            _order.buyerAddress,
            orderID,
            _order.invoice,
            _order.lotID,
            _order.sku,
            _ledgerKey,
            _order.amount
        );
    }

    function returnProduct(
        string memory orderID,
        bytes32 _ledgerKey,
        bytes32 _productKey
    ) public verifyCaller(msg.sender) {}

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
        string memory orderID,
        bytes32 _ledgerKey
    ) external {
        supplyChain.sellProduct(orderID, _ledgerKey);
    }
}
