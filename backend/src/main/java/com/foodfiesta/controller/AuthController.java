package com.foodfiesta.controller;

import com.foodfiesta.dto.LoginRequest;
import com.foodfiesta.dto.LoginResponse;
import com.foodfiesta.model.Role;
import com.foodfiesta.model.User;
import com.foodfiesta.service.UserService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.util.UUID;

/**
 * Simplified role-based session mock. No real password checks, no signed
 * tokens - just enough to let the frontend remember "who" is browsing which
 * portal for this demo session.
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        Role role;
        try {
            role = Role.valueOf(request.getRole().toUpperCase());
        } catch (Exception ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unknown role: " + request.getRole());
        }
        User user = userService.loginOrCreate(request.getName(), role);
        String token = "demo-token-" + UUID.randomUUID().toString().replace("-", "");
        return new LoginResponse(token, user.getId(), user.getName(), user.getRole().name());
    }
}
