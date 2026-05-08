package com.edulink.compliance.seeder;

import com.edulink.compliance.entity.Audit;
import com.edulink.compliance.entity.ComplianceRecord;
import com.edulink.compliance.repository.AuditRepository;
import com.edulink.compliance.repository.ComplianceRecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final ComplianceRecordRepository complianceRecordRepository;
    private final AuditRepository auditRepository;

    @Override
    public void run(String... args) {
        if (complianceRecordRepository.count() > 0) return;

        complianceRecordRepository.save(ComplianceRecord.builder().entityId(1L)
                .type(ComplianceRecord.ComplianceType.COURSE).result("COMPLIANT")
                .date(LocalDate.now()).notes("Course meets all curriculum standards").build());

        complianceRecordRepository.save(ComplianceRecord.builder().entityId(1L)
                .type(ComplianceRecord.ComplianceType.ATTENDANCE).result("COMPLIANT")
                .date(LocalDate.now()).notes("Attendance above 75% threshold").build());

        auditRepository.save(Audit.builder().officerId(5L).scope("School-wide curriculum audit")
                .findings("All courses comply with board standards").date(LocalDate.now())
                .status(Audit.Status.CLOSED).build());

        System.out.println("Compliance seeder: 2 records and 1 audit created.");
    }
}
