package com.bigauction.big_auction.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Builder
public class WalletResponse {
    private Long id;
    private BigDecimal balance;
    private BigDecimal rewardCredits;
    private List<WalletTransactionResponse> transactions;
}
