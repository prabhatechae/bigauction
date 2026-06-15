package com.bigauction.big_auction.entity;

import com.bigauction.big_auction.enums.AuctionStartCondition;
import com.bigauction.big_auction.enums.AuctionStatus;
import com.bigauction.big_auction.enums.BuyNowActivationRule;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "auctions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Auction extends BaseEntity {

    @OneToOne
    @JoinColumn(name = "product_id", nullable = false, unique = true)
    private Product product;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private AuctionStatus status = AuctionStatus.PENDING;

    // ---- Currency ----

    @Column(nullable = false, length = 3)
    @Builder.Default
    private String currency = "AED";

    // ---- Ticket Settings ----

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal ticketPrice;

    // Total number of tickets that must be sold before or during the auction
    @Column(nullable = false)
    private int ticketTarget;

    @Column(nullable = false)
    @Builder.Default
    private int ticketsSold = 0;

    // ---- Start Conditions ----

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AuctionStartCondition startCondition;

    // Used when startCondition = SCHEDULED
    private LocalDateTime scheduledStartTime;

    private LocalDateTime actualStartTime;

    // Optional: if set, the scheduler will auto-close the auction at this time
    private LocalDateTime scheduledEndTime;

    private LocalDateTime endTime;

    // ---- Buy Now Settings ----

    @Column(nullable = false)
    @Builder.Default
    private boolean buyNowEnabled = false;

    @Enumerated(EnumType.STRING)
    private BuyNowActivationRule buyNowActivationRule;

    // Used when buyNowActivationRule = TIME_BASED
    private LocalDateTime buyNowActivationTime;

    // Used when buyNowActivationRule = THRESHOLD_BASED (0-100 percent of tickets sold)
    private Integer buyNowActivationThreshold;

    // ---- Estimate & Reserve ----

    @Column(precision = 12, scale = 2)
    private BigDecimal estimateLow;

    @Column(precision = 12, scale = 2)
    private BigDecimal estimateHigh;

    @Column(precision = 12, scale = 2)
    private BigDecimal reservePrice;

    @Column(precision = 10, scale = 2)
    private BigDecimal bidIncrement;

    // ---- Bidding ----

    // Optional cap — bids above this amount are rejected
    @Column(precision = 12, scale = 2)
    private BigDecimal maxBidAmount;

    @Column(precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal currentHighestBid = BigDecimal.ZERO;

    @Column(nullable = false, columnDefinition = "integer default 0")
    @Builder.Default
    private int bidCount = 0;

    // The user who currently holds the highest bid
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "highest_bidder_id")
    private User highestBidder;

    // ---- Winner ----

    // Set when the auction ends with a winner (auction win) or a buyer (Buy Now)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "winner_id")
    private User winner;

    // ---- Relations ----

    @OneToMany(mappedBy = "auction", cascade = CascadeType.ALL)
    @Builder.Default
    private List<Ticket> tickets = new ArrayList<>();

    @OneToMany(mappedBy = "auction", cascade = CascadeType.ALL)
    @Builder.Default
    private List<Bid> bids = new ArrayList<>();
}
