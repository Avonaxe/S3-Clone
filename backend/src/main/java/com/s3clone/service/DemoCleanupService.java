package com.s3clone.service;

import com.s3clone.repository.ObjectMetadataRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Comparator;
import java.util.stream.Stream;

@Service
public class DemoCleanupService {

    private final ObjectMetadataRepository objectMetadataRepository;

    public DemoCleanupService(ObjectMetadataRepository objectMetadataRepository) {
        this.objectMetadataRepository = objectMetadataRepository;
    }

    @Scheduled(cron = "0 0 0 * * ?")
    @Transactional
    public void runDailyCleanup() {
        System.out.println("[DemoCleanupService] Starting daily cleanup at midnight...");

        // Step 1: Wipe all metadata records from PostgreSQL
        objectMetadataRepository.deleteAll();
        System.out.println("[DemoCleanupService] All object_metadata records deleted.");

        // Step 2: Recursively wipe all files inside ./storage/
        Path storageRoot = Paths.get("storage");
        if (Files.exists(storageRoot)) {
            try (Stream<Path> walk = Files.walk(storageRoot)) {
                walk.sorted(Comparator.reverseOrder())
                        .forEach(path -> {
                            try {
                                Files.delete(path);
                            } catch (IOException e) {
                                System.err.println("[DemoCleanupService] Failed to delete: " + path + " — " + e.getMessage());
                            }
                        });
            } catch (IOException e) {
                System.err.println("[DemoCleanupService] Failed to walk storage directory: " + e.getMessage());
            }
        }

        System.out.println("[DemoCleanupService] Daily cleanup complete.");
    }

}
