//SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "./Types.sol";
import "./Registration.sol";

contract OrderManagement {
    Registration registration;
    uint256 internal privateNumber;

    constructor(address _Address) {
        registration = Registration(_Address);
        uint256 randNumber = random();
        uint256 randNumberMod = randNumber % 10;
        privateNumber =
            randNumberMod +
            (randNumberMod * 10) +
            (randNumberMod * 100) +
            (randNumberMod * 1000) +
            (randNumberMod * 10000) +
            (randNumberMod * 100000) +
            197654;
    }

    Types.Order[] internal orders;
    mapping(string => Types.Order) internal order;
    mapping(address => string[]) internal userOngoingLinkedOrders;
    mapping(address => string[]) internal userShippedLinkedOrders;
    mapping(address => string[]) internal userFinishLinkedOrders;

    // event

    event NewOrder(
        string orderID,
        address indexed from,
        address indexed to,
        uint256 value,
        uint256 date
    );

    event OrderStatusChange(
        string orderID,
        uint256 date,
        Types.OrderStatus status
    );

    function createOrder(
        string memory _orderID,
        address _seller,
        uint256 _amount
    ) public verifycaller(msg.sender) {
        Types.Order memory _order = Types.Order({
            buyerAddress: msg.sender,
            sellerAddress: _seller,
            orderID: _orderID,
            invoice: "",
            lotID: "",
            sku: "",
            amount: _amount,
            date: block.timestamp,
            status: Types.OrderStatus.placed,
            lastUpdated: block.timestamp
        });
        orders.push(_order);
        order[_orderID] = _order; // mapping
        linkedOrderHandler(msg.sender, _orderID, Types.OrderStatus.placed);
        linkedOrderHandler(_seller, _orderID, Types.OrderStatus.placed);
        emit NewOrder(_orderID, msg.sender, _seller, _amount, block.timestamp);
    }

    function confirmOrder(
        string memory _orderID,
        string memory _invoice,
        string memory _lotID,
        string memory _sku
    )
        public
        onlyReceiver(_orderID)
        orderConfirmable(_orderID)
        verifycaller(msg.sender)
    {
        Types.Order storage _order = order[_orderID];
        _order.invoice = _invoice;
        _order.lotID = _lotID;
        _order.sku = _sku;
        _order.status = Types.OrderStatus.pending;
        _order.lastUpdated = block.timestamp;
        emit OrderStatusChange(
            _orderID,
            block.timestamp,
            Types.OrderStatus.pending
        );
    }

    function rejectOrder(
        string memory _orderID
    )
        public
        onlyReceiver(_orderID)
        orderRejectable(_orderID)
        verifycaller(msg.sender)
    {
        Types.Order storage _order = order[_orderID];
        _order.status = Types.OrderStatus.rejected;
        _order.lastUpdated = block.timestamp;
        linkedOrderHandler(
            _order.buyerAddress,
            _orderID,
            Types.OrderStatus.rejected
        );
        linkedOrderHandler(
            _order.sellerAddress,
            _orderID,
            Types.OrderStatus.rejected
        );
        emit OrderStatusChange(
            _orderID,
            block.timestamp,
            Types.OrderStatus.rejected
        );
    }

    function shipOrder(
        string memory _orderID
    )
        public
        onlyReceiver(_orderID)
        orderShipable(_orderID)
        verifycaller(msg.sender)
    {
        Types.Order storage _order = order[_orderID];
        _order.status = Types.OrderStatus.shipped;
        _order.lastUpdated = block.timestamp;
        linkedOrderHandler(
            _order.buyerAddress,
            _orderID,
            Types.OrderStatus.shipped
        );
        linkedOrderHandler(
            _order.sellerAddress,
            _orderID,
            Types.OrderStatus.shipped
        );
        emit OrderStatusChange(
            _orderID,
            block.timestamp,
            Types.OrderStatus.shipped
        );
    }

    function acceptOrder(
        string memory _orderID
    )
        public
        onlySender(_orderID)
        orderAcceptable(_orderID)
        verifycaller(msg.sender)
    {
        Types.Order storage _order = order[_orderID];
        _order.status = Types.OrderStatus.delivered;
        _order.lastUpdated = block.timestamp;
        linkedOrderHandler(
            _order.buyerAddress,
            _orderID,
            Types.OrderStatus.delivered
        );
        linkedOrderHandler(
            _order.sellerAddress,
            _orderID,
            Types.OrderStatus.delivered
        );
        emit OrderStatusChange(
            _orderID,
            block.timestamp,
            Types.OrderStatus.delivered
        );
    }

    function cancelOrder(
        string memory _orderID
    )
        public
        onlySender(_orderID)
        orderCancellable(_orderID)
        verifycaller(msg.sender)
    {
        Types.Order storage _order = order[_orderID];
        _order.status = Types.OrderStatus.cancelled;
        _order.lastUpdated = block.timestamp;
        linkedOrderHandler(
            _order.buyerAddress,
            _orderID,
            Types.OrderStatus.cancelled
        );
        linkedOrderHandler(
            _order.sellerAddress,
            _orderID,
            Types.OrderStatus.cancelled
        );
        emit OrderStatusChange(
            _orderID,
            block.timestamp,
            Types.OrderStatus.cancelled
        );
    }

    function onholdOrder(
        string memory _orderID
    ) public onlyReceiver(_orderID) verifycaller(msg.sender) {
        Types.Order storage _order = order[_orderID];
        _order.status = Types.OrderStatus.onhold;
        _order.lastUpdated = block.timestamp;
        emit OrderStatusChange(
            _orderID,
            block.timestamp,
            Types.OrderStatus.onhold
        );
    }

    // getter functions
    function getOrder(
        string memory _orderID
    ) external view returns (Types.Order memory) {
        return order[_orderID];
    }

    function getOrders() external view returns (Types.Order[] memory) {
        return orders;
    }

    function getOngoingOrders(
        address _user
    ) external view returns (string[] memory) {
        return userOngoingLinkedOrders[_user];
    }

    function getShippedOrders(
        address _user
    ) external view returns (string[] memory) {
        return userShippedLinkedOrders[_user];
    }

    function getFinishOrders(
        address _user
    ) external view returns (string[] memory) {
        return userFinishLinkedOrders[_user];
    }

    function getNonce() external view returns (uint256) {
        return privateNumber;
    }

    // internal functions

    function linkedOrderHandler(
        address _user,
        string memory _orderID,
        Types.OrderStatus _status
    ) internal {
        if (_status == Types.OrderStatus.placed) {
            userOngoingLinkedOrders[_user].push(_orderID);
        } else if (_status == Types.OrderStatus.shipped) {
            popMatchOrder(userOngoingLinkedOrders[_user], _orderID);
            userShippedLinkedOrders[_user].push(_orderID);
        } else if (_status == Types.OrderStatus.delivered) {
            popMatchOrder(userShippedLinkedOrders[_user], _orderID);
            userFinishLinkedOrders[_user].push(_orderID);
        } else if (_status == Types.OrderStatus.cancelled) {
            popMatchOrder(userShippedLinkedOrders[_user], _orderID);
            userFinishLinkedOrders[_user].push(_orderID);
        } else if (_status == Types.OrderStatus.rejected) {
            popMatchOrder(userOngoingLinkedOrders[_user], _orderID);
            userFinishLinkedOrders[_user].push(_orderID);
        }
    }

    function popMatchOrder(
        string[] storage _array,
        string memory _orderID
    ) internal {
        for (uint256 i = 0; i < _array.length; i++) {
            if (
                keccak256(abi.encodePacked(_array[i])) ==
                keccak256(abi.encodePacked(_orderID))
            ) {
                _array[i] = _array[_array.length - 1];
                _array.pop();
                break;
            }
        }
    }

    function random() private view returns (uint) {
        return
            uint(
                keccak256(abi.encodePacked(block.difficulty, block.timestamp))
            );
    }

    function increaseNonce() private {
        privateNumber++;
    }

    // function modifiers

    modifier onlyReceiver(string memory _orderID) {
        require(
            msg.sender == order[_orderID].sellerAddress,
            "Only order's receiver can use this function"
        );
        _;
    }

    modifier onlySender(string memory _orderID) {
        require(
            msg.sender == order[_orderID].buyerAddress,
            "Only order's sender can use this function"
        );
        _;
    }

    modifier orderConfirmable(string memory _orderID) {
        require(
            order[_orderID].status == Types.OrderStatus.placed,
            "Order is not confirmable"
        );
        _;
    }

    modifier orderRejectable(string memory _orderID) {
        require(
            order[_orderID].status == Types.OrderStatus.placed,
            "Order is not rejectable"
        );
        _;
    }

    modifier orderShipable(string memory _orderID) {
        require(
            order[_orderID].status == Types.OrderStatus.pending,
            "Order is not shipable"
        );
        _;
    }

    modifier orderAcceptable(string memory _orderID) {
        require(
            order[_orderID].status == Types.OrderStatus.shipped,
            "Order is not acceptable"
        );
        _;
    }

    modifier orderCancellable(string memory _orderID) {
        require(
            order[_orderID].status == Types.OrderStatus.pending,
            "Order is not cancellable"
        );
        _;
    }

    modifier orderOnholdable(string memory _orderID) {
        require(
            order[_orderID].status == Types.OrderStatus.shipped,
            "Order is not onholdable"
        );
        _;
    }

    modifier orderReturnable(string memory _orderID) {
        require(
            order[_orderID].status == Types.OrderStatus.shipped,
            "Order is not returnable"
        );
        _;
    }

    modifier verifycaller(address _address) {
        require(
            registration.isManufacturer(_address) ||
                registration.isDistributor(_address) ||
                registration.isWholesaler(_address) ||
                registration.isRetailer(_address),
            "Only registered users can call this function."
        );
        _;
    }
}
