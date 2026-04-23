package com.smartcampus.backend.service;

import com.smartcampus.backend.model.Role;
import com.smartcampus.backend.model.User;
import com.smartcampus.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void getUserByEmail_ShouldReturnUser() {
        User user = new User();
        user.setEmail("test@gmail.com");
        when(userRepository.findByEmail("test@gmail.com")).thenReturn(Optional.of(user));

        Optional<User> result = userService.getUserByEmail("test@gmail.com");

        assertTrue(result.isPresent());
        assertEquals("test@gmail.com", result.get().getEmail());
    }

    @Test
    void updateRole_ShouldSaveUserWithNewRole() {
        User user = new User();
        user.setId("user123");
        user.setRole(Role.ROLE_USER);

        when(userRepository.findById("user123")).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenReturn(user);

        User updated = userService.updateRole("user123", Role.ROLE_ADMIN);

        assertEquals(Role.ROLE_ADMIN, updated.getRole());
        verify(userRepository, times(1)).save(user);
    }

    @Test
    void deleteUser_WhenOtherUser_ShouldDelete() {
        when(userRepository.existsById("user123")).thenReturn(true);

        userService.deleteUser("user123", "admin999");

        verify(userRepository, times(1)).deleteById("user123");
    }

    @Test
    void deleteUser_WhenSelf_ShouldThrowException() {
        assertThrows(RuntimeException.class, () -> userService.deleteUser("user123", "user123"));
        verify(userRepository, never()).deleteById(anyString());
    }

    @Test
    void deleteUser_WhenNotExists_ShouldThrowException() {
        when(userRepository.existsById("unknown")).thenReturn(false);

        assertThrows(RuntimeException.class, () -> userService.deleteUser("unknown", "admin999"));
    }
}
