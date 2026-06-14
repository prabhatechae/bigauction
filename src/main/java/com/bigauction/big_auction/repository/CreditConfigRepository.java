package com.bigauction.big_auction.repository;

import com.bigauction.big_auction.entity.CreditConfig;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CreditConfigRepository extends JpaRepository<CreditConfig, Long> {
    // The active config is always fetched by findById(1L) or findAll().get(0)
}
