package com.bigauction.big_auction.repository;

import com.bigauction.big_auction.entity.AutoBidConfig;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AutoBidConfigRepository extends JpaRepository<AutoBidConfig, Long> {

    Optional<AutoBidConfig> findByAuctionIdAndUserId(Long auctionId, Long userId);

    Optional<AutoBidConfig> findByAuctionIdAndUserIdAndEnabledTrue(Long auctionId, Long userId);

    List<AutoBidConfig> findByAuctionIdAndEnabledTrue(Long auctionId);
}
