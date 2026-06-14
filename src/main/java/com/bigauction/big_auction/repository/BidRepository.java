package com.bigauction.big_auction.repository;

import com.bigauction.big_auction.entity.Bid;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BidRepository extends JpaRepository<Bid, Long> {

    List<Bid> findByAuctionIdOrderByAmountDesc(Long auctionId);

    List<Bid> findByUserId(Long userId);

    List<Bid> findByUserIdOrderByCreatedAtDesc(Long userId);

    Optional<Bid> findTopByAuctionIdOrderByAmountDesc(Long auctionId);
}
