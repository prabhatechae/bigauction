package com.bigauction.big_auction.dto.response;

import com.bigauction.big_auction.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class AuthResponse {
    private Long id;
    private String name;
    private String nickname;
    private String email;
    private Role role;
    private String token;
}
