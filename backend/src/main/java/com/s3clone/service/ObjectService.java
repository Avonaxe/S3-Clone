package com.s3clone.service;

import com.s3clone.entity.ObjectMetadata;
import com.s3clone.exception.FileMissingException;
import com.s3clone.exception.ResourceNotFoundException;
import com.s3clone.repository.BucketRepository;
import com.s3clone.repository.ObjectMetadataRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.exception.SdkException;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.Delete;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.DeleteObjectsRequest;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.ListObjectsV2Request;
import software.amazon.awssdk.services.s3.model.NoSuchKeyException;
import software.amazon.awssdk.services.s3.model.ObjectIdentifier;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.util.List;

@Service
public class ObjectService {

    private final ObjectMetadataRepository objectMetadataRepository;
    private final BucketRepository bucketRepository;
    private final S3Client s3Client;
    private final String masterBucket;

    public ObjectService(ObjectMetadataRepository objectMetadataRepository,
                         BucketRepository bucketRepository,
                         S3Client s3Client,
                         @Value("${aws.s3.master-bucket}") String masterBucket) {
        this.objectMetadataRepository = objectMetadataRepository;
        this.bucketRepository = bucketRepository;
        this.s3Client = s3Client;
        this.masterBucket = masterBucket;
    }

    @Transactional
    public ObjectMetadata uploadObject(Long userId, String bucketName, MultipartFile file) {
        bucketRepository.findByUserIdAndBucketName(userId, bucketName)
                .orElseThrow(() -> new ResourceNotFoundException("Bucket not found: " + bucketName));

        String filename = file.getOriginalFilename();
        if (filename == null || filename.isBlank()) {
            throw new IllegalArgumentException("File must have a valid filename");
        }

        // S3 overwrites the existing key, so only the old metadata row needs removing
        objectMetadataRepository.findByUserIdAndBucketNameAndFilename(userId, bucketName, filename)
                .ifPresent(objectMetadataRepository::delete);

        PutObjectRequest request = PutObjectRequest.builder()
                .bucket(masterBucket)
                .key(buildKey(userId, bucketName, filename))
                .contentType(file.getContentType())
                .contentLength(file.getSize())
                .build();

        try {
            s3Client.putObject(request, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));
        } catch (IOException | SdkException e) {
            throw new RuntimeException("Failed to upload file to storage: " + filename, e);
        }

        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setUserId(userId);
        metadata.setBucketName(bucketName);
        metadata.setFilename(filename);
        metadata.setContentType(file.getContentType());
        metadata.setSizeBytes(file.getSize());

        return objectMetadataRepository.save(metadata);
    }

    public List<ObjectMetadata> listObjects(Long userId, String bucketName) {
        bucketRepository.findByUserIdAndBucketName(userId, bucketName)
                .orElseThrow(() -> new ResourceNotFoundException("Bucket not found: " + bucketName));

        return objectMetadataRepository.findAllByUserIdAndBucketName(userId, bucketName);
    }

    public ObjectMetadata getObjectMetadata(Long userId, String bucketName, String filename) {
        return objectMetadataRepository.findByUserIdAndBucketNameAndFilename(userId, bucketName, filename)
                .orElseThrow(() -> new ResourceNotFoundException("Object not found: " + filename));
    }

    public Resource downloadObject(Long userId, String bucketName, String filename) {
        objectMetadataRepository.findByUserIdAndBucketNameAndFilename(userId, bucketName, filename)
                .orElseThrow(() -> new ResourceNotFoundException("Object not found: " + filename));

        GetObjectRequest request = GetObjectRequest.builder()
                .bucket(masterBucket)
                .key(buildKey(userId, bucketName, filename))
                .build();

        try {
            return new InputStreamResource(s3Client.getObject(request));
        } catch (NoSuchKeyException e) {
            throw new FileMissingException("Object missing from storage: " + filename);
        } catch (SdkException e) {
            throw new FileMissingException("Unable to read object from storage: " + filename);
        }
    }

    @Transactional
    public void deleteObject(Long userId, String bucketName, String filename) {
        objectMetadataRepository.findByUserIdAndBucketNameAndFilename(userId, bucketName, filename)
                .orElseThrow(() -> new ResourceNotFoundException("Object not found: " + filename));

        DeleteObjectRequest request = DeleteObjectRequest.builder()
                .bucket(masterBucket)
                .key(buildKey(userId, bucketName, filename))
                .build();

        try {
            s3Client.deleteObject(request);
        } catch (SdkException e) {
            throw new RuntimeException("Failed to delete file from storage: " + filename, e);
        }

        objectMetadataRepository.deleteByUserIdAndBucketNameAndFilename(userId, bucketName, filename);
    }

    /**
     * Deletes every stored object under the given bucket's key prefix.
     * Metadata rows are left to the caller.
     */
    public void deleteAllInBucket(Long userId, String bucketName) {
        validateKeySegment(bucketName, "Bucket name");

        ListObjectsV2Request listRequest = ListObjectsV2Request.builder()
                .bucket(masterBucket)
                .prefix(userId + "/" + bucketName + "/")
                .build();

        // Each listing page holds at most 1000 keys, matching the DeleteObjects batch limit
        s3Client.listObjectsV2Paginator(listRequest).forEach(page -> {
            if (page.contents().isEmpty()) {
                return;
            }

            List<ObjectIdentifier> keys = page.contents().stream()
                    .map(o -> ObjectIdentifier.builder().key(o.key()).build())
                    .toList();

            s3Client.deleteObjects(DeleteObjectsRequest.builder()
                    .bucket(masterBucket)
                    .delete(Delete.builder().objects(keys).quiet(true).build())
                    .build());
        });
    }

    private String buildKey(Long userId, String bucketName, String filename) {
        validateKeySegment(bucketName, "Bucket name");
        validateKeySegment(filename, "Filename");
        return userId + "/" + bucketName + "/" + filename;
    }

    private void validateKeySegment(String value, String label) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException(label + " cannot be null or blank.");
        }
        if (value.contains("..") || value.contains("/") || value.contains("\\") || value.contains("\0")) {
            throw new SecurityException("Invalid " + label.toLowerCase() + ". Path traversal characters are not allowed.");
        }
    }

}
