package com.bigauction.big_auction.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class UserAddressResponse {
    private Long id;
    private String label;
    private String fullName;
    private String phone;
    private String addressLine1;
    private String addressLine2;
    private String city;
    private String country;
    private String emirate;
    private String poBox;
    private boolean isDefault;
    private LocalDateTime createdAt;
}
