package com.s3clone.repository;

import com.s3clone.entity.ObjectMetadata;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ObjectMetadataRepository extends JpaRepository<ObjectMetadata, Long> {

    List<ObjectMetadata> findAllByUserIdAndBucketName(Long userId, String bucketName);

    Optional<ObjectMetadata> findByUserIdAndBucketNameAndFilename(Long userId, String bucketName, String filename);

    boolean existsByUserIdAndBucketNameAndFilename(Long userId, String bucketName, String filename);

    void deleteByUserIdAndBucketNameAndFilename(Long userId, String bucketName, String filename);

}
