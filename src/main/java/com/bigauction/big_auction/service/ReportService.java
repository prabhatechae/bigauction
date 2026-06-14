package com.bigauction.big_auction.service;

import com.bigauction.big_auction.dto.response.ReportResponse;
import com.bigauction.big_auction.enums.OrderType;
import com.bigauction.big_auction.enums.TransactionType;
import com.bigauction.big_auction.repository.OrderRepository;
import com.bigauction.big_auction.repository.TicketRepository;
import com.bigauction.big_auction.repository.WalletTransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final OrderRepository orderRepository;
    private final TicketRepository ticketRepository;
    private final WalletTransactionRepository walletTransactionRepository;

    private static BigDecimal orZero(BigDecimal value) {
        return value != null ? value : BigDecimal.ZERO;
    }

    public ReportResponse generateReport() {
        long buyNowCount = orderRepository.countByType(OrderType.BUY_NOW);
        BigDecimal buyNowRevenue = orZero(orderRepository.sumTotalAmountByType(OrderType.BUY_NOW));

        long auctionWinCount = orderRepository.countByType(OrderType.AUCTION_WIN);
        BigDecimal auctionWinRevenue = orZero(orderRepository.sumTotalAmountByType(OrderType.AUCTION_WIN));

        long totalTickets = ticketRepository.countAllBy();
        BigDecimal ticketRevenue = orZero(ticketRepository.sumAllTicketRevenue());

        BigDecimal creditsIssued  = orZero(walletTransactionRepository.sumAmountByType(TransactionType.CREDIT));
        BigDecimal creditsRedeemed = orZero(walletTransactionRepository.sumAmountByType(TransactionType.DEBIT));

        return ReportResponse.builder()
                .buyNowCount(buyNowCount)
                .buyNowRevenue(buyNowRevenue)
                .auctionWinCount(auctionWinCount)
                .auctionWinRevenue(auctionWinRevenue)
                .totalRevenue(buyNowRevenue.add(auctionWinRevenue))
                .ticketsSold(totalTickets)
                .ticketRevenue(ticketRevenue)
                .creditsIssued(creditsIssued)
                .creditsRedeemed(creditsRedeemed)
                .build();
    }
}
