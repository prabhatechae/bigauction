package com.bigauction.big_auction.repository;

import com.bigauction.big_auction.entity.DepositRequest;
import com.bigauction.big_auction.enums.DepositStatus;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DepositRequestRepository extends JpaRepository<DepositRequest, Long> {

    @EntityGraph(attributePaths = "user")
    List<DepositRequest> findByUserIdOrderByCreatedAtDesc(Long userId);

    @EntityGraph(attributePaths = "user")
    List<DepositRequest> findByStatusOrderByCreatedAtDesc(DepositStatus status);

    @EntityGraph(attributePaths = "user")
    List<DepositRequest> findAllByOrderByCreatedAtDesc();
}
