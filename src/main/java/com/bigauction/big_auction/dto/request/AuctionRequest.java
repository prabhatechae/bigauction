package com.bigauction.big_auction.dto.request;

import com.bigauction.big_auction.enums.AuctionStartCondition;
import com.bigauction.big_auction.enums.BuyNowActivationRule;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
public class AuctionRequest {

    @NotNull(message = "Product ID is required")
    private Long productId;

    /** ISO 4217 currency code. Defaults to AED if not supplied. */
    private String currency;

    @NotNull(message = "Ticket price is required")
    private BigDecimal ticketPrice;

    @Min(value = 1, message = "Ticket target must be at least 1")
    private int ticketTarget;

    @NotNull(message = "Start condition is required")
    private AuctionStartCondition startCondition;

    // Required when startCondition = SCHEDULED
    private LocalDateTime scheduledStartTime;

    // Optional: if set, the auction will auto-close at this time
    private LocalDateTime scheduledEndTime;

    private boolean buyNowEnabled;
    private BuyNowActivationRule buyNowActivationRule;
    private LocalDateTime buyNowActivationTime;
    private Integer buyNowActivationThreshold;

    private BigDecimal estimateLow;
    private BigDecimal estimateHigh;
    private BigDecimal reservePrice;
    private BigDecimal bidIncrement;
}
