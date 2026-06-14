package com.bigauction.big_auction.repository;

import com.bigauction.big_auction.entity.Product;
import com.bigauction.big_auction.enums.ConditionGrade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {

    List<Product> findByCategoryId(Long categoryId);

    List<Product> findByBrandIgnoreCase(String brand);

    List<Product> findByConditionGrade(ConditionGrade conditionGrade);

    List<Product> findBySoldFalse();
}
