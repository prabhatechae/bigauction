package com.bigauction.big_auction.entity;

import com.bigauction.big_auction.enums.DepositStatus;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "deposit_requests")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DepositRequest extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal amount;

    // Bank transfer reference number provided by the user
    @Column(nullable = false)
    private String bankReference;

    // Optional note from the user (e.g., which bank, transfer date)
    private String userNote;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private DepositStatus status = DepositStatus.PENDING;

    // Admin's note when approving or rejecting
    private String adminNote;
}
