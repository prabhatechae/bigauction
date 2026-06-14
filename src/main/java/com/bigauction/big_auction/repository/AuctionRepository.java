package com.bigauction.big_auction.repository;

import com.bigauction.big_auction.entity.Auction;
import com.bigauction.big_auction.enums.AuctionStartCondition;
import com.bigauction.big_auction.enums.AuctionStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface AuctionRepository extends JpaRepository<Auction, Long> {

    Optional<Auction> findByProductId(Long productId);

    Optional<Auction> findByProductIdAndStatusIn(Long productId, List<AuctionStatus> statuses);

    List<Auction> findByStatus(AuctionStatus status);

    // Used by the scheduler to auto-activate scheduled auctions
    List<Auction> findByStatusAndStartConditionAndScheduledStartTimeBefore(
            AuctionStatus status,
            AuctionStartCondition startCondition,
            LocalDateTime time
    );

    // Used by the scheduler to auto-close ACTIVE auctions whose end time has passed
    List<Auction> findByStatusAndScheduledEndTimeIsNotNullAndScheduledEndTimeBefore(
            AuctionStatus status,
            LocalDateTime time
    );
}
