package com.s3clone.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@Service
public class LocalFilesystemStorageServiceImpl implements StorageService {

    private static final String STORAGE_ROOT = "storage";

    @Override
    public String saveFile(MultipartFile file, Long userId, String bucketName, String filename) {
        validateFilename(filename);
        validateBucketName(bucketName);

        Path targetPath = resolvePath(userId, bucketName, filename);
        Path parentDir = targetPath.getParent();

        try {
            if (parentDir != null) {
                Files.createDirectories(parentDir);
            }
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new RuntimeException("Failed to save file to storage: " + filename, e);
        }

        return targetPath.toAbsolutePath().toString();
    }

    @Override
    public InputStream retrieveFile(Long userId, String bucketName, String filename) {
        validateFilename(filename);
        validateBucketName(bucketName);

        Path targetPath = resolvePath(userId, bucketName, filename);

        try {
            return Files.newInputStream(targetPath);
        } catch (IOException e) {
            throw new RuntimeException("Failed to retrieve file from storage: " + filename, e);
        }
    }

    @Override
    public void deleteFile(Long userId, String bucketName, String filename) {
        validateFilename(filename);
        validateBucketName(bucketName);

        Path targetPath = resolvePath(userId, bucketName, filename);

        try {
            Files.deleteIfExists(targetPath);
        } catch (IOException e) {
            throw new RuntimeException("Failed to delete file from storage: " + filename, e);
        }
    }

    private Path resolvePath(Long userId, String bucketName, String filename) {
        Path basePath = Paths.get(STORAGE_ROOT).toAbsolutePath().normalize();
        Path resolvedPath = basePath.resolve(userId.toString())
                .resolve(bucketName)
                .resolve(filename)
                .toAbsolutePath()
                .normalize();

        if (!resolvedPath.startsWith(basePath)) {
            throw new SecurityException("Path traversal attempt detected. Access denied.");
        }

        return resolvedPath;
    }

    private void validateFilename(String filename) {
        if (filename == null || filename.isBlank()) {
            throw new IllegalArgumentException("Filename cannot be null or blank.");
        }
        if (filename.contains("..") || filename.contains("/") || filename.contains("\\") || filename.contains("\0")) {
            throw new SecurityException("Invalid filename. Path traversal characters are not allowed.");
        }
    }

    private void validateBucketName(String bucketName) {
        if (bucketName == null || bucketName.isBlank()) {
            throw new IllegalArgumentException("Bucket name cannot be null or blank.");
        }
        if (bucketName.contains("..") || bucketName.contains("/") || bucketName.contains("\\") || bucketName.contains("\0")) {
            throw new SecurityException("Invalid bucket name. Path traversal characters are not allowed.");
        }
    }

}
