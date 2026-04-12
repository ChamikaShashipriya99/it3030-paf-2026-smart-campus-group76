package com.smartcampus.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;

@Document(collection = "ticket_attachments")
@Data
public class TicketAttachment {
    @Id
    private String id;

    @DBRef
    private Ticket ticket;

    private String fileName;
    
    private String contentType;

    private byte[] data;
}
