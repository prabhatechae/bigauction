package com.bigauction.big_auction.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class CreditConfigRequest {

    @NotNull(message = "Credit percentage is required")
    @Min(value = 0, message = "Credit percentage cannot be negative")
    @Max(value = 100, message = "Credit percentage cannot exceed 100")
    private BigDecimal creditPercentage;

    @NotNull(message = "Max credit per purchase is required")
    private BigDecimal maxCreditPerPurchase;

    private boolean expiryEnabled;

    // Required only when expiryEnabled = true
    private Integer expiryDays;
}
