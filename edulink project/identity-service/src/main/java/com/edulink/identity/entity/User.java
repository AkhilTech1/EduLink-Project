package com.edulink.identity.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;

    private String name;

    @Enumerated(EnumType.STRING)
    private Role role;

    @Column(unique = true)
    private String email;

    private String phone;
    private String password;

    @Enumerated(EnumType.STRING)
    private Status status;

    public enum Role { STUDENT, TEACHER, ADMIN, BOARD, COMPLIANCE, REGULATOR }
    public enum Status { ACTIVE, INACTIVE }
}
