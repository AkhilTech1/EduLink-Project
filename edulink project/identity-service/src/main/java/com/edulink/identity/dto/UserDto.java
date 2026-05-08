package com.edulink.identity.dto;

import com.edulink.identity.entity.User;
import lombok.Builder;
import lombok.Data;

public class UserDto {

    @Data
    public static class Request {
        private String name;
        private String email;
        private String phone;
        private String password;
        private String role;
        private String status;
    }

    @Data
    @Builder
    public static class Response {
        private Long userId;
        private String name;
        private String email;
        private String phone;
        private String role;
        private String status;

        public static Response from(User user) {
            return Response.builder()
                    .userId(user.getUserId())
                    .name(user.getName())
                    .email(user.getEmail())
                    .phone(user.getPhone())
                    .role(user.getRole().name())
                    .status(user.getStatus().name())
                    .build();
        }
    }
}
