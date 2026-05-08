package com.edulink.identity.dto;

import lombok.Data;

public class AuthDto {

    @Data
    public static class LoginRequest {
        private String email;
        private String password;
    }

    @Data
    public static class RegisterRequest {
        private String name;
        private String email;
        private String phone;
        private String password;
        private String role;
    }

    @Data
    public static class AuthResponse {
        private String token;
        private String role;
        private String email;

        public AuthResponse(String token, String role, String email) {
            this.token = token;
            this.role = role;
            this.email = email;
        }
    }
}
