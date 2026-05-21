package com.s3clone.controller;

import com.s3clone.dto.BucketRequest;
import com.s3clone.dto.BucketResponse;
import com.s3clone.entity.Bucket;
import com.s3clone.entity.User;
import com.s3clone.security.CurrentUserUtil;
import com.s3clone.service.BucketService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/buckets")
public class BucketController {

    private final BucketService bucketService;
    private final CurrentUserUtil currentUserUtil;

    public BucketController(BucketService bucketService, CurrentUserUtil currentUserUtil) {
        this.bucketService = bucketService;
        this.currentUserUtil = currentUserUtil;
    }

    @PostMapping
    public ResponseEntity<BucketResponse> createBucket(@RequestBody BucketRequest request) {
        User user = currentUserUtil.getCurrentUser();
        Bucket bucket = bucketService.createBucket(user.getId(), request.getBucketName());

        BucketResponse response = new BucketResponse();
        response.setBucketName(bucket.getBucketName());
        response.setCreatedAt(bucket.getCreatedAt());

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<BucketResponse>> listBuckets() {
        User user = currentUserUtil.getCurrentUser();
        List<Bucket> buckets = bucketService.listBuckets(user.getId());

        List<BucketResponse> responses = buckets.stream().map(b -> {
            BucketResponse r = new BucketResponse();
            r.setBucketName(b.getBucketName());
            r.setCreatedAt(b.getCreatedAt());
            return r;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(responses);
    }

    @DeleteMapping("/{bucketName}")
    public ResponseEntity<Void> deleteBucket(@PathVariable String bucketName) {
        User user = currentUserUtil.getCurrentUser();
        bucketService.deleteBucket(user.getId(), bucketName);
        return ResponseEntity.noContent().build();
    }

}
