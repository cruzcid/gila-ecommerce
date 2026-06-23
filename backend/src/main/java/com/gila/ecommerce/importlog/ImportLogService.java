package com.gila.ecommerce.importlog;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ImportLogService {

    private final ImportLogRepository importLogRepository;

    public void log(String fileName, int importedCount, List<String> skipped, List<String> errors) {
        ImportLog log = ImportLog.builder()
                .fileName(fileName)
                .importedCount(importedCount)
                .skippedCount(skipped.size())
                .errorCount(errors.size())
                .skipped(skipped)
                .errors(errors)
                .importedAt(LocalDateTime.now())
                .build();

        importLogRepository.save(log);
    }

    public List<ImportLog> findAll() {
        return importLogRepository.findAllByOrderByImportedAtDesc();
    }
}
