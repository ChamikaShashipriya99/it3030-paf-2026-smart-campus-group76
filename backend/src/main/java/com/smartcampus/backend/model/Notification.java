package com.smartcampus.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import java.time.LocalDateTime;

@Document(collection = "notifications")
@Data
public class Notification {
    @Id
    private String id;

    @DBRef
    private User user;

    private String message;
    
    private String type; // e.g., INFO, SUCCESS, WARNING
    
    private boolean isRead = false;
    
    private LocalDateTime createdAt = LocalDateTime.now();
}
