package com.edulink.compliance.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "compliance_records")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class ComplianceRecord {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long complianceId;
    private Long entityId;
    @Enumerated(EnumType.STRING)
    private ComplianceType type;
    private String result;
    private LocalDate date;
    private String notes;
    public enum ComplianceType { COURSE, EXAM, ATTENDANCE }
}
