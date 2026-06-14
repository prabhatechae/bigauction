package com.bigauction.big_auction.controller;

import com.bigauction.big_auction.common.ApiResponse;
import com.bigauction.big_auction.dto.request.BidRequest;
import com.bigauction.big_auction.dto.response.BidResponse;
import com.bigauction.big_auction.service.BidService;
import com.bigauction.big_auction.util.SecurityUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auctions/{auctionId}/bids")
@RequiredArgsConstructor
public class BidController {

    private final BidService bidService;
    private final SecurityUtil securityUtil;

    @GetMapping
    public ResponseEntity<ApiResponse<List<BidResponse>>> getBids(@PathVariable Long auctionId) {
        return ResponseEntity.ok(ApiResponse.ok("Bids fetched", bidService.getBidsForAuction(auctionId)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<BidResponse>> placeBid(
            @PathVariable Long auctionId,
            @Valid @RequestBody BidRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {

        Long userId = securityUtil.getCurrentUserId(userDetails);
        return ResponseEntity.ok(ApiResponse.ok("Bid placed successfully", bidService.placeBid(auctionId, userId, request)));
    }
}
