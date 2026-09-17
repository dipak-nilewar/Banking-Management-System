 package com.digital_banking_management_system.service;

import java.util.List;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.digital_banking_management_system.dto.AdminCreateUserRequest;
import com.digital_banking_management_system.dto.UserRequest;
import com.digital_banking_management_system.entity.Role;
import com.digital_banking_management_system.entity.User;
import com.digital_banking_management_system.entity.UserStatus;
import com.digital_banking_management_system.exception.UserNotFoundException;
import com.digital_banking_management_system.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;
private final PasswordEncoder passwordEncoder;
private final AuditLogService auditLogService;

 public UserService(
        UserRepository userRepository,
        PasswordEncoder passwordEncoder,
        AuditLogService auditLogService) {

    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
    this.auditLogService = auditLogService;
}

    // ==========================================
    // Public Registration - CUSTOMER only
    // ==========================================

    public User createUser(UserRequest request) {

        String email = normalizeEmail(request.email());

        if (userRepository.findByEmail(email).isPresent()) {
            throw new IllegalArgumentException("Email already registered");
        }

        User user = User.builder()
                .name(request.name())
                .email(email)
                .password(passwordEncoder.encode(request.password()))
                .role(Role.CUSTOMER)
                .status(UserStatus.ACTIVE)
                .build();

        return userRepository.save(user);
    }

    // ==========================================
    // Admin Creates CUSTOMER or ADMIN
    // ==========================================

    public User createUserByAdmin(AdminCreateUserRequest request) {

    String email = normalizeEmail(request.getEmail());

    if (userRepository.findByEmail(email).isPresent()) {
        throw new IllegalArgumentException("Email already registered");
    }

    User user = User.builder()
            .name(request.getName())
            .email(email)
            .password(passwordEncoder.encode(request.getPassword()))
            .role(request.getRole())
            .status(UserStatus.ACTIVE)
            .build();

    User savedUser = userRepository.save(user);

    String adminEmail = SecurityContextHolder
            .getContext()
            .getAuthentication()
            .getName();

    auditLogService.log(
            "USER_CREATED",
            adminEmail,
            "SUCCESS",
            "Created user: " + savedUser.getEmail()
                    + ", role: " + savedUser.getRole()
    );

    return savedUser;
}
    // ==========================================
    // Get All Users
    // ==========================================

    public List<User> getUsers() {
        return userRepository.findAll();
    }

    // ==========================================
    // Get Logged-in User
    // ==========================================

    public User getMyUser() {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        return userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new UserNotFoundException("User not found"));
    }


  public User updateUserStatus(Long id, UserStatus status) {

    String loggedInEmail = SecurityContextHolder
            .getContext()
            .getAuthentication()
            .getName();

    User user = userRepository.findById(id)
            .orElseThrow(() ->
                    new UserNotFoundException(
                            "User not found with id: " + id
                    )
            );

    // Prevent admin from deactivating their own account
    if (user.getEmail().equalsIgnoreCase(loggedInEmail)
            && status == UserStatus.INACTIVE) {

        throw new IllegalArgumentException(
                "You cannot deactivate your own account"
        );
    }

    UserStatus oldStatus = user.getStatus();

    user.setStatus(status);

    User updatedUser = userRepository.save(user);

    auditLogService.log(
            "USER_STATUS_CHANGED",
            loggedInEmail,
            "SUCCESS",
            "User: " + updatedUser.getEmail()
                    + ", status changed from "
                    + oldStatus
                    + " to "
                    + status
    );

    return updatedUser;
}
    // ==========================================
    // Normalize Email
    // ==========================================

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase(java.util.Locale.ROOT);
    }
}