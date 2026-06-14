package com.bigauction.big_auction.dto.response;

import com.bigauction.big_auction.enums.AuctionStatus;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Returned by GET /api/users/me/tickets
 * Enriched ticket view with auction and product context.
 */
@Getter
@Builder
public class MyTicketResponse {
    private Long ticketId;
    private LocalDateTime purchasedAt;
    private BigDecimal ticketPrice;
    private String currency;

    // Auction context
    private Long auctionId;
    private AuctionStatus auctionStatus;
    private int ticketsSold;
    private int ticketTarget;
    private LocalDateTime scheduledStartTime;
    private LocalDateTime scheduledEndTime;

    // Product context
    private Long productId;
    private String productName;
    private String brand;
    private List<String> imageUrls;
}
