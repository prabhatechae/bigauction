package com.bigauction.big_auction.dto.request;

import com.bigauction.big_auction.enums.AuthenticationStatus;
import com.bigauction.big_auction.enums.ConditionGrade;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
public class ProductRequest {

    @NotBlank(message = "Brand is required")
    private String brand;

    @NotBlank(message = "Product name is required")
    private String name;

    @NotNull(message = "Category is required")
    private Long categoryId;

    @NotNull(message = "Condition grade is required")
    private ConditionGrade conditionGrade;

    private String description;
    private String wearNotes;
    private String sourceCountry;
    private String authenticationNote;
    private String modelName;
    private String serialNumber;
    private String yearOfManufacture;
    private AuthenticationStatus authenticationStatus;
    private String certificateNumber;
    private String provenance;
    private boolean includesBox;
    private boolean includesDustBag;
    private boolean includesAuthCard;
    private boolean includesWarrantyCard;
    private boolean includesOriginalReceipt;

    // Optional — only set if this product supports Buy Now
    private BigDecimal buyNowPrice;

    // Image URLs to attach (uploaded separately, URLs passed here)
    private List<String> imageUrls;
}
