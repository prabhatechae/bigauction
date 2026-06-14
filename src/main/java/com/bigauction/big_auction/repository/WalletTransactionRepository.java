package com.bigauction.big_auction.repository;

import com.bigauction.big_auction.entity.WalletTransaction;
import com.bigauction.big_auction.enums.TransactionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public interface WalletTransactionRepository extends JpaRepository<WalletTransaction, Long> {

    List<WalletTransaction> findByWalletIdOrderByCreatedAtDesc(Long walletId);

    // Used by the expiry scheduler — finds credits that have passed their expiry date and haven't been processed yet
    List<WalletTransaction> findByTypeAndExpiredFalseAndExpiresAtIsNotNullAndExpiresAtBefore(
            TransactionType type,
            LocalDateTime now
    );

    @Query("SELECT COALESCE(SUM(wt.amount), 0) FROM WalletTransaction wt WHERE wt.type = :type")
    BigDecimal sumAmountByType(@Param("type") TransactionType type);
}
