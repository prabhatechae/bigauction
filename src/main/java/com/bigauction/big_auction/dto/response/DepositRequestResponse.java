package com.bigauction.big_auction.dto.response;

import com.bigauction.big_auction.enums.DepositStatus;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Builder
public class DepositRequestResponse {
    private Long id;
    private Long userId;
    private String userName;
    private String userEmail;
    private BigDecimal amount;
    private String bankReference;
    private String userNote;
    private DepositStatus status;
    private String adminNote;
    private LocalDateTime createdAt;
}
