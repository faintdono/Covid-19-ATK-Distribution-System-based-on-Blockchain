// SPDX-License-Identifier: Unlicense
pragma experimental ABIEncoderV2;
pragma solidity ^0.8.0;

import "./Types.sol";

contract Products {
    Types.Product[] internal products;
    mapping(string => Types.Product) internal product;
    mapping(address => string[]) internal userLinkedProducts;
    mapping(string => Types.ProductHistory) internal productHistory;

    event NewProduct(
        string LotID,
        string ManufacturerName,
        string ManufacturingDate,
        string ExpiryDate,
        uint256 ProductAmount,
        string Status
    );

    event ProductOwnershipTransfer(
        string LotID,
        string ManufacturerName,
        string ManufacturingDate,
        string ExpiryDate,
        string OwnerName
    );

    function getUserProducts() internal view returns (Types.Product[] memory) {
        string[] memory ids_ = userLinkedProducts[msg.sender];
        Types.Product[] memory products_ = new Types.Product[](ids_.length);
        for (uint256 i = 0; i < ids_.length; i++) {
            products_[i] = product[ids_[i]];
        }
        return products_;
    }
    
    //change specific products to get user LotID
    function getUserLotID(string memory LotID_)
        internal
        view
        returns (Types.Product memory, Types.ProductHistory memory)
    {
        return (product[LotID_], productHistory[LotID_]);
    }

    // currentTime_ = transactionTime
    function addAProduct(Types.Product memory product_, uint256 transactionTime_)
        internal
        productNotExists(product_.LotID)
    {
        require(
            product_.Manufacturer == msg.sender,
            "Only manufacturer can add"
        );
        products.push(product_);
        product[product_.LotID] = product_;
        productHistory[product_.LotID].manufacturer = Types.UserHistory({
            id_: msg.sender,
            date: transactionTime_
        });
        userLinkedProducts[msg.sender].push(product_.LotID);
        emit NewProduct(
            product_.LotID, 
            product_.ManufacturerName, 
            product_.ManufacturingDate, 
            product_.ExpiryDate, 
            product_.ProductAmount, 
            product_.Status
        );
    }

    //sell
    //function sell() {
    //We might not need this ?
    //}

    modifier productExists(string memory LotID_) {
        require(!compareStrings(product[LotID_].LotID, ""));
        _;
    }

    modifier productNotExists(string memory LotID_) {
        require (compareStrings(product[LotID_].LotID, ""));
        _;
    }

    // ******
    // NEED TO IMPLEMENT PRODUCTAMOUNT
    function transferOwnership(
        address sellerId_,
        address buyerId_,
        string memory LotID_
    ) internal {
        userLinkedProducts[buyerId_].push(LotID_);
        string[] memory sellerProducts_ = userLinkedProducts[sellerId_];
        uint256 matchIndex_ = (sellerProducts_.length + 1);
        for (uint256 i = 0; i < sellerProducts_.length; i++) {
            if (compareStrings(sellerProducts_[i], LotID_)) {
                matchIndex_ = i;
                break;
            }
        }
        assert(matchIndex_ < sellerProducts_.length);
        if (sellerProducts_.length == 1) {
            delete userLinkedProducts[sellerId_];
        } else {
            userLinkedProducts[sellerId_][matchIndex_] = userLinkedProducts[
                sellerId_
            ][sellerProducts_.length - 1];
            delete userLinkedProducts[sellerId_][sellerProducts_.length - 1];
            userLinkedProducts[sellerId_].pop();
        }
    }

    function compareStrings(string memory a, string memory b)
        internal
        pure
        returns (bool)
    {
        return (keccak256(abi.encodePacked(a)) ==
            keccak256(abi.encodePacked(b)));
    }
}