package com.smartcampus.backend.service;

import com.smartcampus.backend.model.Notification;
import com.smartcampus.backend.model.User;
import com.smartcampus.backend.repository.NotificationRepository;
import com.smartcampus.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class NotificationServiceTest {

    @Mock
    private NotificationRepository repository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private SimpMessagingTemplate messagingTemplate;

    @InjectMocks
    private NotificationService notificationService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void createNotification_WhenEnabled_ShouldSaveAndPushToSocket() {
        String userId = "user123";
        String message = "Hello";
        String type = "INFO";

        User user = new User();
        user.setId(userId);
        user.setNotificationsEnabled(true);

        Notification mockNotif = new Notification();
        mockNotif.setId("notif123");
        
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(repository.save(any(Notification.class))).thenReturn(mockNotif);

        Notification saved = notificationService.createNotification(userId, message, type);

        assertNotNull(saved);
        verify(repository, times(1)).save(any(Notification.class));
        verify(messagingTemplate, times(1)).convertAndSendToUser(eq(userId), eq("/queue/notifications"), any(Notification.class));
    }

    @Test
    void createNotification_WhenDisabled_ShouldNotSave() {
        String userId = "user123";
        
        User user = new User();
        user.setId(userId);
        user.setNotificationsEnabled(false);

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        Notification saved = notificationService.createNotification(userId, "ignored", "INFO");

        assertNull(saved);
        verify(repository, never()).save(any(Notification.class));
        verify(messagingTemplate, never()).convertAndSendToUser(anyString(), anyString(), any());
    }

    @Test
    void markAsRead_ShouldUpdateStatus() {
        Notification notif = new Notification();
        notif.setId("n1");
        notif.setRead(false);

        when(repository.findById("n1")).thenReturn(Optional.of(notif));
        when(repository.save(any(Notification.class))).thenReturn(notif);

        notificationService.markAsRead("n1");

        assertTrue(notif.isRead());
        verify(repository, times(1)).save(notif);
    }
}
