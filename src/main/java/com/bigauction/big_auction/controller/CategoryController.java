package com.bigauction.big_auction.controller;

import com.bigauction.big_auction.common.ApiResponse;
import com.bigauction.big_auction.entity.Category;
import com.bigauction.big_auction.exception.AppException;
import com.bigauction.big_auction.repository.CategoryRepository;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryRepository categoryRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Category>>> getAll() {
        return ResponseEntity.ok(ApiResponse.ok("Categories fetched", categoryRepository.findAll()));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Category>> create(@RequestBody CategoryRequest request) {
        if (categoryRepository.existsByName(request.getName())) {
            throw new AppException(HttpStatus.CONFLICT, "Category already exists");
        }
        Category saved = categoryRepository.save(
                Category.builder().name(request.getName()).description(request.getDescription()).build()
        );
        return ResponseEntity.ok(ApiResponse.ok("Category created", saved));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        categoryRepository.findById(id)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Category not found"));
        categoryRepository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.ok("Category deleted"));
    }

    @Getter
    @Setter
    static class CategoryRequest {
        private String name;
        private String description;
    }
}
