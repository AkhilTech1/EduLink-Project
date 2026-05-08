package com.edulink.exam.controller;

import com.edulink.exam.dto.ExamDto;
import com.edulink.exam.dto.GradeDto;
import com.edulink.exam.service.ExamService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class ExamController {

    private final ExamService examService;

    @GetMapping("/api/exams")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT', 'BOARD', 'COMPLIANCE', 'REGULATOR')")
    public ResponseEntity<List<ExamDto.Response>> getAllExams() { return ResponseEntity.ok(examService.getAllExams()); }

    @GetMapping("/api/exams/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT', 'BOARD', 'COMPLIANCE', 'REGULATOR')")
    public ResponseEntity<ExamDto.Response> getExam(@PathVariable Long id) { return ResponseEntity.ok(examService.getExam(id)); }

    @PostMapping("/api/exams")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<ExamDto.Response> createExam(@RequestBody ExamDto.Request request) { return ResponseEntity.ok(examService.saveExam(request)); }

    @PutMapping("/api/exams/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<ExamDto.Response> updateExam(@PathVariable Long id, @RequestBody ExamDto.Request request) {
        return ResponseEntity.ok(examService.updateExam(id, request));
    }

    @DeleteMapping("/api/exams/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteExam(@PathVariable Long id) {
        examService.deleteExam(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/api/grades")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'BOARD', 'COMPLIANCE', 'REGULATOR')")
    public ResponseEntity<List<GradeDto.Response>> getAllGrades() { return ResponseEntity.ok(examService.getAllGrades()); }

    @GetMapping("/api/grades/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'BOARD', 'COMPLIANCE', 'REGULATOR')")
    public ResponseEntity<GradeDto.Response> getGrade(@PathVariable Long id) { return ResponseEntity.ok(examService.getGrade(id)); }

    @PostMapping("/api/grades")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<GradeDto.Response> createGrade(@RequestBody GradeDto.Request request) { return ResponseEntity.ok(examService.saveGrade(request)); }

    @PutMapping("/api/grades/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<GradeDto.Response> updateGrade(@PathVariable Long id, @RequestBody GradeDto.Request request) {
        return ResponseEntity.ok(examService.updateGrade(id, request));
    }

    @GetMapping("/api/grades/student/{studentId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT', 'BOARD')")
    public ResponseEntity<List<GradeDto.Response>> getGradesByStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(examService.getGradesByStudent(studentId));
    }
}
