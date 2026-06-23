package com.gila.ecommerce.importlog;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/import-logs")
@RequiredArgsConstructor
public class ImportLogController {

    private final ImportLogService importLogService;

    @GetMapping
    public ResponseEntity<List<ImportLog>> getAll() {
        return ResponseEntity.ok(importLogService.findAll());
    }
}
