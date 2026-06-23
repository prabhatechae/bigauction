package com.bigauction.big_auction.controller;

import com.bigauction.big_auction.common.ApiResponse;
import com.bigauction.big_auction.dto.response.FavouriteResponse;
import com.bigauction.big_auction.service.FavouriteService;
import com.bigauction.big_auction.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users/me/favourites")
@RequiredArgsConstructor
public class FavouriteController {

    private final FavouriteService favouriteService;
    private final SecurityUtil securityUtil;

    @GetMapping
    public ResponseEntity<ApiResponse<List<FavouriteResponse>>> getFavourites(
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = securityUtil.getCurrentUserId(userDetails);
        return ResponseEntity.ok(ApiResponse.ok("Favourites fetched", favouriteService.getFavourites(userId)));
    }

    @PostMapping("/{productId}")
    public ResponseEntity<ApiResponse<FavouriteResponse>> addFavourite(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long productId) {
        Long userId = securityUtil.getCurrentUserId(userDetails);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Added to favourites", favouriteService.addFavourite(userId, productId)));
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<ApiResponse<Void>> removeFavourite(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long productId) {
        Long userId = securityUtil.getCurrentUserId(userDetails);
        favouriteService.removeFavourite(userId, productId);
        return ResponseEntity.ok(ApiResponse.ok("Removed from favourites"));
    }

    @GetMapping("/{productId}/check")
    public ResponseEntity<ApiResponse<Map<String, Boolean>>> checkFavourite(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long productId) {
        Long userId = securityUtil.getCurrentUserId(userDetails);
        boolean isFav = favouriteService.isFavourite(userId, productId);
        return ResponseEntity.ok(ApiResponse.ok("Checked", Map.of("isFavourite", isFav)));
    }
}
