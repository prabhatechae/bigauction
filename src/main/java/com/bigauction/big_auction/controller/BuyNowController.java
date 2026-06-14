package com.bigauction.big_auction.controller;

import com.bigauction.big_auction.common.ApiResponse;
import com.bigauction.big_auction.dto.response.OrderResponse;
import com.bigauction.big_auction.service.BuyNowService;
import com.bigauction.big_auction.util.SecurityUtil;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/products/{productId}/buy-now")
@RequiredArgsConstructor
public class BuyNowController {

    private final BuyNowService buyNowService;
    private final SecurityUtil securityUtil;

    @PostMapping
    public ResponseEntity<ApiResponse<OrderResponse>> buyNow(
            @PathVariable Long productId,
            @RequestBody(required = false) BuyNowRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {

        Long userId = securityUtil.getCurrentUserId(userDetails);
        BigDecimal creditToApply = request != null ? request.getCreditToApply() : BigDecimal.ZERO;
        String shippingName    = request != null ? request.getShippingName()    : null;
        String shippingPhone   = request != null ? request.getShippingPhone()   : null;
        String shippingAddress = request != null ? request.getShippingAddress() : null;
        String shippingCity    = request != null ? request.getShippingCity()    : null;
        String shippingCountry = request != null ? request.getShippingCountry() : null;
        return ResponseEntity.ok(ApiResponse.ok("Purchase successful",
                buyNowService.buyNow(productId, userId, creditToApply,
                        shippingName, shippingPhone, shippingAddress, shippingCity, shippingCountry)));
    }

    @Getter
    @Setter
    static class BuyNowRequest {
        private BigDecimal creditToApply;
        private String shippingName;
        private String shippingPhone;
        private String shippingAddress;
        private String shippingCity;
        private String shippingCountry;
    }
}
