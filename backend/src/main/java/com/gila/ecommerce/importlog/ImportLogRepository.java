package com.gila.ecommerce.importlog;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ImportLogRepository extends MongoRepository<ImportLog, String> {

    List<ImportLog> findAllByOrderByImportedAtDesc();
}
