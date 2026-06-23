package com.bigauction.big_auction.service;

import com.bigauction.big_auction.dto.response.FavouriteResponse;
import com.bigauction.big_auction.entity.Auction;
import com.bigauction.big_auction.entity.Favourite;
import com.bigauction.big_auction.entity.Product;
import com.bigauction.big_auction.entity.User;
import com.bigauction.big_auction.exception.AppException;
import com.bigauction.big_auction.repository.FavouriteRepository;
import com.bigauction.big_auction.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FavouriteService {

    private final FavouriteRepository favouriteRepository;
    private final ProductRepository productRepository;
    private final UserService userService;

    @Transactional(readOnly = true)
    public List<FavouriteResponse> getFavourites(Long userId) {
        return favouriteRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream().map(this::toResponse).toList();
    }

    @Transactional
    public FavouriteResponse addFavourite(Long userId, Long productId) {
        if (favouriteRepository.existsByUserIdAndProductId(userId, productId)) {
            throw new AppException(HttpStatus.CONFLICT, "Already in favourites");
        }
        User user = userService.findById(userId);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Product not found"));
        Favourite fav = Favourite.builder().user(user).product(product).build();
        return toResponse(favouriteRepository.save(fav));
    }

    @Transactional
    public void removeFavourite(Long userId, Long productId) {
        if (!favouriteRepository.existsByUserIdAndProductId(userId, productId)) {
            throw new AppException(HttpStatus.NOT_FOUND, "Not in favourites");
        }
        favouriteRepository.deleteByUserIdAndProductId(userId, productId);
    }

    @Transactional(readOnly = true)
    public boolean isFavourite(Long userId, Long productId) {
        return favouriteRepository.existsByUserIdAndProductId(userId, productId);
    }

    private FavouriteResponse toResponse(Favourite fav) {
        Product product = fav.getProduct();
        Auction auction = product.getAuction();
        List<String> imageUrls = product.getImages().stream().map(i -> i.getImageUrl()).toList();
        return FavouriteResponse.builder()
                .productId(product.getId())
                .productName(product.getName())
                .brand(product.getBrand())
                .buyNowPrice(product.getBuyNowPrice())
                .imageUrls(imageUrls)
                .auctionId(auction != null ? auction.getId() : null)
                .auctionStatus(auction != null ? auction.getStatus() : null)
                .currentHighestBid(auction != null ? auction.getCurrentHighestBid() : null)
                .savedAt(fav.getCreatedAt())
                .build();
    }
}
