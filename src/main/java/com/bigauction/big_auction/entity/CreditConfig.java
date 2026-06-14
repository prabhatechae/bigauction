package com.bigauction.big_auction.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

/**
 * Global admin-configurable rules for the wallet credit system.
 * Only one active record is used at a time (id = 1).
 */
@Entity
@Table(name = "credit_config")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreditConfig extends BaseEntity {

    // Percentage of ticket price to credit back to losing participants (e.g. 10 = 10%)
    @Column(nullable = false, precision = 5, scale = 2)
    private BigDecimal creditPercentage;

    // Maximum credit amount a user can apply to a single purchase
    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal maxCreditPerPurchase;

    // Whether credits expire
    @Column(nullable = false)
    @Builder.Default
    private boolean expiryEnabled = false;

    // Number of days before credit expires (only relevant when expiryEnabled = true)
    private Integer expiryDays;
}
