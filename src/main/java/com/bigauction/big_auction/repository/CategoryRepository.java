package com.bigauction.big_auction.repository;

import com.bigauction.big_auction.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {

    boolean existsByName(String name);
}
