package com.bigauction.big_auction.controller;

import com.bigauction.big_auction.common.ApiResponse;
import com.bigauction.big_auction.dto.request.WishlistItemRequest;
import com.bigauction.big_auction.dto.response.WishlistItemResponse;
import com.bigauction.big_auction.service.WishlistService;
import com.bigauction.big_auction.util.SecurityUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users/me/wishlist")
@RequiredArgsConstructor
public class WishlistController {

    private final WishlistService wishlistService;
    private final SecurityUtil securityUtil;

    @GetMapping
    public ResponseEntity<ApiResponse<List<WishlistItemResponse>>> getItems(
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = securityUtil.getCurrentUserId(userDetails);
        return ResponseEntity.ok(ApiResponse.ok("Wishlist fetched", wishlistService.getItems(userId)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<WishlistItemResponse>> addItem(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody WishlistItemRequest request) {
        Long userId = securityUtil.getCurrentUserId(userDetails);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Item added to wishlist", wishlistService.addItem(userId, request)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<WishlistItemResponse>> updateItem(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @Valid @RequestBody WishlistItemRequest request) {
        Long userId = securityUtil.getCurrentUserId(userDetails);
        return ResponseEntity.ok(ApiResponse.ok("Item updated", wishlistService.updateItem(userId, id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteItem(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        Long userId = securityUtil.getCurrentUserId(userDetails);
        wishlistService.deleteItem(userId, id);
        return ResponseEntity.ok(ApiResponse.ok("Item removed from wishlist"));
    }
}
