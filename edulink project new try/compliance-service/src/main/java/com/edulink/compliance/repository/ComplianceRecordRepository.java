package com.edulink.compliance.repository;

import com.edulink.compliance.entity.ComplianceRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ComplianceRecordRepository extends JpaRepository<ComplianceRecord, Long> {
    List<ComplianceRecord> findByEntityId(Long entityId);
    List<ComplianceRecord> findByType(ComplianceRecord.ComplianceType type);
}
