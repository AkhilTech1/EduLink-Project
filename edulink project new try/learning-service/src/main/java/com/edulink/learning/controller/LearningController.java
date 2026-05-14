package com.edulink.learning.controller;

import com.edulink.learning.dto.AssignmentDto;
import com.edulink.learning.dto.LearningMaterialDto;
import com.edulink.learning.service.LearningService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class LearningController {

    private final LearningService learningService;

    @GetMapping("/api/materials")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT', 'BOARD')")
    public ResponseEntity<List<LearningMaterialDto.Response>> getAllMaterials() { return ResponseEntity.ok(learningService.getAllMaterials()); }

    @GetMapping("/api/materials/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT', 'BOARD')")
    public ResponseEntity<LearningMaterialDto.Response> getMaterial(@PathVariable Long id) { return ResponseEntity.ok(learningService.getMaterial(id)); }

    @PostMapping("/api/materials")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<LearningMaterialDto.Response> createMaterial(@RequestBody LearningMaterialDto.Request request) { return ResponseEntity.ok(learningService.saveMaterial(request)); }

    @PutMapping("/api/materials/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<LearningMaterialDto.Response> updateMaterial(@PathVariable Long id, @RequestBody LearningMaterialDto.Request request) {
        return ResponseEntity.ok(learningService.updateMaterial(id, request));
    }

    @DeleteMapping("/api/materials/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<Void> deleteMaterial(@PathVariable Long id) {
        learningService.deleteMaterial(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/api/assignments")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<List<AssignmentDto.Response>> getAllAssignments() { return ResponseEntity.ok(learningService.getAllAssignments()); }

    @GetMapping("/api/assignments/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<AssignmentDto.Response> getAssignment(@PathVariable Long id) { return ResponseEntity.ok(learningService.getAssignment(id)); }

    @PostMapping("/api/assignments")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<AssignmentDto.Response> createAssignment(@RequestBody AssignmentDto.Request request) { return ResponseEntity.ok(learningService.saveAssignment(request)); }

    @PutMapping("/api/assignments/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<AssignmentDto.Response> updateAssignment(@PathVariable Long id, @RequestBody AssignmentDto.Request request) {
        return ResponseEntity.ok(learningService.updateAssignment(id, request));
    }

    @DeleteMapping("/api/assignments/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<Void> deleteAssignment(@PathVariable Long id) {
        learningService.deleteAssignment(id);
        return ResponseEntity.noContent().build();
    }
}
