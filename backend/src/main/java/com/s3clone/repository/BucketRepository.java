package com.s3clone.repository;

import com.s3clone.entity.Bucket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BucketRepository extends JpaRepository<Bucket, Long> {

    List<Bucket> findAllByUserId(Long userId);

    Optional<Bucket> findByUserIdAndBucketName(Long userId, String bucketName);

    boolean existsByUserIdAndBucketName(Long userId, String bucketName);

    void deleteByUserIdAndBucketName(Long userId, String bucketName);

}
