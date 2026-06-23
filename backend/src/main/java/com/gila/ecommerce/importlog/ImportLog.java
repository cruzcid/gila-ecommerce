package com.gila.ecommerce.importlog;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "import_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ImportLog {

    @Id
    private String id;

    private String fileName;
    private int importedCount;
    private int skippedCount;
    private int errorCount;
    private List<String> skipped;
    private List<String> errors;
    private LocalDateTime importedAt;
}
