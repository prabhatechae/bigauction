package com.bigauction.big_auction.enums;

public enum AuctionStatus {
    PENDING,   // Created but not yet started
    ACTIVE,    // Bidding is live
    CLOSED,    // Ended with no winner (e.g. no bids)
    SOLD       // Item sold (Buy Now or auction winner)
}
