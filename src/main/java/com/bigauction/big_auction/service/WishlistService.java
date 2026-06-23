package com.bigauction.big_auction.service;

import com.bigauction.big_auction.dto.request.WishlistItemRequest;
import com.bigauction.big_auction.dto.response.WishlistItemResponse;
import com.bigauction.big_auction.entity.User;
import com.bigauction.big_auction.entity.WishlistItem;
import com.bigauction.big_auction.exception.AppException;
import com.bigauction.big_auction.repository.WishlistItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WishlistService {

    private final WishlistItemRepository wishlistItemRepository;
    private final UserService userService;

    @Transactional(readOnly = true)
    public List<WishlistItemResponse> getItems(Long userId) {
        return wishlistItemRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream().map(this::toResponse).toList();
    }

    @Transactional
    public WishlistItemResponse addItem(Long userId, WishlistItemRequest request) {
        User user = userService.findById(userId);
        WishlistItem item = WishlistItem.builder()
                .user(user)
                .brand(request.getBrand())
                .itemModel(request.getItemModel())
                .budgetMin(request.getBudgetMin())
                .budgetMax(request.getBudgetMax())
                .notes(request.getNotes())
                .photoUrl(request.getPhotoUrl())
                .build();
        return toResponse(wishlistItemRepository.save(item));
    }

    @Transactional
    public WishlistItemResponse updateItem(Long userId, Long itemId, WishlistItemRequest request) {
        WishlistItem item = wishlistItemRepository.findByIdAndUserId(itemId, userId)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Wishlist item not found"));
        item.setBrand(request.getBrand());
        item.setItemModel(request.getItemModel());
        item.setBudgetMin(request.getBudgetMin());
        item.setBudgetMax(request.getBudgetMax());
        item.setNotes(request.getNotes());
        item.setPhotoUrl(request.getPhotoUrl());
        return toResponse(wishlistItemRepository.save(item));
    }

    @Transactional
    public void deleteItem(Long userId, Long itemId) {
        WishlistItem item = wishlistItemRepository.findByIdAndUserId(itemId, userId)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Wishlist item not found"));
        wishlistItemRepository.delete(item);
    }

    private WishlistItemResponse toResponse(WishlistItem item) {
        return WishlistItemResponse.builder()
                .id(item.getId())
                .brand(item.getBrand())
                .itemModel(item.getItemModel())
                .budgetMin(item.getBudgetMin())
                .budgetMax(item.getBudgetMax())
                .notes(item.getNotes())
                .photoUrl(item.getPhotoUrl())
                .status(item.getStatus())
                .createdAt(item.getCreatedAt())
                .build();
    }
}
