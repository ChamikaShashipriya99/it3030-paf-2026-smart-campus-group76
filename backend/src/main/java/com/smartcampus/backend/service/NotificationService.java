package com.smartcampus.backend.service;

import com.smartcampus.backend.model.Notification;
import com.smartcampus.backend.model.Role;
import com.smartcampus.backend.model.User;
import com.smartcampus.backend.repository.NotificationRepository;
import com.smartcampus.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {
    @Autowired
    private NotificationRepository repository;

    @Autowired
    private UserRepository userRepository;

    public void notifyUsersByRole(Role role, String message, String type) {
        List<User> users = userRepository.findByRole(role);
        for (User user : users) {
            createNotification(user.getId(), message, type);
        }
    }

    public Notification createNotification(String userId, String message, String type) {
        User user = userRepository.findById(userId).orElseGet(() -> {
            User dummy = new User();
            dummy.setId(userId);
            return dummy;
        });
        
        Notification notif = new Notification();
        notif.setUser(user);
        notif.setMessage(message);
        notif.setType(type);
        return repository.save(notif);
    }

    public List<Notification> getUserNotifications(String userId) {
        return repository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public void markAsRead(String notificationId) {
        Notification notif = repository.findById(notificationId).orElseThrow(() -> new RuntimeException("Notification not found"));
        notif.setRead(true);
        repository.save(notif);
    }
}
