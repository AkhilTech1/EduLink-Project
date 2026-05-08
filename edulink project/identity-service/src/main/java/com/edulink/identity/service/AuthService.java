package com.edulink.identity.service;

import com.edulink.identity.dto.AuditLogDto;
import com.edulink.identity.dto.AuthDto;
import com.edulink.identity.dto.UserDto;
import com.edulink.identity.entity.AuditLog;
import com.edulink.identity.entity.User;
import com.edulink.identity.exception.ResourceNotFoundException;
import com.edulink.identity.repository.AuditLogRepository;
import com.edulink.identity.repository.UserRepository;
import com.edulink.identity.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final AuditLogRepository auditLogRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    public AuthDto.AuthResponse login(AuthDto.LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + request.getEmail()));
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword()))
            throw new IllegalArgumentException("Invalid credentials");

        auditLogRepository.save(AuditLog.builder()
                .userId(user.getUserId()).action("LOGIN")
                .resource("AUTH").timestamp(LocalDateTime.now()).build());

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());
        return new AuthDto.AuthResponse(token, user.getRole().name(), user.getEmail());
    }

    public UserDto.Response register(AuthDto.RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent())
            throw new IllegalArgumentException("Email already registered: " + request.getEmail());
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(User.Role.valueOf(request.getRole()))
                .status(User.Status.ACTIVE)
                .build();
        return UserDto.Response.from(userRepository.save(user));
    }

    public List<UserDto.Response> getAllUsers() {
        return userRepository.findAll().stream().map(UserDto.Response::from).toList();
    }

    public UserDto.Response getUserById(Long id) {
        return UserDto.Response.from(userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id)));
    }

    public UserDto.Response updateUser(Long id, UserDto.Request request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        user.setName(request.getName());
        user.setPhone(request.getPhone());
        if (request.getStatus() != null) user.setStatus(User.Status.valueOf(request.getStatus()));
        return UserDto.Response.from(userRepository.save(user));
    }

    public List<AuditLogDto.Response> getAuditLogs() {
        return auditLogRepository.findAll().stream().map(AuditLogDto.Response::from).toList();
    }
}
