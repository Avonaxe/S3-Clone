package com.s3clone.service;

import com.s3clone.entity.Bucket;
import com.s3clone.entity.ObjectMetadata;
import com.s3clone.exception.ResourceConflictException;
import com.s3clone.exception.ResourceNotFoundException;
import com.s3clone.repository.BucketRepository;
import com.s3clone.repository.ObjectMetadataRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class BucketService {

    private final BucketRepository bucketRepository;
    private final ObjectMetadataRepository objectMetadataRepository;
    private final ObjectService objectService;

    public BucketService(BucketRepository bucketRepository,
                         ObjectMetadataRepository objectMetadataRepository,
                         ObjectService objectService) {
        this.bucketRepository = bucketRepository;
        this.objectMetadataRepository = objectMetadataRepository;
        this.objectService = objectService;
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

        // Step 2: Delete the stored objects from S3
        try {
            objectService.deleteAllInBucket(userId, bucketName);
        } catch (Exception e) {
            System.out.println("[BucketService] Warning: Failed to delete stored objects for bucket: " + bucketName + " — " + e.getMessage());
        }

        // Step 3: Delete the bucket record
        bucketRepository.deleteByUserIdAndBucketName(userId, bucketName);
    }

}
