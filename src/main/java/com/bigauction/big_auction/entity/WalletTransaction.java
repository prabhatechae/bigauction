package com.bigauction.big_auction.entity;

import com.bigauction.big_auction.enums.TransactionReason;
import com.bigauction.big_auction.enums.TransactionType;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "wallet_transactions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WalletTransaction extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "wallet_id", nullable = false)
    private Wallet wallet;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "varchar(255)")
    private TransactionType type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "varchar(255)")
    private TransactionReason reason;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal amount;

    // Reference to the auction this transaction is related to (optional)
    private Long auctionId;

    private String note;

    // Set on CREDIT transactions when credit expiry is enabled
    private LocalDateTime expiresAt;

    // Flipped to true by the expiry scheduler once the credit has been deducted
    @Column(nullable = false)
    @Builder.Default
    private boolean expired = false;
}
