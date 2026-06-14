package com.bigauction.big_auction.service;

import com.bigauction.big_auction.dto.request.LoginRequest;
import com.bigauction.big_auction.dto.request.RegisterRequest;
import com.bigauction.big_auction.dto.response.AuthResponse;
import com.bigauction.big_auction.entity.User;
import com.bigauction.big_auction.entity.Wallet;
import com.bigauction.big_auction.enums.Role;
import com.bigauction.big_auction.exception.AppException;
import com.bigauction.big_auction.repository.UserRepository;
import com.bigauction.big_auction.repository.WalletRepository;
import com.bigauction.big_auction.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final WalletRepository walletRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new AppException(HttpStatus.CONFLICT, "Email is already registered");
        }
        if (userRepository.existsByNickname(request.getNickname())) {
            throw new AppException(HttpStatus.CONFLICT, "Nickname is already taken");
        }

        User user = User.builder()
                .name(request.getName())
                .nickname(request.getNickname())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .role(Role.USER)
                .build();

        userRepository.save(user);

        // Every user gets a wallet automatically on registration
        Wallet wallet = Wallet.builder().user(user).build();
        walletRepository.save(wallet);

        String token = jwtUtil.generateToken(user.getEmail());
        return buildAuthResponse(user, token);
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "User not found"));

        String token = jwtUtil.generateToken(user.getEmail());
        return buildAuthResponse(user, token);
    }

    private AuthResponse buildAuthResponse(User user, String token) {
        return AuthResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .nickname(user.getNickname())
                .email(user.getEmail())
                .role(user.getRole())
                .token(token)
                .build();
    }
}
