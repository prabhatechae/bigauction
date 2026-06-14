package com.bigauction.big_auction.repository;

import com.bigauction.big_auction.entity.Order;
import com.bigauction.big_auction.enums.OrderStatus;
import com.bigauction.big_auction.enums.OrderType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByUserId(Long userId);

    List<Order> findByStatus(OrderStatus status);

    List<Order> findByType(OrderType type);

    boolean existsByAuctionIdAndUserId(Long auctionId, Long userId);

    long countByType(OrderType type);

    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o WHERE o.type = :type")
    BigDecimal sumTotalAmountByType(@Param("type") OrderType type);
}
