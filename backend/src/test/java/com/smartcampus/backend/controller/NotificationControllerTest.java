package com.smartcampus.backend.controller;

import com.smartcampus.backend.model.Notification;
import com.smartcampus.backend.service.NotificationService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import java.util.Collections;

import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
class NotificationControllerTest {

    private MockMvc mockMvc;

    @Autowired
    private WebApplicationContext context;

    @MockitoBean
    private NotificationService notificationService;

    @MockitoBean
    private org.springframework.security.oauth2.client.registration.ClientRegistrationRepository clientRegistrationRepository;

    @BeforeEach
    void setup() {
        mockMvc = MockMvcBuilders
                .webAppContextSetup(context)
                .apply(springSecurity())
                .build();
    }

    @Test
    @WithMockUser
    void getUserNotifications_ShouldReturnList() throws Exception {
        when(notificationService.getUserNotifications("user123"))
                .thenReturn(Collections.singletonList(new Notification()));

        mockMvc.perform(get("/api/notifications/user/user123"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }

    @Test
    @WithMockUser
    void markAsRead_ShouldReturnOk() throws Exception {
        mockMvc.perform(put("/api/notifications/n1/read").with(csrf()))
                .andExpect(status().isOk());

        verify(notificationService, times(1)).markAsRead("n1");
    }

    @Test
    @WithMockUser
    void sendNotification_ShouldReturnSaved() throws Exception {
        Notification n = new Notification();
        n.setMessage("Test");
        
        when(notificationService.createNotification(anyString(), anyString(), anyString())).thenReturn(n);

        mockMvc.perform(post("/api/notifications/send")
                .param("userId", "u1")
                .param("message", "msg")
                .param("type", "INFO")
                .with(csrf()))
                .andExpect(status().isOk());
    }
}
