package com.bigauction.big_auction.entity;

import com.bigauction.big_auction.enums.OrderStatus;
import com.bigauction.big_auction.enums.OrderType;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    // Null when it's a direct Buy Now without an active auction
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "auction_id")
    private Auction auction;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderType type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private OrderStatus status = OrderStatus.PENDING;

    // The final price the user pays (after credit deduction)
    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal totalAmount;

    // How much wallet credit was applied to this order
    @Column(nullable = false, precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal creditApplied = BigDecimal.ZERO;

    // Shipping address
    private String shippingName;
    private String shippingPhone;
    private String shippingAddress;
    private String shippingCity;
    private String shippingCountry;
}
