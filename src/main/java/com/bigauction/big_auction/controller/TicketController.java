package com.bigauction.big_auction.controller;

import com.bigauction.big_auction.common.ApiResponse;
import com.bigauction.big_auction.service.TicketService;
import com.bigauction.big_auction.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auctions/{auctionId}/tickets")
@RequiredArgsConstructor
public class TicketController {

    private final TicketService ticketService;
    private final SecurityUtil securityUtil;

    @PostMapping("/purchase")
    public ResponseEntity<ApiResponse<Void>> purchaseTicket(
            @PathVariable Long auctionId,
            @AuthenticationPrincipal UserDetails userDetails) {

        ticketService.purchaseTicket(auctionId, securityUtil.getCurrentUserId(userDetails));
        return ResponseEntity.ok(ApiResponse.ok("Ticket purchased successfully"));
    }

    @PostMapping("/purchase-card")
    public ResponseEntity<ApiResponse<Void>> purchaseTicketByCard(
            @PathVariable Long auctionId,
            @AuthenticationPrincipal UserDetails userDetails) {

        ticketService.purchaseTicketByCard(auctionId, securityUtil.getCurrentUserId(userDetails));
        return ResponseEntity.ok(ApiResponse.ok("Ticket purchased successfully"));
    }

    @GetMapping("/check")
    public ResponseEntity<ApiResponse<Boolean>> checkTicket(
            @PathVariable Long auctionId,
            @AuthenticationPrincipal UserDetails userDetails) {

        if (userDetails == null) return ResponseEntity.ok(ApiResponse.ok("Checked", false));
        boolean has = ticketService.hasTicket(auctionId, securityUtil.getCurrentUserId(userDetails));
        return ResponseEntity.ok(ApiResponse.ok("Checked", has));
    }
}
