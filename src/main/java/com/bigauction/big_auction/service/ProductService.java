package com.bigauction.big_auction.service;

import com.bigauction.big_auction.dto.request.ProductFilterRequest;
import com.bigauction.big_auction.dto.request.ProductRequest;
import com.bigauction.big_auction.dto.response.AuctionResponse;
import com.bigauction.big_auction.dto.response.ProductResponse;
import com.bigauction.big_auction.entity.Category;
import com.bigauction.big_auction.entity.Product;
import com.bigauction.big_auction.entity.ProductImage;
import com.bigauction.big_auction.exception.AppException;
import com.bigauction.big_auction.repository.CategoryRepository;
import com.bigauction.big_auction.repository.ProductRepository;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    @Transactional
    public ProductResponse createProduct(ProductRequest request) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Category not found"));

        Product product = Product.builder()
                .brand(request.getBrand())
                .name(request.getName())
                .category(category)
                .conditionGrade(request.getConditionGrade())
                .description(request.getDescription())
                .wearNotes(request.getWearNotes())
                .sourceCountry(request.getSourceCountry())
                .authenticationNote(request.getAuthenticationNote())
                .modelName(request.getModelName())
                .serialNumber(request.getSerialNumber())
                .yearOfManufacture(request.getYearOfManufacture())
                .authenticationStatus(request.getAuthenticationStatus() != null ? request.getAuthenticationStatus() : com.bigauction.big_auction.enums.AuthenticationStatus.PENDING)
                .certificateNumber(request.getCertificateNumber())
                .provenance(request.getProvenance())
                .includesBox(request.isIncludesBox())
                .includesDustBag(request.isIncludesDustBag())
                .includesAuthCard(request.isIncludesAuthCard())
                .includesWarrantyCard(request.isIncludesWarrantyCard())
                .includesOriginalReceipt(request.isIncludesOriginalReceipt())
                .buyNowPrice(request.getBuyNowPrice())
                .build();

        attachImages(product, request.getImageUrls());
        productRepository.save(product);
        return toResponse(product);
    }

    @Transactional
    public ProductResponse updateProduct(Long id, ProductRequest request) {
        Product product = findById(id);
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Category not found"));

        product.setBrand(request.getBrand());
        product.setName(request.getName());
        product.setCategory(category);
        product.setConditionGrade(request.getConditionGrade());
        product.setDescription(request.getDescription());
        product.setWearNotes(request.getWearNotes());
        product.setSourceCountry(request.getSourceCountry());
        product.setAuthenticationNote(request.getAuthenticationNote());
        product.setModelName(request.getModelName());
        product.setSerialNumber(request.getSerialNumber());
        product.setYearOfManufacture(request.getYearOfManufacture());
        if (request.getAuthenticationStatus() != null) {
            product.setAuthenticationStatus(request.getAuthenticationStatus());
        }
        product.setCertificateNumber(request.getCertificateNumber());
        product.setProvenance(request.getProvenance());
        product.setIncludesBox(request.isIncludesBox());
        product.setIncludesDustBag(request.isIncludesDustBag());
        product.setIncludesAuthCard(request.isIncludesAuthCard());
        product.setIncludesWarrantyCard(request.isIncludesWarrantyCard());
        product.setIncludesOriginalReceipt(request.isIncludesOriginalReceipt());
        product.setBuyNowPrice(request.getBuyNowPrice());

        product.getImages().clear();
        attachImages(product, request.getImageUrls());
        productRepository.save(product);
        return toResponse(product);
    }

    @Transactional
    public void deleteProduct(Long id) {
        Product product = findById(id);
        if (product.isSold()) {
            throw new AppException(HttpStatus.BAD_REQUEST, "Cannot delete a sold product");
        }
        productRepository.delete(product);
    }

    @Transactional(readOnly = true)
    public ProductResponse getProduct(Long id) {
        return toResponse(findById(id));
    }

    @Transactional(readOnly = true)
    public List<ProductResponse> getAllProducts() {
        return productRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<ProductResponse> getAvailableProducts() {
        return productRepository.findBySoldFalse().stream().map(this::toResponse).toList();
    }

    /**
     * Filters products by brand, category, condition grade, price range, auction status, and buy now availability.
     * All filter fields are optional — omit any to skip that filter.
     */
    @Transactional(readOnly = true)
    public List<ProductResponse> filterProducts(ProductFilterRequest filter) {
        Specification<Product> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (filter.getBrand() != null && !filter.getBrand().isBlank()) {
                predicates.add(cb.like(cb.lower(root.get("brand")),
                        "%" + filter.getBrand().toLowerCase() + "%"));
            }
            if (filter.getCategoryId() != null) {
                predicates.add(cb.equal(root.get("category").get("id"), filter.getCategoryId()));
            }
            if (filter.getConditionGrade() != null) {
                predicates.add(cb.equal(root.get("conditionGrade"), filter.getConditionGrade()));
            }
            if (filter.getMinPrice() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("buyNowPrice"), filter.getMinPrice()));
            }
            if (filter.getMaxPrice() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("buyNowPrice"), filter.getMaxPrice()));
            }
            if (Boolean.TRUE.equals(filter.getBuyNowAvailable())) {
                predicates.add(cb.isNotNull(root.get("buyNowPrice")));
                predicates.add(cb.isFalse(root.get("sold")));
            }
            if (filter.getAuctionStatus() != null) {
                var auctionJoin = root.join("auction", jakarta.persistence.criteria.JoinType.INNER);
                predicates.add(cb.equal(auctionJoin.get("status"), filter.getAuctionStatus()));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return productRepository.findAll(spec).stream().map(this::toResponse).toList();
    }

    // ---- Shared helpers (used by AuctionService too) ----

    public Product findById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Product not found"));
    }

    public ProductResponse toResponse(Product product) {
        AuctionResponse auctionResponse = null;
        if (product.getAuction() != null) {
            auctionResponse = toAuctionResponse(product.getAuction());
        }

        List<String> imageUrls = product.getImages().stream()
                .map(ProductImage::getImageUrl)
                .toList();

        return ProductResponse.builder()
                .id(product.getId())
                .brand(product.getBrand())
                .name(product.getName())
                .category(product.getCategory().getName())
                .conditionGrade(product.getConditionGrade())
                .description(product.getDescription())
                .wearNotes(product.getWearNotes())
                .sourceCountry(product.getSourceCountry())
                .authenticationNote(product.getAuthenticationNote())
                .modelName(product.getModelName())
                .serialNumber(product.getSerialNumber())
                .yearOfManufacture(product.getYearOfManufacture())
                .authenticationStatus(product.getAuthenticationStatus())
                .certificateNumber(product.getCertificateNumber())
                .provenance(product.getProvenance())
                .includesBox(product.isIncludesBox())
                .includesDustBag(product.isIncludesDustBag())
                .includesAuthCard(product.isIncludesAuthCard())
                .includesWarrantyCard(product.isIncludesWarrantyCard())
                .includesOriginalReceipt(product.isIncludesOriginalReceipt())
                .buyNowPrice(product.getBuyNowPrice())
                .sold(product.isSold())
                .imageUrls(imageUrls)
                .auction(auctionResponse)
                .createdAt(product.getCreatedAt())
                .build();
    }

    private AuctionResponse toAuctionResponse(com.bigauction.big_auction.entity.Auction auction) {
        String highestBidderName = auction.getHighestBidder() != null
                ? auction.getHighestBidder().getName()
                : null;
        Long winnerId   = auction.getWinner() != null ? auction.getWinner().getId()   : null;
        String winnerName = auction.getWinner() != null ? auction.getWinner().getName() : null;

        return AuctionResponse.builder()
                .id(auction.getId())
                .status(auction.getStatus())
                .ticketPrice(auction.getTicketPrice())
                .ticketTarget(auction.getTicketTarget())
                .ticketsSold(auction.getTicketsSold())
                .startCondition(auction.getStartCondition())
                .scheduledStartTime(auction.getScheduledStartTime())
                .scheduledEndTime(auction.getScheduledEndTime())
                .actualStartTime(auction.getActualStartTime())
                .endTime(auction.getEndTime())
                .buyNowEnabled(auction.isBuyNowEnabled())
                .buyNowActivationRule(auction.getBuyNowActivationRule())
                .estimateLow(auction.getEstimateLow())
                .estimateHigh(auction.getEstimateHigh())
                .reservePrice(auction.getReservePrice())
                .bidIncrement(auction.getBidIncrement())
                .maxBidAmount(auction.getMaxBidAmount())
                .currentHighestBid(auction.getCurrentHighestBid())
                .bidCount(auction.getBidCount())
                .highestBidderName(highestBidderName)
                .winnerId(winnerId)
                .winnerName(winnerName)
                .createdAt(auction.getCreatedAt())
                .build();
    }

    private void attachImages(Product product, List<String> imageUrls) {
        if (imageUrls == null || imageUrls.isEmpty()) return;
        List<ProductImage> images = new ArrayList<>();
        for (int i = 0; i < imageUrls.size(); i++) {
            images.add(ProductImage.builder()
                    .product(product)
                    .imageUrl(imageUrls.get(i))
                    .displayOrder(i)
                    .build());
        }
        product.getImages().addAll(images);
    }
}
