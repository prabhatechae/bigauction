package com.bigauction.big_auction.enums;

public enum AuctionStartCondition {
    SCHEDULED,          // Starts at a configured date/time
    ALL_TICKETS_SOLD,   // Starts once all tickets are purchased
    ADMIN_TRIGGERED     // Admin manually activates it
}
