package com.bigauction.big_auction.dto.response;

import com.bigauction.big_auction.enums.Role;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Builder
public class UserSummaryResponse {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private Role role;
    private BigDecimal walletBalance;
    private LocalDateTime createdAt;
}
