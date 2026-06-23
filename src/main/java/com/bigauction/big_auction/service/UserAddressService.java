package com.bigauction.big_auction.service;

import com.bigauction.big_auction.dto.request.UserAddressRequest;
import com.bigauction.big_auction.dto.response.UserAddressResponse;
import com.bigauction.big_auction.entity.User;
import com.bigauction.big_auction.entity.UserAddress;
import com.bigauction.big_auction.exception.AppException;
import com.bigauction.big_auction.repository.UserAddressRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserAddressService {

    private final UserAddressRepository addressRepository;
    private final UserService userService;

    @Transactional(readOnly = true)
    public List<UserAddressResponse> getAddresses(Long userId) {
        return addressRepository.findByUserIdOrderByIsDefaultDescCreatedAtDesc(userId)
                .stream().map(this::toResponse).toList();
    }

    @Transactional
    public UserAddressResponse addAddress(Long userId, UserAddressRequest request) {
        User user = userService.findById(userId);
        if (request.isDefault()) {
            clearDefault(userId);
        }
        UserAddress address = UserAddress.builder()
                .user(user)
                .label(request.getLabel())
                .fullName(request.getFullName())
                .phone(request.getPhone())
                .addressLine1(request.getAddressLine1())
                .addressLine2(request.getAddressLine2())
                .city(request.getCity())
                .country(request.getCountry())
                .emirate(request.getEmirate())
                .poBox(request.getPoBox())
                .isDefault(request.isDefault())
                .build();
        return toResponse(addressRepository.save(address));
    }

    @Transactional
    public UserAddressResponse updateAddress(Long userId, Long addressId, UserAddressRequest request) {
        UserAddress address = addressRepository.findByIdAndUserId(addressId, userId)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Address not found"));
        if (request.isDefault() && !address.isDefault()) {
            clearDefault(userId);
        }
        address.setLabel(request.getLabel());
        address.setFullName(request.getFullName());
        address.setPhone(request.getPhone());
        address.setAddressLine1(request.getAddressLine1());
        address.setAddressLine2(request.getAddressLine2());
        address.setCity(request.getCity());
        address.setCountry(request.getCountry());
        address.setEmirate(request.getEmirate());
        address.setPoBox(request.getPoBox());
        address.setDefault(request.isDefault());
        return toResponse(addressRepository.save(address));
    }

    @Transactional
    public void deleteAddress(Long userId, Long addressId) {
        UserAddress address = addressRepository.findByIdAndUserId(addressId, userId)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Address not found"));
        addressRepository.delete(address);
    }

    private void clearDefault(Long userId) {
        addressRepository.findByUserIdAndIsDefaultTrue(userId)
                .forEach(a -> { a.setDefault(false); addressRepository.save(a); });
    }

    private UserAddressResponse toResponse(UserAddress a) {
        return UserAddressResponse.builder()
                .id(a.getId())
                .label(a.getLabel())
                .fullName(a.getFullName())
                .phone(a.getPhone())
                .addressLine1(a.getAddressLine1())
                .addressLine2(a.getAddressLine2())
                .city(a.getCity())
                .country(a.getCountry())
                .emirate(a.getEmirate())
                .poBox(a.getPoBox())
                .isDefault(a.isDefault())
                .createdAt(a.getCreatedAt())
                .build();
    }
}
