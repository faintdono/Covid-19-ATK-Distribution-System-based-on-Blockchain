// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract Registry {
    address public owner;
    uint256 public count = 0;

    struct stakeholder {
        uint256 id;
        address stakeAddress;
    }

    constructor() {
        owner = msg.sender;
    }

    mapping(uint256 => stakeholder) private stakeholders;

    uint256[] stakeArray;

    function createStakeholder(address _stakeholder) public {
        require(msg.sender == owner, "Only owner can create stakeholders");
        count++;
        stakeholders[count] = stakeholder(count, _stakeholder);
        stakeArray.push(count);
    }

    function getID() public view returns (uint256[] memory) {
        return stakeArray;
    }

    function getAddress(uint256 _id) private view returns (address) {
        return stakeholders[_id].stakeAddress;
    }

    function checkStakeholders(address _input) public view returns (bool) {
        uint256 i = 0;
        while (i <= stakeArray.length) {
            if (getAddress(i) == _input) {
                return true;
            }
            i++;
        }return false;
    }
}

