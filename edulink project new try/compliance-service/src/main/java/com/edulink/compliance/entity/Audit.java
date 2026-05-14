package com.edulink.compliance.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "audits")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Audit {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long auditId;
    private Long officerId;
    private String scope;
    private String findings;
    private LocalDate date;
    @Enumerated(EnumType.STRING)
    private Status status;
    public enum Status { OPEN, IN_PROGRESS, CLOSED }
}
