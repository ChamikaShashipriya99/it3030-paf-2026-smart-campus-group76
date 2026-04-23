package com.smartcampus.backend.service;

import com.smartcampus.backend.model.Notification;
import com.smartcampus.backend.model.Role;
import com.smartcampus.backend.model.User;
import com.smartcampus.backend.repository.NotificationRepository;
import com.smartcampus.backend.repository.UserRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {
    @Autowired
    private NotificationRepository repository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public void notifyUsersByRole(Role role, String message, String type) {
        List<User> users = userRepository.findByRole(role);
        for (User user : users) {
            createNotification(user.getId(), message, type);
        }
    }

    public Notification createNotification(String userId, String message, String type) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Innovation: Filter based on user preference flags
        if (!user.isNotificationsEnabled()) {
            return null; // Skip if disabled
        }

        Notification notif = new Notification();
        notif.setUser(user);
        notif.setMessage(message);
        notif.setType(type);
        Notification saved = repository.save(notif);

        // Push real-time notification to the user
        messagingTemplate.convertAndSendToUser(userId, "/queue/notifications", saved);
        
        return saved;
    }

    public List<Notification> getUserNotifications(String userId) {
        return repository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public void markAsRead(String notificationId) {
        Notification notif = repository.findById(notificationId).orElseThrow(() -> new RuntimeException("Notification not found"));
        notif.setRead(true);
        repository.save(notif);
    }

    public void markAllAsRead(String userId) {
        List<Notification> unread = repository.findByUserIdAndIsReadFalse(userId);
        for (Notification n : unread) {
            n.setRead(true);
        }
        repository.saveAll(unread);
    }
}
