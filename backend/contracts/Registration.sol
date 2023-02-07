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

    function addUser(string memory _Role, address _id) public {
        if (compareStrings(_Role, "manufacturer")) {
            addManufacturer(_id);
        } else if (compareStrings(_Role, "distributor")) {
            addDistributor(_id);
        } else if (compareStrings(_Role, "wholesaler")) {
            addWholesaler(_id);
        } else if (compareStrings(_Role, "retailer")) {
            addRetailer(_id);
        }
    }

    constructor() {}

    function compareStrings(
        string memory a,
        string memory b
    ) internal pure returns (bool) {
        return (keccak256(abi.encodePacked(a)) ==
            keccak256(abi.encodePacked(b)));
    }
}

contract RegistrationCaller {
    Registration registration;

    constructor(address _registration) {
        registration = Registration(_registration);
    }

    function isManufacturer(address _address) external view returns (bool) {
        return registration.isManufacturer(_address);
    }

    function isDistributor(address _address) external view returns (bool) {
        return registration.isDistributor(_address);
    }

    function isWholesaler(address _address) external view returns (bool) {
        return registration.isWholesaler(_address);
    }

    function isRetailer(address _address) external view returns (bool) {
        return registration.isRetailer(_address);
    }
}
