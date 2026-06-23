package com.bigauction.big_auction.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class AutoBidRequest {

    @NotNull(message = "Increment amount is required")
    @Positive(message = "Increment must be positive")
    private BigDecimal increment;

    @NotNull(message = "Maximum limit is required")
    @Positive(message = "Maximum limit must be positive")
    private BigDecimal maxLimit;

    /** Optional starting bid — if provided, the system places this bid immediately on setup. */
    @Positive(message = "Starting bid must be positive")
    private BigDecimal startingBid;
}
