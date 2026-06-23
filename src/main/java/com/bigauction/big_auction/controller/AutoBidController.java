package com.bigauction.big_auction.controller;

import com.bigauction.big_auction.common.ApiResponse;
import com.bigauction.big_auction.dto.request.AutoBidRequest;
import com.bigauction.big_auction.dto.response.AutoBidConfigResponse;
import com.bigauction.big_auction.service.AutoBidService;
import com.bigauction.big_auction.util.SecurityUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auctions/{auctionId}/auto-bid")
@RequiredArgsConstructor
public class AutoBidController {

    private final AutoBidService autoBidService;
    private final SecurityUtil securityUtil;

    @PostMapping
    public ResponseEntity<ApiResponse<AutoBidConfigResponse>> setupAutoBid(
            @PathVariable Long auctionId,
            @Valid @RequestBody AutoBidRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {

        Long userId = securityUtil.getCurrentUserId(userDetails);
        return ResponseEntity.ok(ApiResponse.ok("Auto bid configured",
                autoBidService.setupAutoBid(auctionId, userId, request)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<AutoBidConfigResponse>> getAutoBid(
            @PathVariable Long auctionId,
            @AuthenticationPrincipal UserDetails userDetails) {

        Long userId = securityUtil.getCurrentUserId(userDetails);
        return ResponseEntity.ok(ApiResponse.ok("Auto bid configuration fetched",
                autoBidService.getAutoBid(auctionId, userId)));
    }

    @DeleteMapping
    public ResponseEntity<ApiResponse<Void>> disableAutoBid(
            @PathVariable Long auctionId,
            @AuthenticationPrincipal UserDetails userDetails) {

        Long userId = securityUtil.getCurrentUserId(userDetails);
        autoBidService.disableAutoBid(auctionId, userId);
        return ResponseEntity.ok(ApiResponse.ok("Auto bid disabled", null));
    }
}
