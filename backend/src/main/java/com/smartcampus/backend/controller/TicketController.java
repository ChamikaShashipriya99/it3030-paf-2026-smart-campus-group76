package com.smartcampus.backend.controller;

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
    public ResponseEntity<?> getTicketById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(ticketService.getTicketById(id));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Ticket>> getUserTickets(@PathVariable Long userId) {
        return ResponseEntity.ok(ticketService.getTicketsByCreator(userId));
    }
    
    @GetMapping("/technician/{techId}")
    public ResponseEntity<List<Ticket>> getTechnicianTickets(@PathVariable Long techId) {
        return ResponseEntity.ok(ticketService.getTicketsByTechnician(techId));
    }

    @PostMapping
    public ResponseEntity<?> createTicket(@RequestBody Map<String, Object> payload) {
        try {
            Long creatorId = ((Number) payload.get("creatorId")).longValue();
            Long resourceId = ((Number) payload.get("resourceId")).longValue();
            String category = (String) payload.get("category");
            String description = (String) payload.get("description");
            String priority = (String) payload.get("priority");

            Ticket ticket = ticketService.createTicket(creatorId, resourceId, category, description, priority);
            return ResponseEntity.ok(ticket);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/{id}/assign/{techId}")
    public ResponseEntity<?> assignTechnician(@PathVariable Long id, @PathVariable Long techId) {
        try {
            return ResponseEntity.ok(ticketService.assignTechnician(id, techId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        try {
            TicketStatus status = TicketStatus.valueOf(payload.get("status"));
            String notes = payload.get("resolutionNotes");
            return ResponseEntity.ok(ticketService.updateTicketStatus(id, status, notes));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/{id}/comments")
    public ResponseEntity<?> addComment(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        try {
            Long userId = ((Number) payload.get("userId")).longValue();
            String content = (String) payload.get("content");
            return ResponseEntity.ok(ticketService.addComment(id, userId, content));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/{id}/comments")
    public ResponseEntity<?> getComments(@PathVariable Long id) {
        return ResponseEntity.ok(ticketService.getComments(id));
    }
    
    @DeleteMapping("/comments/{commentId}/user/{userId}")
    public ResponseEntity<?> deleteComment(@PathVariable Long commentId, @PathVariable Long userId) {
        try {
            ticketService.deleteComment(commentId, userId);
            return ResponseEntity.ok(Map.of("message", "Deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/{id}/attachments")
    public ResponseEntity<?> uploadAttachment(@PathVariable Long id, @RequestParam("file") org.springframework.web.multipart.MultipartFile file) {
        try {
            return ResponseEntity.ok(ticketService.uploadAttachment(id, file));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/{id}/attachments")
    public ResponseEntity<?> getAttachments(@PathVariable Long id) {
        return ResponseEntity.ok(ticketService.getAttachments(id));
    }
}
