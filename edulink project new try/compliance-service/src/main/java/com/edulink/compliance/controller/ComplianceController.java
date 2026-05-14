package com.edulink.compliance.controller;

import com.edulink.compliance.dto.AuditDto;
import com.edulink.compliance.dto.ComplianceRecordDto;
import com.edulink.compliance.service.ComplianceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class ComplianceController {

    private final ComplianceService complianceService;

    @GetMapping("/api/compliance")
    @PreAuthorize("hasAnyRole('ADMIN', 'COMPLIANCE', 'BOARD', 'REGULATOR')")
    public ResponseEntity<List<ComplianceRecordDto.Response>> getAllRecords() { return ResponseEntity.ok(complianceService.getAllRecords()); }

    @GetMapping("/api/compliance/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'COMPLIANCE', 'BOARD', 'REGULATOR')")
    public ResponseEntity<ComplianceRecordDto.Response> getRecord(@PathVariable Long id) { return ResponseEntity.ok(complianceService.getRecord(id)); }

    @PostMapping("/api/compliance")
    @PreAuthorize("hasAnyRole('ADMIN', 'COMPLIANCE')")
    public ResponseEntity<ComplianceRecordDto.Response> createRecord(@RequestBody ComplianceRecordDto.Request request) { return ResponseEntity.ok(complianceService.saveRecord(request)); }

    @PutMapping("/api/compliance/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'COMPLIANCE')")
    public ResponseEntity<ComplianceRecordDto.Response> updateRecord(@PathVariable Long id, @RequestBody ComplianceRecordDto.Request request) {
        return ResponseEntity.ok(complianceService.updateRecord(id, request));
    }

    @DeleteMapping("/api/compliance/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteRecord(@PathVariable Long id) {
        complianceService.deleteRecord(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/api/audits")
    @PreAuthorize("hasAnyRole('ADMIN', 'COMPLIANCE', 'BOARD', 'REGULATOR')")
    public ResponseEntity<List<AuditDto.Response>> getAllAudits() { return ResponseEntity.ok(complianceService.getAllAudits()); }

    @GetMapping("/api/audits/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'COMPLIANCE', 'BOARD', 'REGULATOR')")
    public ResponseEntity<AuditDto.Response> getAudit(@PathVariable Long id) { return ResponseEntity.ok(complianceService.getAudit(id)); }

    @PostMapping("/api/audits")
    @PreAuthorize("hasAnyRole('ADMIN', 'COMPLIANCE')")
    public ResponseEntity<AuditDto.Response> createAudit(@RequestBody AuditDto.Request request) { return ResponseEntity.ok(complianceService.saveAudit(request)); }

    @PutMapping("/api/audits/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'COMPLIANCE')")
    public ResponseEntity<AuditDto.Response> updateAudit(@PathVariable Long id, @RequestBody AuditDto.Request request) {
        return ResponseEntity.ok(complianceService.updateAudit(id, request));
    }

    @DeleteMapping("/api/audits/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteAudit(@PathVariable Long id) {
        complianceService.deleteAudit(id);
        return ResponseEntity.noContent().build();
    }
}
