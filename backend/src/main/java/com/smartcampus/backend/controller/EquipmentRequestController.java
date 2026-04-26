package com.smartcampus.backend.controller;

import com.smartcampus.backend.model.EquipmentRequest;
import com.smartcampus.backend.service.EquipmentRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/equipment-requests")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class EquipmentRequestController {

    @Autowired
    private EquipmentRequestService service;

    /**
     * Submit a new equipment request.
     * Body: { resourceId, userId, requestDate, startTime, endTime, purpose }
     */
    @PostMapping
    public ResponseEntity<?> createRequest(@RequestBody Map<String, Object> payload) {
        try {
            String userId      = (String) payload.get("userId");
            String resourceId  = (String) payload.get("resourceId");
            String startRaw    = (String) payload.get("startTime");
            String endRaw      = (String) payload.get("endTime");
            String purpose     = (String) payload.get("purpose");

            if (purpose == null || purpose.isBlank()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Purpose is required"));
            }
            if (startRaw == null || startRaw.isBlank()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Start time is required"));
            }
            if (endRaw == null || endRaw.isBlank()) {
                return ResponseEntity.badRequest().body(Map.of("message", "End time is required"));
            }

            LocalDateTime start = LocalDateTime.parse(startRaw);
            LocalDateTime end   = LocalDateTime.parse(endRaw);

            // requestDate is optional — derive from startTime date portion if absent
            String requestDate = (String) payload.get("requestDate");
            if (requestDate == null || requestDate.isBlank()) {
                requestDate = start.toLocalDate().toString(); // "yyyy-MM-dd"
            }

            EquipmentRequest req = service.createRequest(userId, resourceId, requestDate, start, end, purpose);
            return ResponseEntity.ok(req);
        } catch (Exception e) {
            String msg = (e.getMessage() != null) ? e.getMessage() : e.toString();
            return ResponseEntity.badRequest().body(Map.of("message", msg));
        }
    }

    /**
     * Fetch equipment requests for the currently logged-in user.
     * Query param: userId
     */
    @GetMapping("/my")
    public ResponseEntity<?> getMyRequests(@RequestParam String userId) {
        try {
            List<EquipmentRequest> requests = service.getMyRequests(userId);
            return ResponseEntity.ok(requests);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    /**
     * Fetch all PENDING requests — admin only.
     */
    @GetMapping("/pending")
    public ResponseEntity<?> getPendingRequests() {
        try {
            return ResponseEntity.ok(service.getAllPendingRequests());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    /**
     * Fetch all equipment requests (all statuses) — admin only.
     */
    @GetMapping("/all")
    public ResponseEntity<?> getAllRequests() {
        try {
            return ResponseEntity.ok(service.getAllRequests());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    /**
     * Admin approves a request.
     * Side-effect: creates a confirmed Booking automatically.
     */
    @PutMapping("/{id}/approve")
    public ResponseEntity<?> approveRequest(@PathVariable String id) {
        try {
            EquipmentRequest approved = service.approveRequest(id);
            return ResponseEntity.ok(approved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    /**
     * Admin rejects a request.
     * Body (optional): { reason: "..." }
     */
    @PutMapping("/{id}/reject")
    public ResponseEntity<?> rejectRequest(@PathVariable String id,
                                           @RequestBody(required = false) Map<String, String> payload) {
        try {
            String reason = payload != null ? payload.get("reason") : null;
            EquipmentRequest rejected = service.rejectRequest(id, reason);
            return ResponseEntity.ok(rejected);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
