package com.s3clone.controller;

import com.s3clone.dto.ObjectMetadataResponse;
import com.s3clone.entity.ObjectMetadata;
import com.s3clone.entity.User;
import com.s3clone.security.CurrentUserUtil;
import com.s3clone.service.ObjectService;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/buckets/{bucketName}/objects")
public class ObjectController {

    private final ObjectService objectService;
    private final CurrentUserUtil currentUserUtil;

    public ObjectController(ObjectService objectService, CurrentUserUtil currentUserUtil) {
        this.objectService = objectService;
        this.currentUserUtil = currentUserUtil;
    }

    @PostMapping
    public ResponseEntity<ObjectMetadataResponse> uploadObject(
            @PathVariable String bucketName,
            @RequestParam("file") MultipartFile file) {
        User user = currentUserUtil.getCurrentUser();
        ObjectMetadata metadata = objectService.uploadObject(user.getId(), bucketName, file);

        ObjectMetadataResponse response = mapToUploadResponse(metadata);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<ObjectMetadataResponse>> listObjects(@PathVariable String bucketName) {
        User user = currentUserUtil.getCurrentUser();
        List<ObjectMetadata> objects = objectService.listObjects(user.getId(), bucketName);

        List<ObjectMetadataResponse> responses = objects.stream()
                .map(this::mapToListResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{objectName}")
    public ResponseEntity<Resource> downloadObject(
            @PathVariable String bucketName,
            @PathVariable String objectName) {
        User user = currentUserUtil.getCurrentUser();

        ObjectMetadata metadata = objectService.getObjectMetadata(user.getId(), bucketName, objectName);
        Resource resource = objectService.downloadObject(user.getId(), bucketName, objectName);

        MediaType contentType = metadata.getContentType() != null
                ? MediaType.parseMediaType(metadata.getContentType())
                : MediaType.APPLICATION_OCTET_STREAM;

        return ResponseEntity.ok()
                .contentType(contentType)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + objectName + "\"")
                .body(resource);
    }

    @DeleteMapping("/{objectName}")
    public ResponseEntity<Void> deleteObject(
            @PathVariable String bucketName,
            @PathVariable String objectName) {
        User user = currentUserUtil.getCurrentUser();
        objectService.deleteObject(user.getId(), bucketName, objectName);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{objectName}/metadata")
    public ResponseEntity<ObjectMetadataResponse> getObjectMetadata(
            @PathVariable String bucketName,
            @PathVariable String objectName) {
        User user = currentUserUtil.getCurrentUser();
        ObjectMetadata metadata = objectService.getObjectMetadata(user.getId(), bucketName, objectName);

        ObjectMetadataResponse response = mapToFullResponse(metadata);
        return ResponseEntity.ok(response);
    }

    private ObjectMetadataResponse mapToUploadResponse(ObjectMetadata metadata) {
        ObjectMetadataResponse r = new ObjectMetadataResponse();
        r.setId(metadata.getId());
        r.setBucketName(metadata.getBucketName());
        r.setFilename(metadata.getFilename());
        r.setContentType(metadata.getContentType());
        r.setSizeBytes(metadata.getSizeBytes());
        r.setUploadTime(metadata.getUploadTime());
        return r;
    }

    private ObjectMetadataResponse mapToListResponse(ObjectMetadata metadata) {
        ObjectMetadataResponse r = new ObjectMetadataResponse();
        r.setId(metadata.getId());
        r.setFilename(metadata.getFilename());
        r.setContentType(metadata.getContentType());
        r.setSizeBytes(metadata.getSizeBytes());
        r.setUploadTime(metadata.getUploadTime());
        return r;
    }

    private ObjectMetadataResponse mapToFullResponse(ObjectMetadata metadata) {
        ObjectMetadataResponse r = mapToUploadResponse(metadata);
        r.setFilePath(metadata.getFilePath());
        return r;
    }

}
