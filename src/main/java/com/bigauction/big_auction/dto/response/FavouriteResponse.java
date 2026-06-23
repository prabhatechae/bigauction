package com.bigauction.big_auction.dto.response;

import com.bigauction.big_auction.enums.AuctionStatus;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class FavouriteResponse {
    private Long productId;
    private String productName;
    private String brand;
    private BigDecimal buyNowPrice;
    private List<String> imageUrls;
    // Auction context (null if no auction)
    private Long auctionId;
    private AuctionStatus auctionStatus;
    private BigDecimal currentHighestBid;
    private LocalDateTime savedAt;
}
