package com.s3clone.service;

import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.nio.file.Path;

public interface StorageService {

    /**
     * Saves a file to the local filesystem.
     *
     * @param file       the uploaded file
     * @param userId     the ID of the owning user
     * @param bucketName the name of the bucket
     * @param filename   the original filename
     * @return the absolute physical path where the file was stored
     */
    String saveFile(MultipartFile file, Long userId, String bucketName, String filename);

    /**
     * Retrieves a file as an InputStream.
     *
     * @param userId     the ID of the owning user
     * @param bucketName the name of the bucket
     * @param filename   the original filename
     * @return an InputStream of the file contents
     */
    InputStream retrieveFile(Long userId, String bucketName, String filename);

    /**
     * Deletes a file from the local filesystem.
     *
     * @param userId     the ID of the owning user
     * @param bucketName the name of the bucket
     * @param filename   the original filename
     */
    void deleteFile(Long userId, String bucketName, String filename);

}
