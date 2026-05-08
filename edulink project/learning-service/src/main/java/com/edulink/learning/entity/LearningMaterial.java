package com.edulink.learning.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "learning_materials")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class LearningMaterial {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long materialId;
    private Long courseId;
    private String title;
    private String fileUri;
    private LocalDate uploadedDate;
    @Enumerated(EnumType.STRING)
    private Status status;
    public enum Status { ACTIVE, INACTIVE }
}
