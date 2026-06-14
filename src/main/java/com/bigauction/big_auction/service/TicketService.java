package com.bigauction.big_auction.service;

import com.bigauction.big_auction.entity.Auction;
import com.bigauction.big_auction.entity.Ticket;
import com.bigauction.big_auction.entity.User;
import com.bigauction.big_auction.enums.AuctionStartCondition;
import com.bigauction.big_auction.enums.AuctionStatus;
import com.bigauction.big_auction.exception.AppException;
import com.bigauction.big_auction.repository.TicketRepository;
import com.bigauction.big_auction.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class TicketService {

    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;
    private final AuctionService auctionService;
    private final WalletService walletService;

    /**
     * Purchases a ticket for an auction.
     * If the auction start condition is ALL_TICKETS_SOLD and the target is now met, the auction activates automatically.
     */
    @Transactional
    public Ticket purchaseTicket(Long auctionId, Long userId) {
        Auction auction = auctionService.findById(auctionId);

        if (auction.getStatus() == AuctionStatus.SOLD || auction.getStatus() == AuctionStatus.CLOSED) {
            throw new AppException(HttpStatus.BAD_REQUEST, "This auction is no longer accepting tickets");
        }
        if (auction.getTicketsSold() >= auction.getTicketTarget()) {
            throw new AppException(HttpStatus.BAD_REQUEST, "All tickets for this auction have been sold");
        }
        if (ticketRepository.existsByAuctionIdAndUserId(auctionId, userId)) {
            throw new AppException(HttpStatus.CONFLICT, "You have already purchased a ticket for this auction");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "User not found"));

        // Charge the ticket price from the buyer's wallet
        walletService.debitForTicket(userId, auction.getTicketPrice(), auctionId);

        Ticket ticket = Ticket.builder().auction(auction).user(user).build();
        ticketRepository.save(ticket);

        auction.setTicketsSold(auction.getTicketsSold() + 1);

        // Auto-activate if all tickets are sold and the condition requires it
        if (auction.getStartCondition() == AuctionStartCondition.ALL_TICKETS_SOLD
                && auction.getTicketsSold() >= auction.getTicketTarget()
                && auction.getStatus() == AuctionStatus.PENDING) {
            auctionService.activateAuction(auction.getId());
        }

        return ticket;
    }

    /**
     * Purchases a ticket via card payment — skips wallet deduction.
     * The card charge is assumed to have been collected on the frontend payment screen.
     */
    @Transactional
    public Ticket purchaseTicketByCard(Long auctionId, Long userId) {
        Auction auction = auctionService.findById(auctionId);

        if (auction.getStatus() == AuctionStatus.SOLD || auction.getStatus() == AuctionStatus.CLOSED) {
            throw new AppException(HttpStatus.BAD_REQUEST, "This auction is no longer accepting tickets");
        }
        if (auction.getTicketsSold() >= auction.getTicketTarget()) {
            throw new AppException(HttpStatus.BAD_REQUEST, "All tickets for this auction have been sold");
        }
        if (ticketRepository.existsByAuctionIdAndUserId(auctionId, userId)) {
            throw new AppException(HttpStatus.CONFLICT, "You have already purchased a ticket for this auction");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "User not found"));

        Ticket ticket = Ticket.builder().auction(auction).user(user).build();
        ticketRepository.save(ticket);

        auction.setTicketsSold(auction.getTicketsSold() + 1);

        if (auction.getStartCondition() == AuctionStartCondition.ALL_TICKETS_SOLD
                && auction.getTicketsSold() >= auction.getTicketTarget()
                && auction.getStatus() == AuctionStatus.PENDING) {
            auctionService.activateAuction(auction.getId());
        }

        return ticket;
    }

    public boolean hasTicket(Long auctionId, Long userId) {
        return ticketRepository.existsByAuctionIdAndUserId(auctionId, userId);
    }
}
