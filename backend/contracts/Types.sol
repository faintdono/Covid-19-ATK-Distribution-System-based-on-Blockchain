//SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

library Types {
    enum UserRole {
        manufacturer,
        distributor,
        wholesaler,
        retailer
    }

    struct UserDetails {
        UserRole role;
        address id_;
        string name;
        string email;
    }

    struct UserHistory {
        address id;
        uint256 date;
    }

    struct ProductHistory {
        UserHistory manufacturer;
        UserHistory[] distributor;
        UserHistory[] wholesaler;
        UserHistory[] retailer;
    }

    struct Product {
        string lotID;
        string manufacturerName;
        address manufacturer;
        string manufacturingDate;
        string expiryDate;
        uint256 productAmount;
    }

    struct Storage {
        address sellerAddress;
        uint256 amount;
    }

    enum State
  {
    createByManufacturer,         
    ForSaleByManufacturer,      
    PurchasedByDistributor,
    ShippedByFarmer,
    ReceivedByDistributor,
    ProcessedByDistributor,
    PackageByDistributor,
    ForSaleByDistributor,
    PurchasedByRetailer,
    ShippedByDistributor,
    ReceivedByRetailer,
    ForSaleByRetailer,
    PurchasedByConsumer
    }
}
