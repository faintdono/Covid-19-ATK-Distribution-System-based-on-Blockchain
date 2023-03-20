//SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "./Types.sol";

contract Registry {
    address public owner;
    uint256 public count = 0;

    constructor() {
        owner = msg.sender;
    }

    mapping(uint40 => Types.UserRecord) private userRecords;

    uint40[] userRecordArray;

    function createRecord(uint40 _dunsOrTaxNum, address _stakeholder) internal {
        require(msg.sender == owner, "Only owner can create stakeholders");
        count++;
        userRecords[_dunsOrTaxNum] = Types.UserRecord(
            _dunsOrTaxNum,
            _stakeholder
        );
        userRecordArray.push(_dunsOrTaxNum);
    }

    function isExist(address _input) internal view returns (bool) {
        return checkUserRecords(_input);
    }

    function checkUserRecords(address _input) internal view returns (bool) {
        uint32 i = 0;
        while (i <= userRecordArray.length) {
            if (getAddress(i) == _input) {
                return true;
            }
            i++;
        }
        return false;
    }

    function getID() public view returns (uint40[] memory) {
        return userRecordArray;
    }

    function getAddress(uint40 _dunsOrTaxNum) internal view returns (address) {
        return userRecords[_dunsOrTaxNum].stakeAddress;
    }
}
