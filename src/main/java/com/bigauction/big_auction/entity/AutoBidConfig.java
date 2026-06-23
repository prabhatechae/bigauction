package com.bigauction.big_auction.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "auto_bid_configs",
        uniqueConstraints = @UniqueConstraint(columnNames = {"auction_id", "user_id"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AutoBidConfig extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "auction_id", nullable = false)
    private Auction auction;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /** Amount to increment above the current highest bid when outbid. */
    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal increment;

    /** Auto bidding stops when the next bid would exceed this limit. */
    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal maxLimit;

    @Column(nullable = false)
    private boolean enabled = true;
}
