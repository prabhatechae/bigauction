package com.bigauction.big_auction.controller;

import com.bigauction.big_auction.common.ApiResponse;
import com.bigauction.big_auction.dto.request.UpdateProfileRequest;
import com.bigauction.big_auction.dto.response.MyTicketResponse;
import com.bigauction.big_auction.dto.response.UserProfileResponse;
import com.bigauction.big_auction.service.UserService;
import com.bigauction.big_auction.util.SecurityUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final SecurityUtil securityUtil;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserProfileResponse>> getProfile(
            @AuthenticationPrincipal UserDetails userDetails) {

        Long userId = securityUtil.getCurrentUserId(userDetails);
        return ResponseEntity.ok(ApiResponse.ok("Profile fetched", userService.getProfile(userId)));
    }

    @GetMapping("/me/tickets")
    public ResponseEntity<ApiResponse<List<MyTicketResponse>>> getMyTickets(
            @AuthenticationPrincipal UserDetails userDetails) {

        Long userId = securityUtil.getCurrentUserId(userDetails);
        return ResponseEntity.ok(ApiResponse.ok("Tickets fetched", userService.getMyTickets(userId)));
    }

    @PutMapping("/me")
    public ResponseEntity<ApiResponse<UserProfileResponse>> updateProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody UpdateProfileRequest request) {

        Long userId = securityUtil.getCurrentUserId(userDetails);
        return ResponseEntity.ok(ApiResponse.ok("Profile updated", userService.updateProfile(userId, request)));
    }
}
