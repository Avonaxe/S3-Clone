package com.s3clone.service;

import com.s3clone.entity.ObjectMetadata;
import com.s3clone.exception.FileMissingException;
import com.s3clone.exception.ResourceNotFoundException;
import com.s3clone.repository.BucketRepository;
import com.s3clone.repository.ObjectMetadataRepository;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@Service
public class ObjectService {

    private final ObjectMetadataRepository objectMetadataRepository;
    private final BucketRepository bucketRepository;
    private final StorageService storageService;

    public ObjectService(ObjectMetadataRepository objectMetadataRepository,
                         BucketRepository bucketRepository,
                         StorageService storageService) {
        this.objectMetadataRepository = objectMetadataRepository;
        this.bucketRepository = bucketRepository;
        this.storageService = storageService;
    }

    @Transactional
    public ObjectMetadata uploadObject(Long userId, String bucketName, MultipartFile file) {
        bucketRepository.findByUserIdAndBucketName(userId, bucketName)
                .orElseThrow(() -> new ResourceNotFoundException("Bucket not found: " + bucketName));

        String filename = file.getOriginalFilename();
        if (filename == null || filename.isBlank()) {
            throw new IllegalArgumentException("File must have a valid filename");
        }

        objectMetadataRepository.findByUserIdAndBucketNameAndFilename(userId, bucketName, filename)
                .ifPresent(existing -> {
                    storageService.deleteFile(userId, bucketName, filename);
                    objectMetadataRepository.delete(existing);
                });

        String filePath = storageService.saveFile(file, userId, bucketName, filename);

        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setUserId(userId);
        metadata.setBucketName(bucketName);
        metadata.setFilename(filename);
        metadata.setFilePath(filePath);
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
        ObjectMetadata metadata = objectMetadataRepository.findByUserIdAndBucketNameAndFilename(userId, bucketName, filename)
                .orElseThrow(() -> new ResourceNotFoundException("Object not found: " + filename));

        Path filePath = Paths.get(metadata.getFilePath());
        if (!Files.exists(filePath)) {
            throw new FileMissingException("Physical file missing from disk: " + filename);
        }

        try {
            return new InputStreamResource(Files.newInputStream(filePath));
        } catch (IOException e) {
            throw new FileMissingException("Unable to read file from disk: " + filename);
        }
    }

    @Transactional
    public void deleteObject(Long userId, String bucketName, String filename) {
        ObjectMetadata metadata = objectMetadataRepository.findByUserIdAndBucketNameAndFilename(userId, bucketName, filename)
                .orElseThrow(() -> new ResourceNotFoundException("Object not found: " + filename));

        storageService.deleteFile(userId, bucketName, filename);
        objectMetadataRepository.deleteByUserIdAndBucketNameAndFilename(userId, bucketName, filename);
    }

}
