package com.bigauction.big_auction.dto.response;

import com.bigauction.big_auction.enums.WishlistStatus;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Builder
public class WishlistItemResponse {
    private Long id;
    private String brand;
    private String itemModel;
    private BigDecimal budgetMin;
    private BigDecimal budgetMax;
    private String notes;
    private String photoUrl;
    private WishlistStatus status;
    private LocalDateTime createdAt;
}
