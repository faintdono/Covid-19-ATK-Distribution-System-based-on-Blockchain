//SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;
import "./Types.sol";
import "./Registry.sol";
import "./AccessControl/ManufacturerRole.sol";
import "./AccessControl/WholesalerRole.sol";
import "./AccessControl/DistributorRole.sol";
import "./AccessControl/RetailerRole.sol";

contract Registration is
    Registry,
    ManufacturerRole,
    WholesalerRole,
    DistributorRole,
    RetailerRole
{
    mapping(address => Types.UserDetails) internal users;

    event UserAdded(address indexed _id);

    function addUser(
        uint32 _dunsOrTaxNum,
        string memory _Role,
        address _id,
        string memory _name,
        string memory _email
    ) public onlyOwner {
        if (compareStrings(_Role, "manufacturer")) {
            addManufacturer(_id);
            users[_id] = Types.UserDetails({
                role: Types.UserRole.manufacturer,
                id_: _id,
                name: _name,
                email: _email
            });
        } else if (compareStrings(_Role, "distributor")) {
            addDistributor(_id);
            users[_id] = Types.UserDetails({
                role: Types.UserRole.distributor,
                id_: _id,
                name: _name,
                email: _email
            });
        } else if (compareStrings(_Role, "wholesaler")) {
            addWholesaler(_id);
            users[_id] = Types.UserDetails({
                role: Types.UserRole.wholesaler,
                id_: _id,
                name: _name,
                email: _email
            });
        } else if (compareStrings(_Role, "retailer")) {
            addRetailer(_id);
            users[_id] = Types.UserDetails({
                role: Types.UserRole.retailer,
                id_: _id,
                name: _name,
                email: _email
            });
        }

        if (!isExist(_id)) {
            createRecord(_dunsOrTaxNum, _id);
            emit UserAdded(_id);
        }
    }

    function getUserDetails(
        address _id
    ) public view returns (Types.UserDetails memory) {
        return users[_id];
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function.");
        _;
    }

    function compareStrings(
        string memory a,
        string memory b
    ) internal pure returns (bool) {
        return (keccak256(abi.encodePacked(a)) ==
            keccak256(abi.encodePacked(b)));
    }
}
