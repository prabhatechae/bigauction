package com.bigauction.big_auction.dto.response;

import com.bigauction.big_auction.enums.AuthenticationStatus;
import com.bigauction.big_auction.enums.ConditionGrade;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class ProductResponse {
    private Long id;
    private String brand;
    private String name;
    private String category;
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
    private BigDecimal buyNowPrice;
    private boolean sold;
    private List<String> imageUrls;
    private AuctionResponse auction;
    private LocalDateTime createdAt;
}
