package com.bigauction.big_auction.enums;

public enum BuyNowActivationRule {
    IMMEDIATE,      // Available from the moment auction is created
    TIME_BASED,     // Becomes available after a configured date/time
    THRESHOLD_BASED // Becomes available after X% of tickets are sold
}
