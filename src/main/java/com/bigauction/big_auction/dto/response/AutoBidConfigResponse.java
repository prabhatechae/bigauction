package com.bigauction.big_auction.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@Builder
public class AutoBidConfigResponse {
    private Long auctionId;
    private Long userId;
    private BigDecimal increment;
    private BigDecimal maxLimit;
    private boolean enabled;
}
