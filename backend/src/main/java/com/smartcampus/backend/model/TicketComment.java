package com.smartcampus.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.time.LocalDateTime;

@Document(collection = "ticket_comments")
@Data
public class TicketComment {
    @Id
    private String id;

    @DBRef
    private Ticket ticket;

    @DBRef
    private User user;

    @NotBlank(message = "Comment content cannot be empty")
    private String content;

    private LocalDateTime createdAt = LocalDateTime.now();
}
