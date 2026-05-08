package com.edulink.exam.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "exams")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Exam {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long examId;
    private Long courseId;
    @Enumerated(EnumType.STRING)
    private ExamType type;
    private LocalDate date;
    @Enumerated(EnumType.STRING)
    private Status status;
    public enum ExamType { MIDTERM, FINAL, QUIZ }
    public enum Status { SCHEDULED, ONGOING, COMPLETED, CANCELLED }
}
