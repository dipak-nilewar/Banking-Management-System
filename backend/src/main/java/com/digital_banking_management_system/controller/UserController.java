 package com.digital_banking_management_system.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.digital_banking_management_system.dto.AdminCreateUserRequest;
import com.digital_banking_management_system.dto.LoginRequest;
import com.digital_banking_management_system.dto.LoginResponse;
import com.digital_banking_management_system.dto.UserRequest;
import com.digital_banking_management_system.entity.User;
import com.digital_banking_management_system.entity.UserStatus;
import com.digital_banking_management_system.service.AuthService;
import com.digital_banking_management_system.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final AuthService authService;

    public UserController(
            UserService userService,
            AuthService authService) {

        this.userService = userService;
        this.authService = authService;
    }

    // Register user
 // Public registration - CUSTOMER only
@PostMapping("/register")
public ResponseEntity<User> registerUser(
        @Valid @RequestBody UserRequest request) {

    return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(userService.createUser(request));
}

// Admin creates CUSTOMER or ADMIN
@PreAuthorize("hasRole('ADMIN')")
@PostMapping
public ResponseEntity<User> createUserByAdmin(
        @Valid @RequestBody AdminCreateUserRequest request) {

    return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(userService.createUserByAdmin(request));
}

    @GetMapping("/me")
public ResponseEntity<User> getMyUser() {

    return ResponseEntity.ok(
            userService.getMyUser()
    );
}   

    // Get all users - ADMIN only
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<List<User>> getUsers() {

        return ResponseEntity.ok(
                userService.getUsers()
        );
    }

    // Login - PUBLIC
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @Valid @RequestBody LoginRequest request) {

        return ResponseEntity.ok(
                authService.login(request)
        );
    }

    @PreAuthorize("hasRole('ADMIN')")
@PutMapping("/{id}/status")
public ResponseEntity<User> updateUserStatus(
        @PathVariable Long id,
        @RequestParam UserStatus status) {

    return ResponseEntity.ok(
            userService.updateUserStatus(id, status)
    );
}
    
}