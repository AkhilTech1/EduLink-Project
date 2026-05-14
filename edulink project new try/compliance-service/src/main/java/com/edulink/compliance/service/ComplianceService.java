package com.edulink.compliance.service;

import com.edulink.compliance.dto.AuditDto;
import com.edulink.compliance.dto.ComplianceRecordDto;
import com.edulink.compliance.entity.Audit;
import com.edulink.compliance.entity.ComplianceRecord;
import com.edulink.compliance.exception.ResourceNotFoundException;
import com.edulink.compliance.repository.AuditRepository;
import com.edulink.compliance.repository.ComplianceRecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ComplianceService {

    private final ComplianceRecordRepository complianceRecordRepository;
    private final AuditRepository auditRepository;

    public List<ComplianceRecordDto.Response> getAllRecords() {
        return complianceRecordRepository.findAll().stream().map(ComplianceRecordDto.Response::from).toList();
    }

    public ComplianceRecordDto.Response getRecord(Long id) {
        return ComplianceRecordDto.Response.from(complianceRecordRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Compliance record not found with id: " + id)));
    }

    public ComplianceRecordDto.Response saveRecord(ComplianceRecordDto.Request request) {
        ComplianceRecord r = ComplianceRecord.builder()
                .entityId(request.getEntityId())
                .type(ComplianceRecord.ComplianceType.valueOf(request.getType()))
                .result(request.getResult())
                .date(request.getDate())
                .notes(request.getNotes())
                .build();
        return ComplianceRecordDto.Response.from(complianceRecordRepository.save(r));
    }

    public ComplianceRecordDto.Response updateRecord(Long id, ComplianceRecordDto.Request request) {
        ComplianceRecord r = complianceRecordRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Compliance record not found with id: " + id));
        r.setEntityId(request.getEntityId());
        r.setType(ComplianceRecord.ComplianceType.valueOf(request.getType()));
        r.setResult(request.getResult());
        r.setDate(request.getDate());
        r.setNotes(request.getNotes());
        return ComplianceRecordDto.Response.from(complianceRecordRepository.save(r));
    }

    public void deleteRecord(Long id) {
        if (!complianceRecordRepository.existsById(id))
            throw new ResourceNotFoundException("Compliance record not found with id: " + id);
        complianceRecordRepository.deleteById(id);
    }

    public List<AuditDto.Response> getAllAudits() {
        return auditRepository.findAll().stream().map(AuditDto.Response::from).toList();
    }

    public AuditDto.Response getAudit(Long id) {
        return AuditDto.Response.from(auditRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Audit not found with id: " + id)));
    }

    public AuditDto.Response saveAudit(AuditDto.Request request) {
        Audit a = Audit.builder()
                .officerId(request.getOfficerId())
                .scope(request.getScope())
                .findings(request.getFindings())
                .date(request.getDate())
                .status(Audit.Status.valueOf(request.getStatus()))
                .build();
        return AuditDto.Response.from(auditRepository.save(a));
    }

    public AuditDto.Response updateAudit(Long id, AuditDto.Request request) {
        Audit a = auditRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Audit not found with id: " + id));
        a.setOfficerId(request.getOfficerId());
        a.setScope(request.getScope());
        a.setFindings(request.getFindings());
        a.setDate(request.getDate());
        a.setStatus(Audit.Status.valueOf(request.getStatus()));
        return AuditDto.Response.from(auditRepository.save(a));
    }

    public void deleteAudit(Long id) {
        if (!auditRepository.existsById(id))
            throw new ResourceNotFoundException("Audit not found with id: " + id);
        auditRepository.deleteById(id);
    }
}
