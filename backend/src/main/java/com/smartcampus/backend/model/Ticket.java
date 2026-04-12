package com.smartcampus.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Document(collection = "tickets")
public class Ticket {

    @Id
    private String id;

    @DBRef
    @NotNull
    private Resource resource;

    @DBRef
    @NotNull
    private User creator;

    @DBRef
    private User technician; // Optional until assigned

    @NotBlank(message = "Category is required")
    private String category; // e.g. "FURNITURE", "IT_EQUIPMENT", "PLUMBING"

    @NotBlank(message = "Description is required")
    private String description;

    @NotBlank(message = "Priority is required")
    private String priority; // "LOW", "MEDIUM", "HIGH"

    @NotBlank(message = "Contact details are required")
    private String contactDetails;

    @NotNull(message = "Status is required")
    private TicketStatus status;

    private String resolutionNotes;

    private LocalDateTime createdAt = LocalDateTime.now();

    public Ticket() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public Resource getResource() { return resource; }
    public void setResource(Resource resource) { this.resource = resource; }
    public User getCreator() { return creator; }
    public void setCreator(User creator) { this.creator = creator; }
    public User getTechnician() { return technician; }
    public void setTechnician(User technician) { this.technician = technician; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }
    public String getContactDetails() { return contactDetails; }
    public void setContactDetails(String contactDetails) { this.contactDetails = contactDetails; }
    public TicketStatus getStatus() { return status; }
    public void setStatus(TicketStatus status) { this.status = status; }
    public String getResolutionNotes() { return resolutionNotes; }
    public void setResolutionNotes(String resolutionNotes) { this.resolutionNotes = resolutionNotes; }
    public java.time.LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(java.time.LocalDateTime createdAt) { this.createdAt = createdAt; }
}
