// SPDX-License-Identifier: Unlicense
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

    //enum ProductType {}

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
}
