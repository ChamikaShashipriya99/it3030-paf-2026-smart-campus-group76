package com.smartcampus.backend.controller;

//import packages
import com.smartcampus.backend.model.Ticket;
import com.smartcampus.backend.model.TicketStatus;
import com.smartcampus.backend.service.TicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class TicketController {

    @Autowired
    private TicketService ticketService;

    @GetMapping
    public ResponseEntity<List<Ticket>> getAllTickets() {
        return ResponseEntity.ok(ticketService.getAllTickets());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getTicketById(@PathVariable String id) {
        try {
            return ResponseEntity.ok(ticketService.getTicketById(id));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Ticket>> getUserTickets(@PathVariable String userId) {
        return ResponseEntity.ok(ticketService.getTicketsByCreator(userId));
    }

    @GetMapping("/technician/{techId}")
    public ResponseEntity<List<Ticket>> getTechnicianTickets(@PathVariable String techId) {
        return ResponseEntity.ok(ticketService.getTicketsByTechnician(techId));
    }

    @PostMapping
    public ResponseEntity<?> createTicket(@RequestBody Map<String, Object> payload) {
        try {
            String creatorId = (String) payload.get("creatorId");
            String resourceId = (String) payload.get("resourceId");
            String category = (String) payload.get("category");
            String description = (String) payload.get("description");
            String priority = (String) payload.get("priority");
            String contactDetails = (String) payload.get("contactDetails");

            if (description == null || description.isBlank()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Description is required"));
            }
            if (contactDetails == null || contactDetails.isBlank()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Contact details are required"));
            }

            Ticket ticket = ticketService.createTicket(creatorId, resourceId, category, description, priority,
                    contactDetails);
            return ResponseEntity.ok(ticket);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/{id}/assign/{techId}")
    public ResponseEntity<?> assignTechnician(@PathVariable String id, @PathVariable String techId) {
        try {
            return ResponseEntity.ok(ticketService.assignTechnician(id, techId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable String id, @RequestBody Map<String, String> payload) {
        try {
            TicketStatus status = TicketStatus.valueOf(payload.get("status"));
            String notes = payload.get("resolutionNotes");
            return ResponseEntity.ok(ticketService.updateTicketStatus(id, status, notes));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/{id}/comments")
    public ResponseEntity<?> addComment(@PathVariable String id, @RequestBody Map<String, Object> payload) {
        try {
            String userId = (String) payload.get("userId");
            String content = (String) payload.get("content");
            return ResponseEntity.ok(ticketService.addComment(id, userId, content));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/{id}/comments")
    public ResponseEntity<?> getComments(@PathVariable String id) {
        return ResponseEntity.ok(ticketService.getComments(id));
    }

    @DeleteMapping("/comments/{commentId}/user/{userId}")
    public ResponseEntity<?> deleteComment(@PathVariable String commentId, @PathVariable String userId) {
        try {
            ticketService.deleteComment(commentId, userId);
            return ResponseEntity.ok(Map.of("message", "Deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/comments/{commentId}/user/{userId}")
    public ResponseEntity<?> updateComment(@PathVariable String commentId, @PathVariable String userId,
            @RequestBody Map<String, String> payload) {
        try {
            String content = payload.get("content");
            return ResponseEntity.ok(ticketService.updateComment(commentId, userId, content));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/{id}/attachments")
    public ResponseEntity<?> uploadAttachment(@PathVariable String id,
            @RequestParam("file") org.springframework.web.multipart.MultipartFile file) {
        try {
            return ResponseEntity.ok(ticketService.uploadAttachment(id, file));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/{id}/attachments")
    public ResponseEntity<?> getAttachments(@PathVariable String id) {
        return ResponseEntity.ok(ticketService.getAttachments(id));
    }

    @GetMapping("/analytics")
    public ResponseEntity<?> getOperationalAnalytics() {
        return ResponseEntity.ok(ticketService.getOperationalAnalytics());
    }
}

