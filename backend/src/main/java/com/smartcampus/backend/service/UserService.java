package com.smartcampus.backend.service;

import com.smartcampus.backend.model.Role;
import com.smartcampus.backend.model.User;
import com.smartcampus.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User updateRole(String userId, Role newRole) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setRole(newRole);
        return userRepository.save(user);
    }

    public List<User> getTechnicians() {
        return userRepository.findByRole(Role.ROLE_TECHNICIAN);
    }

    public void toggleFavorite(String userId, String ticketId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (user.getStarredTicketIds() == null) {
            user.setStarredTicketIds(new java.util.ArrayList<>());
        }
        if (user.getStarredTicketIds().contains(ticketId)) {
            user.getStarredTicketIds().remove(ticketId);
        } else {
            user.getStarredTicketIds().add(ticketId);
        }
        userRepository.save(user);
    }

    public List<String> getFavorites(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getStarredTicketIds();
    }
}
