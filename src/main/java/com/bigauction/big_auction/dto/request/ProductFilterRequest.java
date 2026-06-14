package com.bigauction.big_auction.dto.request;

import com.bigauction.big_auction.enums.AuctionStatus;
import com.bigauction.big_auction.enums.ConditionGrade;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class ProductFilterRequest {
    private String brand;
    private Long categoryId;
    private ConditionGrade conditionGrade;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    private AuctionStatus auctionStatus;
    private Boolean buyNowAvailable; // true = only products with buyNowPrice set and not sold
}
