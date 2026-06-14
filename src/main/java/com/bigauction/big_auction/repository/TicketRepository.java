package com.bigauction.big_auction.repository;

import com.bigauction.big_auction.entity.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket, Long> {

    List<Ticket> findByAuctionId(Long auctionId);

    List<Ticket> findByUserId(Long userId);

    boolean existsByAuctionIdAndUserId(Long auctionId, Long userId);

    int countByAuctionId(Long auctionId);

    // Fetch all ticket holders for an auction excluding a specific user (e.g. the winner)
    List<Ticket> findByAuctionIdAndUserIdNot(Long auctionId, Long excludedUserId);

    long countAllBy();

    @org.springframework.data.jpa.repository.Query("SELECT COALESCE(SUM(t.auction.ticketPrice), 0) FROM Ticket t")
    java.math.BigDecimal sumAllTicketRevenue();
}
