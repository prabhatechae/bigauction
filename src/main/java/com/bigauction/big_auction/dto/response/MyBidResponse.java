package com.bigauction.big_auction.dto.response;

import com.bigauction.big_auction.enums.AuctionStatus;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Returned by GET /api/auctions/my-bids
 * Enriched bid view with auction and product context for the bidder.
 */
@Getter
@Builder
public class MyBidResponse {
    private Long id;
    private BigDecimal amount;
    private String currency;
    private LocalDateTime createdAt;
    private boolean isWinning;      // true if this user is currently the highest bidder

    // Auction context
    private Long auctionId;
    private AuctionStatus auctionStatus;
    private BigDecimal currentHighestBid;
    private LocalDateTime scheduledEndTime;

    // Product context
    private Long productId;
    private String productName;
    private String brand;
    private List<String> imageUrls;
}
