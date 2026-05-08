package com.edulink.student.controller;

import com.edulink.student.dto.StudentDocumentDto;
import com.edulink.student.dto.StudentDto;
import com.edulink.student.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
public class StudentController {

    private final StudentService studentService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'BOARD', 'COMPLIANCE', 'REGULATOR')")
    public ResponseEntity<List<StudentDto.Response>> getAll() { return ResponseEntity.ok(studentService.getAllStudents()); }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT', 'BOARD', 'COMPLIANCE', 'REGULATOR')")
    public ResponseEntity<StudentDto.Response> getById(@PathVariable Long id) { return ResponseEntity.ok(studentService.getStudent(id)); }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<StudentDto.Response> create(@RequestBody StudentDto.Request request) { return ResponseEntity.ok(studentService.saveStudent(request)); }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<StudentDto.Response> update(@PathVariable Long id, @RequestBody StudentDto.Request request) {
        return ResponseEntity.ok(studentService.updateStudent(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        studentService.deleteStudent(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/documents")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'COMPLIANCE')")
    public ResponseEntity<List<StudentDocumentDto.Response>> getDocuments(@PathVariable Long id) {
        return ResponseEntity.ok(studentService.getDocuments(id));
    }

    @PostMapping("/{id}/documents")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<StudentDocumentDto.Response> addDocument(@PathVariable Long id, @RequestBody StudentDocumentDto.Request request) {
        return ResponseEntity.ok(studentService.saveDocument(id, request));
    }
}
