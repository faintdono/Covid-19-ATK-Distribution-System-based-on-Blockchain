// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract Manufacturer {
    string public manufactuerName;
    uint256 public productCount = 0;
    address owner;

    constructor(string memory _manufacturerName) {
        manufactuerName = _manufacturerName;
        owner = msg.sender;
    }

    struct product {
        string LotID;
        uint256 ManufacturingDate;
        uint256 ExpiryDate;
        uint256 ProductAmount;
        string Status;
    }

    mapping(string => product) public products;
    string[] lotIdarr;

    function getManName() public view returns (string memory) {
        return manufactuerName;
    }

    function genProduct(
        string memory _LotID,
        uint256 _ManufacturingDate,
        uint256 _ExpiryDate,
        uint256 _ProductAmount,
        string memory _Status
    ) public {
        productCount++;
        products[_LotID] = product(
            _LotID,
            _ManufacturingDate,
            _ExpiryDate,
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
        returns (string memory, uint256, uint256, uint256, string memory)
    {
        return (
            products[_LotID].LotID,
            products[_LotID].ManufacturingDate,
            products[_LotID].ExpiryDate,
            products[_LotID].ProductAmount,
            products[_LotID].Status
        );
    }

    function getLotID() public view returns (string[] memory) {
        return lotIdarr;
    }
}
