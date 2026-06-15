package com.bigauction.big_auction.service;

import com.bigauction.big_auction.dto.response.WalletResponse;
import com.bigauction.big_auction.dto.response.WalletTransactionResponse;
import com.bigauction.big_auction.entity.Auction;
import com.bigauction.big_auction.entity.CreditConfig;
import com.bigauction.big_auction.entity.Ticket;
import com.bigauction.big_auction.entity.Wallet;
import com.bigauction.big_auction.entity.WalletTransaction;
import com.bigauction.big_auction.enums.TransactionReason;
import com.bigauction.big_auction.enums.TransactionType;
import com.bigauction.big_auction.exception.AppException;
import com.bigauction.big_auction.repository.CreditConfigRepository;
import com.bigauction.big_auction.repository.TicketRepository;
import com.bigauction.big_auction.repository.WalletRepository;
import com.bigauction.big_auction.repository.WalletTransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class WalletService {

    private final WalletRepository walletRepository;
    private final WalletTransactionRepository transactionRepository;
    private final TicketRepository ticketRepository;
    private final CreditConfigRepository creditConfigRepository;

    @Transactional(readOnly = true)
    public WalletResponse getWallet(Long userId) {
        Wallet wallet = getWalletByUserId(userId);
        List<WalletTransactionResponse> transactions = transactionRepository
                .findByWalletIdOrderByCreatedAtDesc(wallet.getId())
                .stream()
                .map(this::toTransactionResponse)
                .toList();

        return WalletResponse.builder()
                .id(wallet.getId())
                .balance(wallet.getBalance())
                .transactions(transactions)
                .build();
    }

    /**
     * Issues platform credit to all ticket holders who did not win the auction.
     * If expiry is enabled in the credit config, an expiry date is set on each transaction.
     * Called automatically when an auction ends (win or Buy Now).
     */
    @Transactional
    public void distributeCreditsToLosers(Auction auction, Long winnerId) {
        CreditConfig config = creditConfigRepository.findAll().stream().findFirst().orElse(null);
        if (config == null) return; // No credit config set — skip distribution silently
        List<Ticket> losingTickets = ticketRepository.findByAuctionIdAndUserIdNot(auction.getId(), winnerId);

        // Deduplicate — a user may have bought multiple tickets; credit once per user
        losingTickets.stream()
                .map(ticket -> ticket.getUser().getId())
                .distinct()
                .forEach(userId -> {
                    BigDecimal credit = auction.getTicketPrice()
                            .multiply(config.getCreditPercentage())
                            .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);

                    LocalDateTime expiresAt = config.isExpiryEnabled() && config.getExpiryDays() != null
                            ? LocalDateTime.now().plusDays(config.getExpiryDays())
                            : null;

                    creditWallet(userId, credit, TransactionReason.AUCTION_LOSS_CREDIT,
                            "Credit for auction #" + auction.getId(), auction.getId(), expiresAt);
                });
    }

    /**
     * Deducts wallet credit from a user's balance for a purchase.
     * Returns the actual amount deducted (capped by balance and config limits).
     */
    @Transactional
    public BigDecimal applyCredit(Long userId, BigDecimal requestedCredit, TransactionReason reason, Long auctionId) {
        CreditConfig config = creditConfigRepository.findAll().stream().findFirst().orElse(null);
        Wallet wallet = getWalletByUserId(userId);

        // Cap credit to configured maximum (if config exists) and wallet balance
        BigDecimal maxCredit = config != null ? config.getMaxCreditPerPurchase() : requestedCredit;
        BigDecimal applicable = requestedCredit
                .min(maxCredit)
                .min(wallet.getBalance());

        if (applicable.compareTo(BigDecimal.ZERO) > 0) {
            wallet.setBalance(wallet.getBalance().subtract(applicable));
            walletRepository.save(wallet);

            WalletTransaction tx = WalletTransaction.builder()
                    .wallet(wallet)
                    .type(TransactionType.DEBIT)
                    .reason(reason)
                    .amount(applicable)
                    .auctionId(auctionId)
                    .build();
            transactionRepository.save(tx);
        }

        return applicable;
    }

    @Transactional
    public void debitForTicket(Long userId, BigDecimal ticketPrice, Long auctionId) {
        Wallet wallet = getWalletByUserId(userId);
        if (wallet.getBalance().compareTo(ticketPrice) < 0) {
            throw new AppException(HttpStatus.BAD_REQUEST,
                    "Insufficient wallet balance. Please top up your wallet to purchase a ticket.");
        }
        wallet.setBalance(wallet.getBalance().subtract(ticketPrice));
        walletRepository.save(wallet);

        WalletTransaction tx = WalletTransaction.builder()
                .wallet(wallet)
                .type(TransactionType.DEBIT)
                .reason(TransactionReason.TICKET_PURCHASE)
                .amount(ticketPrice)
                .auctionId(auctionId)
                .build();
        transactionRepository.save(tx);
    }

    @Transactional
    public void adminAdjustCredit(Long userId, BigDecimal amount, String note) {
        creditWallet(userId, amount, TransactionReason.ADMIN_ADJUSTMENT, note, null, null);
    }

    @Transactional
    public void approveDeposit(Long userId, BigDecimal amount, Long depositId) {
        creditWallet(userId, amount, TransactionReason.WALLET_DEPOSIT,
                "Deposit #" + depositId + " approved", null, null);
    }

    /**
     * Scheduler: runs once a day to expire credits whose expiry date has passed.
     * For each expired credit transaction, the amount is deducted from the wallet balance
     * and the transaction is marked as expired so it is not processed again.
     */
    @Scheduled(cron = "0 0 2 * * *") // Runs every day at 2:00 AM
    @Transactional
    public void expireStaleCredits() {
        List<WalletTransaction> expired = transactionRepository
                .findByTypeAndExpiredFalseAndExpiresAtIsNotNullAndExpiresAtBefore(
                        TransactionType.CREDIT,
                        LocalDateTime.now()
                );

        for (WalletTransaction tx : expired) {
            Wallet wallet = tx.getWallet();
            BigDecimal deduction = tx.getAmount().min(wallet.getBalance());
            wallet.setBalance(wallet.getBalance().subtract(deduction));
            walletRepository.save(wallet);

            tx.setExpired(true);
            transactionRepository.save(tx);
        }
    }

    // ---- Private helpers ----

    private void creditWallet(Long userId, BigDecimal amount, TransactionReason reason,
                               String note, Long auctionId, LocalDateTime expiresAt) {
        Wallet wallet = getWalletByUserId(userId);
        wallet.setBalance(wallet.getBalance().add(amount));
        walletRepository.save(wallet);

        WalletTransaction tx = WalletTransaction.builder()
                .wallet(wallet)
                .type(TransactionType.CREDIT)
                .reason(reason)
                .amount(amount)
                .auctionId(auctionId)
                .note(note)
                .expiresAt(expiresAt)
                .build();
        transactionRepository.save(tx);
    }

    private Wallet getWalletByUserId(Long userId) {
        return walletRepository.findByUserId(userId)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Wallet not found for user"));
    }

    private CreditConfig getActiveCreditConfig() {
        return creditConfigRepository.findAll().stream().findFirst()
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Credit configuration not set. Please contact admin."));
    }

    private WalletTransactionResponse toTransactionResponse(WalletTransaction tx) {
        return WalletTransactionResponse.builder()
                .id(tx.getId())
                .type(tx.getType())
                .reason(tx.getReason())
                .amount(tx.getAmount())
                .note(tx.getNote())
                .expiresAt(tx.getExpiresAt())
                .createdAt(tx.getCreatedAt())
                .build();
    }
}
