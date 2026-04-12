package com.smartcampus.backend.controller;

import com.smartcampus.backend.model.Notification;
import com.smartcampus.backend.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class NotificationController {

    @Autowired
    private NotificationService service;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Notification>> getUserNotifications(@PathVariable String userId) {
        return ResponseEntity.ok(service.getUserNotifications(userId));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(@PathVariable String id) {
        service.markAsRead(id);
        return ResponseEntity.ok().build();
    }
    
    @PostMapping("/send")
    public ResponseEntity<?> sendNotification(@RequestParam String userId, @RequestParam String message, @RequestParam String type) {
        return ResponseEntity.ok(service.createNotification(userId, message, type));
    }
}
