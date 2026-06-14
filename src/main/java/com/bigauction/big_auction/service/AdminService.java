package com.bigauction.big_auction.service;

import com.bigauction.big_auction.dto.request.CreditConfigRequest;
import com.bigauction.big_auction.entity.CreditConfig;
import com.bigauction.big_auction.repository.CreditConfigRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final CreditConfigRepository creditConfigRepository;
    private final WalletService walletService;

    /**
     * Saves or replaces the global credit configuration.
     * Only one config record is kept — the existing one is updated, or a new one is created.
     */
    @Transactional
    public CreditConfig saveCreditConfig(CreditConfigRequest request) {
        CreditConfig config = creditConfigRepository.findAll().stream()
                .findFirst()
                .orElse(new CreditConfig());

        config.setCreditPercentage(request.getCreditPercentage());
        config.setMaxCreditPerPurchase(request.getMaxCreditPerPurchase());
        config.setExpiryEnabled(request.isExpiryEnabled());
        config.setExpiryDays(request.getExpiryDays());

        return creditConfigRepository.save(config);
    }

    @Transactional
    public void adjustUserCredit(Long userId, java.math.BigDecimal amount, String note) {
        walletService.adminAdjustCredit(userId, amount, note);
    }
}
