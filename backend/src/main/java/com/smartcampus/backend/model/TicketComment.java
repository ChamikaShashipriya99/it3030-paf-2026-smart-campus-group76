package com.smartcampus.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.time.LocalDateTime;

@Document(collection = "ticket_comments")
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

    public TicketComment() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public Ticket getTicket() { return ticket; }
    public void setTicket(Ticket ticket) { this.ticket = ticket; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
