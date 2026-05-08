package com.edulink.identity.controller;

import com.edulink.identity.dto.AuditLogDto;
import com.edulink.identity.dto.AuthDto;
import com.edulink.identity.dto.UserDto;
import com.edulink.identity.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthDto.AuthResponse> login(@RequestBody AuthDto.LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/register")
    public ResponseEntity<UserDto.Response> register(@RequestBody AuthDto.RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @GetMapping("/users")
    @PreAuthorize("hasAnyRole('ADMIN', 'BOARD', 'COMPLIANCE', 'REGULATOR')")
    public ResponseEntity<List<UserDto.Response>> getUsers() {
        return ResponseEntity.ok(authService.getAllUsers());
    }

    @GetMapping("/users/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'BOARD', 'COMPLIANCE', 'REGULATOR')")
    public ResponseEntity<UserDto.Response> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(authService.getUserById(id));
    }

    @PutMapping("/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserDto.Response> updateUser(@PathVariable Long id, @RequestBody UserDto.Request request) {
        return ResponseEntity.ok(authService.updateUser(id, request));
    }

    @GetMapping("/audit-logs")
    @PreAuthorize("hasAnyRole('ADMIN', 'COMPLIANCE', 'REGULATOR')")
    public ResponseEntity<List<AuditLogDto.Response>> getAuditLogs() {
        return ResponseEntity.ok(authService.getAuditLogs());
    }
}
