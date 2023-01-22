pragma solidity ^0.8.0;

contract ProductRegistration {
    struct Product {
        string LotID;
        string ProductName;
        string Manufacturer;
        uint256 ManufacturingDate;
        uint256 ExpiryDate;
        uint256 Timestamp;
        address Owner;
        uint256 ProductAmount;
        (int256, int256) Location;
        string Status;
        string Comment;
    }

    mapping (string => Product) private products;

    function registerProduct(string memory _LotID, string memory _ProductName, string memory _Manufacturer, uint256 _ManufacturingDate, uint256 _ExpiryDate, address _Owner, uint256 _ProductAmount, int256 _LocationLat, int256 _LocationLong, string memory _Status, string memory _Comment) public {
        require(_LotID != "");
        require(_ProductName != "");
        require(_Manufacturer != "");
        require(_ManufacturingDate != 0);
        require(_ExpiryDate != 0);
        require(_Owner != address(0));
        require(_ProductAmount != 0);
        require(_LocationLat != 0 && _LocationLong != 0);
        require(_Status != "");
        products[_LotID] = Product(_LotID, _ProductName, _Manufacturer, _ManufacturingDate, _ExpiryDate, now, _Owner, _ProductAmount, (_LocationLat, _LocationLong), _Status, _Comment);
    }

    function getProduct(string memory _LotID) public view returns (string memory, string memory, string memory, uint256, uint256, uint256, address, uint256, (int256, int256), string memory, string memory) {
        return (products[_LotID].LotID, products[_LotID].ProductName, products[_LotID].Manufacturer, products[_LotID].ManufacturingDate, products[_LotID].ExpiryDate, products[_LotID].Timestamp, products[_LotID].Owner, products[_LotID].ProductAmount, products[_LotID].Location, products[_LotID].Status, products[_LotID].Comment);
    }
}
