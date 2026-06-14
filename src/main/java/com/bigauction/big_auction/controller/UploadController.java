package com.bigauction.big_auction.controller;

import com.bigauction.big_auction.common.ApiResponse;
import com.bigauction.big_auction.exception.AppException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/upload")
public class UploadController {

    private static final List<String> ALLOWED_TYPES = List.of("image/jpeg", "image/png", "image/webp");

    @Value("${app.upload.dir}")
    private String uploadDir;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/image")
    public ApiResponse<String> uploadImage(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            throw new AppException(HttpStatus.BAD_REQUEST, "File is empty");
        }
        if (!ALLOWED_TYPES.contains(file.getContentType())) {
            throw new AppException(HttpStatus.BAD_REQUEST, "Only JPEG, PNG and WebP images are allowed");
        }

        try {
            Path uploadPath = Paths.get(uploadDir).toAbsolutePath();
            Files.createDirectories(uploadPath);

            String filename = UUID.randomUUID() + "_" + file.getOriginalFilename()
                    .replaceAll("[^a-zA-Z0-9._-]", "_");
            Path destination = uploadPath.resolve(filename);
            file.transferTo(destination);

            String url = "http://localhost:8080/uploads/" + filename;
            return ApiResponse.ok("Image uploaded", url);
        } catch (IOException e) {
            throw new AppException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to save image");
        }
    }
}
