package com.bigauction.big_auction.dto.response;

import com.bigauction.big_auction.enums.TransactionReason;
import com.bigauction.big_auction.enums.TransactionType;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Builder
public class WalletTransactionResponse {
    private Long id;
    private TransactionType type;
    private TransactionReason reason;
    private BigDecimal amount;
    private String note;
    private LocalDateTime expiresAt;
    private LocalDateTime createdAt;
}
