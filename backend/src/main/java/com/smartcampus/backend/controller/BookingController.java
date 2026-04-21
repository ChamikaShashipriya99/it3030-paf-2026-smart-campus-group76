package com.smartcampus.backend.controller;

import com.smartcampus.backend.model.Booking;
import com.smartcampus.backend.model.BookingStatus;
import com.smartcampus.backend.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @GetMapping
    public ResponseEntity<List<Booking>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Booking>> getUserBookings(@PathVariable String userId) {
        return ResponseEntity.ok(bookingService.getUserBookings(userId));
    }

    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody Map<String, Object> payload) {
        try {
            String userId = (String) payload.get("userId");
            String resourceId = (String) payload.get("resourceId");
            LocalDateTime start = LocalDateTime.parse((String) payload.get("startTime"));
            LocalDateTime end = LocalDateTime.parse((String) payload.get("endTime"));
            String purpose = (String) payload.get("purpose");
            int expectedAttendees = payload.get("expectedAttendees") != null ? ((Number) payload.get("expectedAttendees")).intValue() : 0;

            if (purpose == null || purpose.isBlank()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Purpose of booking is required"));
            }
            if (end.isBefore(start) || end.isEqual(start)) {
                return ResponseEntity.badRequest().body(Map.of("message", "End time must be after start time"));
            }

            Booking booking = bookingService.createBookingRequest(userId, resourceId, start, end, purpose, expectedAttendees);
            return ResponseEntity.ok(booking);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable String id, @RequestBody Map<String, String> payload) {
        try {
            BookingStatus status = BookingStatus.valueOf(payload.get("status"));
            String reason = payload.get("rejectionReason");
            Booking updated = bookingService.updateBookingStatus(id, status, reason);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/{id}/checkin")
    public ResponseEntity<?> checkIn(@PathVariable String id) {
        try {
            return ResponseEntity.ok(bookingService.checkInBooking(id));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
