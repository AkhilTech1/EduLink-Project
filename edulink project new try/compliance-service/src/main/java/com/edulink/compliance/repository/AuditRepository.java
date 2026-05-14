package com.edulink.compliance.repository;

import com.edulink.compliance.entity.Audit;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AuditRepository extends JpaRepository<Audit, Long> {
    List<Audit> findByOfficerId(Long officerId);
}
