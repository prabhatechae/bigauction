package com.bigauction.big_auction.entity;

import com.bigauction.big_auction.enums.AuthenticationStatus;
import com.bigauction.big_auction.enums.ConditionGrade;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product extends BaseEntity {

    @Column(nullable = false)
    private String brand;

    @Column(nullable = false)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ConditionGrade conditionGrade;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String wearNotes;

    private String sourceCountry;

    @Column(columnDefinition = "TEXT")
    private String authenticationNote;

    private String modelName;

    private String serialNumber;

    private String yearOfManufacture;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private AuthenticationStatus authenticationStatus = AuthenticationStatus.PENDING;

    private String certificateNumber;

    @Column(columnDefinition = "TEXT")
    private String provenance;

    @Column(nullable = false)
    @Builder.Default
    private boolean includesBox = false;

    @Column(nullable = false)
    @Builder.Default
    private boolean includesDustBag = false;

    @Column(nullable = false)
    @Builder.Default
    private boolean includesAuthCard = false;

    @Column(nullable = false)
    @Builder.Default
    private boolean includesWarrantyCard = false;

    @Column(nullable = false)
    @Builder.Default
    private boolean includesOriginalReceipt = false;

    // The instant purchase price for this item
    @Column(precision = 12, scale = 2)
    private BigDecimal buyNowPrice;

    @Column(nullable = false)
    @Builder.Default
    private boolean sold = false;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("displayOrder ASC")
    @Builder.Default
    private List<ProductImage> images = new ArrayList<>();

    // An auction is optional — a product may be listed for direct sale only
    @OneToOne(mappedBy = "product", cascade = CascadeType.ALL)
    private Auction auction;
}
