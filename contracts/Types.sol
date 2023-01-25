// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

library Types {
    enum UserRole {
        Manufacturer,
        Supplier,
        Vendor,
        Custommer
    }

    struct UserDetails {
        UserRole role;
        address id_;
        string name;
        string email;
    }

    //enum ProductType {}

    struct UserHistory {
        address id_;
        uint256 date;
    }

    struct ProductHistory {
        UserHistory manufacturer;
        UserHistory supplier;
        UserHistory vendor;
        UserHistory[] customers;
    }

    struct Product {
        string LotID;
        string ManufacturerName;
        address Manufacturer;
        string ManufacturingDate;
        string ExpiryDate;
        uint256 ProductAmount;
        string Status;
    }
}