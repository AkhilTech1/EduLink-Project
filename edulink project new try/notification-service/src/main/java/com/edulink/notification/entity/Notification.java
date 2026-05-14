package com.edulink.notification.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Notification {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long notificationId;
    private Long userId;
    private Long entityId;
    private String message;
    @Enumerated(EnumType.STRING)
    private Category category;
    @Enumerated(EnumType.STRING)
    private Status status;
    private LocalDateTime createdDate;
    public enum Category { ENROLLMENT, COURSE, EXAM, COMPLIANCE }
    public enum Status { SENT, PENDING, FAILED }
}
