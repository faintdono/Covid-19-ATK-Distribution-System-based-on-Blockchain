//SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "./Types.sol";

contract OrderManagement {
    Types.Order[] internal orders;
    mapping(string => Types.Order) internal order;

    // event that notifies clients about the new order
    event NewOrder(address indexed from, address indexed to, uint256 value);

    function createOrder() public {
        emit NewOrder(msg.sender, msg.sender, 0);
    }
}
