// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract Manufacturer {
    string public manufactuerName;
    uint256 public productCount = 0;

    struct product {
        string LotID;
        uint256 ManufacturingDate;
        uint256 ExpiryDate;
        address Owner;
        uint256 ProductAmount;
        string Status;
    }

    mapping(string => product) public products;
    string[] lotIdarr;

    function setManName(string memory _manufactuer) public {
        manufactuerName = _manufactuer;
    }

    function getManName() public view returns (string memory) {
        return manufactuerName;
    }

    function genProduct(
        string memory _LotID,
        uint256 _ManufacturingDate,
        uint256 _ExpiryDate,
        address _Owner,
        uint256 _ProductAmount,
        string memory _Status
    ) public {
        productCount++;
        products[_LotID] = product(
            _LotID,
            _ManufacturingDate,
            _ExpiryDate,
            _Owner,
            _ProductAmount,
            _Status
        );
        lotIdarr.push(_LotID);
    }

    function getProduct(
        string memory _LotID
    )
        public
        view
        returns (
            string memory,
            uint256,
            uint256,
            address,
            uint256,
            string memory
        )
    {
        return (
            products[_LotID].LotID,
            products[_LotID].ManufacturingDate,
            products[_LotID].ExpiryDate,
            products[_LotID].Owner,
            products[_LotID].ProductAmount,
            products[_LotID].Status
        );
    }

    function getLotID() public view returns (string[] memory) {
        return lotIdarr;
    }

    function updateOwnerShip(
        string memory _LotID,
        address _Owner,
        string memory _Status
    ) public {
        products[_LotID].Owner = _Owner;
        products[_LotID].Status = _Status;
    }
}
