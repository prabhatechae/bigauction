package com.bigauction.big_auction.controller;

import com.bigauction.big_auction.common.ApiResponse;
import com.bigauction.big_auction.dto.request.ProductFilterRequest;
import com.bigauction.big_auction.dto.request.ProductRequest;
import com.bigauction.big_auction.dto.response.ProductResponse;
import com.bigauction.big_auction.enums.AuctionStatus;
import com.bigauction.big_auction.enums.ConditionGrade;
import com.bigauction.big_auction.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getAvailableProducts() {
        return ResponseEntity.ok(ApiResponse.ok("Products fetched", productService.getAvailableProducts()));
    }

    /**
     * Filter products by any combination of: brand, categoryId, conditionGrade,
     * minPrice, maxPrice, auctionStatus, buyNowAvailable.
     * All params are optional.
     */
    @GetMapping("/filter")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> filterProducts(
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) ConditionGrade conditionGrade,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) AuctionStatus auctionStatus,
            @RequestParam(required = false) Boolean buyNowAvailable) {

        ProductFilterRequest filter = new ProductFilterRequest();
        filter.setBrand(brand);
        filter.setCategoryId(categoryId);
        filter.setConditionGrade(conditionGrade);
        filter.setMinPrice(minPrice);
        filter.setMaxPrice(maxPrice);
        filter.setAuctionStatus(auctionStatus);
        filter.setBuyNowAvailable(buyNowAvailable);

        return ResponseEntity.ok(ApiResponse.ok("Products filtered", productService.filterProducts(filter)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductResponse>> getProduct(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok("Product fetched", productService.getProduct(id)));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ProductResponse>> createProduct(@Valid @RequestBody ProductRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Product created", productService.createProduct(request)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ProductResponse>> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Product updated", productService.updateProduct(id, request)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok(ApiResponse.ok("Product deleted"));
    }
}
