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
}
