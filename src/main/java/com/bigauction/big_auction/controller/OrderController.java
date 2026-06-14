package com.bigauction.big_auction.controller;

import com.bigauction.big_auction.common.ApiResponse;
import com.bigauction.big_auction.dto.response.OrderResponse;
import com.bigauction.big_auction.service.OrderService;
import com.bigauction.big_auction.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final SecurityUtil securityUtil;

    @GetMapping
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getMyOrders(
            @AuthenticationPrincipal UserDetails userDetails) {

        Long userId = securityUtil.getCurrentUserId(userDetails);
        return ResponseEntity.ok(ApiResponse.ok("Orders fetched", orderService.getOrdersForUser(userId)));
    }
}
