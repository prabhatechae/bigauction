package com.bigauction.big_auction.controller;

import com.bigauction.big_auction.common.ApiResponse;
import com.bigauction.big_auction.dto.request.UserAddressRequest;
import com.bigauction.big_auction.dto.response.UserAddressResponse;
import com.bigauction.big_auction.service.UserAddressService;
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
@RequestMapping("/api/users/me/addresses")
@RequiredArgsConstructor
public class UserAddressController {

    private final UserAddressService addressService;
    private final SecurityUtil securityUtil;

    @GetMapping
    public ResponseEntity<ApiResponse<List<UserAddressResponse>>> getAddresses(
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = securityUtil.getCurrentUserId(userDetails);
        return ResponseEntity.ok(ApiResponse.ok("Addresses fetched", addressService.getAddresses(userId)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<UserAddressResponse>> addAddress(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody UserAddressRequest request) {
        Long userId = securityUtil.getCurrentUserId(userDetails);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Address added", addressService.addAddress(userId, request)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<UserAddressResponse>> updateAddress(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @Valid @RequestBody UserAddressRequest request) {
        Long userId = securityUtil.getCurrentUserId(userDetails);
        return ResponseEntity.ok(ApiResponse.ok("Address updated", addressService.updateAddress(userId, id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteAddress(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        Long userId = securityUtil.getCurrentUserId(userDetails);
        addressService.deleteAddress(userId, id);
        return ResponseEntity.ok(ApiResponse.ok("Address deleted"));
    }
}
