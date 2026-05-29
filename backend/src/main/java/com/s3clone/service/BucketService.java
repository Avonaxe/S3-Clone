package com.s3clone.service;

import com.s3clone.entity.Bucket;
import com.s3clone.entity.ObjectMetadata;
import com.s3clone.exception.ResourceConflictException;
import com.s3clone.exception.ResourceNotFoundException;
import com.s3clone.repository.BucketRepository;
import com.s3clone.repository.ObjectMetadataRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.FileSystemUtils;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@Service
public class BucketService {

    private final BucketRepository bucketRepository;
    private final ObjectMetadataRepository objectMetadataRepository;

    public BucketService(BucketRepository bucketRepository,
                         ObjectMetadataRepository objectMetadataRepository) {
        this.bucketRepository = bucketRepository;
        this.objectMetadataRepository = objectMetadataRepository;
    }

    public Bucket createBucket(Long userId, String bucketName) {
        if (bucketRepository.existsByUserIdAndBucketName(userId, bucketName)) {
            throw new ResourceConflictException("Bucket already exists: " + bucketName);
        }

        Bucket bucket = new Bucket();
        bucket.setUserId(userId);
        bucket.setBucketName(bucketName);
        return bucketRepository.save(bucket);
    }

    public List<Bucket> listBuckets(Long userId) {
        return bucketRepository.findAllByUserId(userId);
    }

    @Transactional
    public void deleteBucket(Long userId, String bucketName) {
        Bucket bucket = bucketRepository.findByUserIdAndBucketName(userId, bucketName)
                .orElseThrow(() -> new ResourceNotFoundException("Bucket not found: " + bucketName));

        // Step 1: Delete all object metadata records for this bucket
        List<ObjectMetadata> objects = objectMetadataRepository.findAllByUserIdAndBucketName(userId, bucketName);
        if (!objects.isEmpty()) {
            objectMetadataRepository.deleteAll(objects);
        }

        // Step 2: Delete the physical directory
        Path bucketPath = Paths.get("storage", userId.toString(), bucketName);
        try {
            if (Files.exists(bucketPath)) {
                FileSystemUtils.deleteRecursively(bucketPath);
            } else {
                System.out.println("[BucketService] Physical directory not found for bucket: " + bucketName + ", skipping filesystem cleanup.");
            }
        } catch (Exception e) {
            System.out.println("[BucketService] Warning: Failed to delete physical directory for bucket: " + bucketName + " — " + e.getMessage());
        }

        // Step 3: Delete the bucket record
        bucketRepository.deleteByUserIdAndBucketName(userId, bucketName);
    }

}
