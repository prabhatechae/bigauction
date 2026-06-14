package com.bigauction.big_auction.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class BidRequest {

    @NotNull(message = "Bid amount is required")
    private BigDecimal amount;
}
