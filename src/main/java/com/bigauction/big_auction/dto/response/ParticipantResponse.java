package com.bigauction.big_auction.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class ParticipantResponse {
    private Long userId;
    private String name;
    private String email;
    private LocalDateTime ticketPurchasedAt;
}
