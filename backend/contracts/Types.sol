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

    struct Product {
        string lotID;
        string sku;
        // string series;
        string manufacturerName;
        address manufacturer;
        string manufacturingDate;
        string expiryDate;
        uint256 productAmount;
    }
    
    // need to know [owner,orderID, lotID, sku, invoice,key,sellerAddress,amount]
    struct Ledger {
        address owner;
        address sellerAddress;
        string orderID;
        string invoice;
        bytes32 key;
        uint256 amount;
    }

    struct Key {
        address owner;
        address sellerAddress;
        string orderID;
        string invoice;
        string lotID;
        string sku;
    }

    enum OrderStatus {
        placed,
        pending,
        rejected,
        shipped,
        delivered,
        cancelled,
        onhold,
        returned
    }

    struct Order {
        address buyerAddress;
        address sellerAddress;
        string orderID;
        string invoice;
        string lotID;
        string sku;
        uint256 amount;
        uint256 date;
        OrderStatus status;
        uint256 lastUpdated;
    }
}
