package com.bigauction.big_auction.util;

import com.bigauction.big_auction.entity.User;
import com.bigauction.big_auction.exception.AppException;
import com.bigauction.big_auction.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class SecurityUtil {

    private final UserRepository userRepository;

    public User getCurrentUser(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "User not found"));
    }

    public Long getCurrentUserId(UserDetails userDetails) {
        return getCurrentUser(userDetails).getId();
    }
}
