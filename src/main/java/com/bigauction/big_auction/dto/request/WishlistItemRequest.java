package com.bigauction.big_auction.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class WishlistItemRequest {

    @NotBlank(message = "Brand is required")
    private String brand;

    @NotBlank(message = "Item/model is required")
    private String itemModel;

    private BigDecimal budgetMin;
    private BigDecimal budgetMax;
    private String notes;
    private String photoUrl;
}
