package com.smartcampus.backend.controller;

import com.smartcampus.backend.model.Role;
import com.smartcampus.backend.model.User;
import com.smartcampus.backend.service.UserService;
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

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
class UserControllerTest {

    private MockMvc mockMvc;

    @Autowired
    private WebApplicationContext context;

    @MockitoBean
    private UserService userService;

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
    @WithMockUser(authorities = "ROLE_ADMIN")
    void getAllUsers_ShouldReturnList() throws Exception {
        when(userService.getAllUsers()).thenReturn(Collections.singletonList(new User()));

        mockMvc.perform(get("/api/users"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }

    @Test
    @WithMockUser(authorities = "ROLE_ADMIN")
    void updateUserRole_ShouldReturnOk() throws Exception {
        User user = new User();
        user.setRole(Role.ROLE_ADMIN);
        when(userService.updateRole(anyString(), any())).thenReturn(user);

        mockMvc.perform(put("/api/users/user123/role")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"role\":\"ROLE_ADMIN\"}")
                .with(csrf()))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(authorities = "ROLE_ADMIN")
    void deleteUser_WhenSuccessful_ShouldReturnOk() throws Exception {
        mockMvc.perform(delete("/api/users/user123").with(csrf()))
                .andExpect(status().isOk());

        verify(userService, times(1)).deleteUser(eq("user123"), anyString());
    }

    @Test
    @WithMockUser(authorities = "ROLE_ADMIN")
    void deleteUser_WhenError_ShouldReturnBadRequest() throws Exception {
        doThrow(new RuntimeException("Error")).when(userService).deleteUser(anyString(), anyString());

        mockMvc.perform(delete("/api/users/user123").with(csrf()))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(authorities = "ROLE_USER") // Non-admin
    void getAllUsers_WhenNotAdmin_ShouldBeForbidden() throws Exception {
        mockMvc.perform(get("/api/users"))
                .andExpect(status().isForbidden());
    }
}
