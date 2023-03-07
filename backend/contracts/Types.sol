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
        string sku;
        string manufacturerName;
        address manufacturer;
        string manufacturingDate;
        string expiryDate;
        uint256 productAmount;
    }
    // need to know [owner,orderID, lotID, sku, invoice,key,sellerAddress,amount]
    struct Ledger {
        address owner;
        string orderID;
        string invoice;
        bytes32 key;
        address sellerAddress;
        uint256 amount;
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
        string orderID;
        address buyerAddress;
        address sellerAddress;
        uint256 amount;
        uint256 date;
        string lotID;
        OrderStatus status;
        uint256 lastUpdated;
    }
}
