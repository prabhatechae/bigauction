package com.bigauction.big_auction.service;

import com.bigauction.big_auction.dto.response.AuctionResponse;
import com.bigauction.big_auction.dto.response.BidResponse;
import com.bigauction.big_auction.dto.response.UserNotification;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

/**
 * Sends real-time updates to WebSocket subscribers.
 *
 * Broadcast topics:
 *   /topic/auctions/{id}/bids           — new bid placed (all subscribers)
 *   /topic/auctions/{id}/status         — auction status changed (all subscribers)
 *
 * User-specific topics:
 *   /topic/users/{userId}/notifications — outbid / winner alerts (that user only)
 */
@Service
@RequiredArgsConstructor
public class BroadcastService {

    private final SimpMessagingTemplate messagingTemplate;

    public void broadcastNewBid(Long auctionId, BidResponse bid) {
        messagingTemplate.convertAndSend("/topic/auctions/" + auctionId + "/bids", bid);
    }

    public void broadcastAuctionStatus(Long auctionId, AuctionResponse auction) {
        messagingTemplate.convertAndSend("/topic/auctions/" + auctionId + "/status", auction);
    }

    /** Notify the previous highest bidder that they have been outbid. */
    public void broadcastOutbid(Long outbidUserId, Long auctionId, String productName,
                                BigDecimal newHighestBid, String currency) {
        UserNotification notification = UserNotification.builder()
                .type("OUTBID")
                .auctionId(auctionId)
                .productName(productName)
                .amount(newHighestBid)
                .currency(currency)
                .message("You have been outbid on " + productName + ". New highest bid: "
                        + currency + " " + newHighestBid.toPlainString())
                .build();
        messagingTemplate.convertAndSend("/topic/users/" + outbidUserId + "/notifications", notification);
    }

    /** Notify the auction winner that they won and should complete checkout. */
    public void broadcastWinner(Long winnerId, Long auctionId, String productName,
                                BigDecimal winningBid, String currency) {
        UserNotification notification = UserNotification.builder()
                .type("AUCTION_WON")
                .auctionId(auctionId)
                .productName(productName)
                .amount(winningBid)
                .currency(currency)
                .message("Congratulations! You won the auction for " + productName
                        + " with a bid of " + currency + " " + winningBid.toPlainString()
                        + ". Please complete your checkout.")
                .build();
        messagingTemplate.convertAndSend("/topic/users/" + winnerId + "/notifications", notification);
    }

    /** Notify all ticket holders that an auction closed with no winner. */
    public void broadcastAuctionClosed(Long userId, Long auctionId, String productName, String currency) {
        UserNotification notification = UserNotification.builder()
                .type("AUCTION_CLOSED")
                .auctionId(auctionId)
                .productName(productName)
                .currency(currency)
                .message("The auction for " + productName + " has ended with no winner. "
                        + "Your ticket credit has been returned to your wallet.")
                .build();
        messagingTemplate.convertAndSend("/topic/users/" + userId + "/notifications", notification);
    }
}
