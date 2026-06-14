package com.bigauction.big_auction.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@Builder
public class ReportResponse {

    // Buy Now orders
    private long buyNowCount;
    private BigDecimal buyNowRevenue;

    // Auction win orders
    private long auctionWinCount;
    private BigDecimal auctionWinRevenue;

    // Combined revenue
    private BigDecimal totalRevenue;

    // Ticket sales
    private long ticketsSold;
    private BigDecimal ticketRevenue;

    // Wallet credits
    private BigDecimal creditsIssued;
    private BigDecimal creditsRedeemed;
}
