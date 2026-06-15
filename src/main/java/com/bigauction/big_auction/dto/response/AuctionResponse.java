package com.bigauction.big_auction.dto.response;

import com.bigauction.big_auction.enums.AuctionStartCondition;
import com.bigauction.big_auction.enums.AuctionStatus;
import com.bigauction.big_auction.enums.BuyNowActivationRule;
import com.bigauction.big_auction.enums.ConditionGrade;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class AuctionResponse {
    private Long id;
    private AuctionStatus status;
    private String currency;
    private BigDecimal ticketPrice;
    private int ticketTarget;
    private int ticketsSold;
    private AuctionStartCondition startCondition;
    private LocalDateTime scheduledStartTime;
    private LocalDateTime scheduledEndTime;
    private LocalDateTime actualStartTime;
    private LocalDateTime endTime;
    private boolean buyNowEnabled;
    private BuyNowActivationRule buyNowActivationRule;
    private BigDecimal estimateLow;
    private BigDecimal estimateHigh;
    private BigDecimal reservePrice;
    private BigDecimal bidIncrement;
    private BigDecimal maxBidAmount;
    private BigDecimal currentHighestBid;
    private int bidCount;
    private String highestBidderName;
    private Long winnerId;
    private String winnerName;
    private LocalDateTime createdAt;

    // Embedded product summary — populated when fetching auctions directly
    private ProductSummary product;

    @Getter
    @Builder
    public static class ProductSummary {
        private Long id;
        private String name;
        private String brand;
        private String sourceCountry;
        private ConditionGrade conditionGrade;
        private List<String> imageUrls;
        private BigDecimal buyNowPrice;
        private boolean sold;
    }
}
