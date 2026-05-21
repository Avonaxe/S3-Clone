package com.s3clone.service;

import com.s3clone.entity.Bucket;
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

        boolean hasObjects = objectMetadataRepository.existsByUserIdAndBucketName(userId, bucketName);
        if (hasObjects) {
            throw new ResourceConflictException("Bucket is not empty: " + bucketName);
        }

        bucketRepository.deleteByUserIdAndBucketName(userId, bucketName);
    }

}
