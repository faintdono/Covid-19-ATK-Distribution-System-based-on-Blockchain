//SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "./Types.sol";

contract OrderManagement {
    Types.Order[] internal orders;
    mapping(string => Types.Order) internal order;
    mapping(address => string[]) internal userLinkedOrders;

    // event that notifies clients about the new order
    event NewOrder(
        string orderID,
        address indexed from,
        address indexed to,
        uint256 value,
        uint256 date
    );

    function createOrder(address _seller, uint256 _amount) public {
        Types.Order memory _order = Types.Order({
            orderID: string(abi.encodePacked(block.timestamp, msg.sender)),
            buyerAddress: msg.sender,
            sellerAddress: _seller,
            amount: _amount,
            date: block.timestamp,
            lotID: "",
            status: Types.OrderStatus.placed,
            lastUpdated: block.timestamp
        });
        orders.push(_order);
        order[string(abi.encodePacked(block.timestamp, msg.sender))] = _order;
        emit NewOrder(
            string(abi.encodePacked(block.timestamp, msg.sender)),
            msg.sender,
            _seller,
            _amount,
            block.timestamp
        );
    }

    function confirmOrder(string memory _orderID) public onlyReceiver(_orderID) {
        Types.Order storage _order = order[_orderID];
        _order.status = Types.OrderStatus.pending;
        _order.lastUpdated = block.timestamp;
    }

    function shipOrder(string memory _orderID) public onlyReceiver(_orderID) {
        Types.Order storage _order = order[_orderID];
        _order.status = Types.OrderStatus.shipped;
        _order.lastUpdated = block.timestamp;
    }

    function acceptOrder(string memory _orderID) public onlySender(_orderID) {
        Types.Order storage _order = order[_orderID];
        _order.status = Types.OrderStatus.delivered;
        _order.lastUpdated = block.timestamp;
    }

    function cancelOrder(string memory _orderID) public onlySender(_orderID) {
        Types.Order storage _order = order[_orderID];
        _order.status = Types.OrderStatus.cancelled;
        _order.lastUpdated = block.timestamp;
    }

    function getOrder(
        string memory _orderID
    ) public view returns (Types.Order memory) {
        return order[_orderID];
    }

    function getOrders() public view returns (Types.Order[] memory) {
        return orders;
    }

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
}
