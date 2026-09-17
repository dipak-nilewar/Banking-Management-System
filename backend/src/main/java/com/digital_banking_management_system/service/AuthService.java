package com.digital_banking_management_system.service;
  

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.Locale;

import com.digital_banking_management_system.dto.LoginRequest;
import com.digital_banking_management_system.dto.LoginResponse;
import com.digital_banking_management_system.entity.User;
import com.digital_banking_management_system.repository.UserRepository;
import com.digital_banking_management_system.security.JwtService;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public LoginResponse login(LoginRequest request) {
        String email = request.getEmail().trim().toLowerCase(Locale.ROOT);

        // 1. Find user by email
        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new org.springframework.web.server.ResponseStatusException(
                                HttpStatus.UNAUTHORIZED,
                                "Invalid email or password"
                        )
                );

        // 2. Check password
        boolean passwordMatches;
        try {
            passwordMatches = passwordEncoder.matches(
                    request.getPassword(),
                    user.getPassword()
            );
        } catch (IllegalArgumentException exception) {
            passwordMatches = false;
        }

        if (!passwordMatches) {
            throw new org.springframework.web.server.ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Invalid email or password"
            );
        }

        // 3. Generate JWT token
        String token =
                jwtService.generateToken(email);

        // 4. Return response
        return new LoginResponse(
                "Login successful",
                token
        );
    }
}