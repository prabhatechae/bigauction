package com.bigauction.big_auction.entity;

import com.bigauction.big_auction.enums.WishlistStatus;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "wishlist_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WishlistItem extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String brand;

    @Column(nullable = false)
    private String itemModel;

    @Column(precision = 12, scale = 2)
    private BigDecimal budgetMin;

    @Column(precision = 12, scale = 2)
    private BigDecimal budgetMax;

    @Column(columnDefinition = "TEXT")
    private String notes;

    private String photoUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private WishlistStatus status = WishlistStatus.SUBMITTED;
}
