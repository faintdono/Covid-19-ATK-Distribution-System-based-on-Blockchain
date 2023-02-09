//SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

// Import the library 'Roles'
import "./Roles.sol";

// Define a contract 'WholesalerRole' to manage this role - add, remove, check
contract WholesalerRole {
  using Roles for Roles.Role;

  // Define 2 events, one for Adding, and other for Removing
  event WholesalerAdded(address indexed account);
  event WholesalerRemoved(address indexed account);

  // Define a struct 'wholesalers' by inheriting from 'Roles' library, struct Role
  Roles.Role private wholesalers;

  // In the constructor make the address that deploys this contract the 1st wholesaler
  constructor() {
    _addWholesaler(msg.sender);
  }

  // Define a modifier that checks to see if msg.sender has the appropriate role
  modifier onlyWholesaler() {
    require(isWholesaler(msg.sender));
    _;
  }

  // Define a function 'isWholesaler' to check this role
  function isWholesaler(address account) public view returns (bool) {
    return wholesalers.has(account);
  }

  // Define a function 'addWholesaler' that adds this role
  function addWholesaler(address account) internal onlyWholesaler {
    _addWholesaler(account);
  }

  // Define a function 'renounceWholesaler' to renounce this role
  function renounceWholesaler() internal {
    _removeWholesaler(msg.sender);
  }

  // Define an internal function '_addWholesaler' to add this role, called by 'addWholesaler'
  function _addWholesaler(address account) internal {
    wholesalers.add(account);
    emit WholesalerAdded(account);
  }

  // Define an internal function '_removeWholesaler' to remove this role, called by 'removeWholesaler'
  function _removeWholesaler(address account) internal {
    wholesalers.remove(account);
    emit WholesalerRemoved(account);
  }
}