package com.bigauction.big_auction.repository;

import com.bigauction.big_auction.entity.Favourite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;

import java.util.List;
import java.util.Optional;

public interface FavouriteRepository extends JpaRepository<Favourite, Long> {
    List<Favourite> findByUserIdOrderByCreatedAtDesc(Long userId);
    Optional<Favourite> findByUserIdAndProductId(Long userId, Long productId);
    boolean existsByUserIdAndProductId(Long userId, Long productId);
    @Modifying
    void deleteByUserIdAndProductId(Long userId, Long productId);
}
