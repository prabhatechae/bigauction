package com.bigauction.big_auction.repository;

import com.bigauction.big_auction.entity.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket, Long> {

    @Query("SELECT t FROM Ticket t JOIN FETCH t.user WHERE t.auction.id = :auctionId")
    List<Ticket> findByAuctionId(@Param("auctionId") Long auctionId);

    @Query("SELECT t FROM Ticket t JOIN FETCH t.auction a JOIN FETCH a.product p LEFT JOIN FETCH p.images WHERE t.user.id = :userId")
    List<Ticket> findByUserId(@Param("userId") Long userId);

    boolean existsByAuctionIdAndUserId(Long auctionId, Long userId);

    int countByAuctionId(Long auctionId);

    // Fetch all ticket holders for an auction excluding a specific user (e.g. the winner)
    List<Ticket> findByAuctionIdAndUserIdNot(Long auctionId, Long excludedUserId);

    long countAllBy();

    @org.springframework.data.jpa.repository.Query("SELECT COALESCE(SUM(t.auction.ticketPrice), 0) FROM Ticket t")
    java.math.BigDecimal sumAllTicketRevenue();
}
