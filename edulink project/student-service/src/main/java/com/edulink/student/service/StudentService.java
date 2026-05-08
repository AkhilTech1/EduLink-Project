package com.edulink.student.service;

import com.edulink.student.dto.StudentDocumentDto;
import com.edulink.student.dto.StudentDto;
import com.edulink.student.entity.Student;
import com.edulink.student.entity.StudentDocument;
import com.edulink.student.exception.ResourceNotFoundException;
import com.edulink.student.repository.StudentDocumentRepository;
import com.edulink.student.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final StudentRepository studentRepository;
    private final StudentDocumentRepository documentRepository;

    public List<StudentDto.Response> getAllStudents() {
        return studentRepository.findAll().stream().map(StudentDto.Response::from).toList();
    }

    public StudentDto.Response getStudent(Long id) {
        return StudentDto.Response.from(studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id)));
    }

    public StudentDto.Response saveStudent(StudentDto.Request request) {
        Student student = Student.builder()
                .name(request.getName())
                .dob(request.getDob())
                .gender(request.getGender())
                .address(request.getAddress())
                .contactInfo(request.getContactInfo())
                .enrollmentDate(request.getEnrollmentDate())
                .status(Student.Status.valueOf(request.getStatus()))
                .build();
        return StudentDto.Response.from(studentRepository.save(student));
    }

    public StudentDto.Response updateStudent(Long id, StudentDto.Request request) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));
        student.setName(request.getName());
        student.setDob(request.getDob());
        student.setGender(request.getGender());
        student.setAddress(request.getAddress());
        student.setContactInfo(request.getContactInfo());
        student.setEnrollmentDate(request.getEnrollmentDate());
        student.setStatus(Student.Status.valueOf(request.getStatus()));
        return StudentDto.Response.from(studentRepository.save(student));
    }

    public void deleteStudent(Long id) {
        if (!studentRepository.existsById(id))
            throw new ResourceNotFoundException("Student not found with id: " + id);
        studentRepository.deleteById(id);
    }

    public List<StudentDocumentDto.Response> getDocuments(Long studentId) {
        if (!studentRepository.existsById(studentId))
            throw new ResourceNotFoundException("Student not found with id: " + studentId);
        return documentRepository.findByStudentId(studentId).stream().map(StudentDocumentDto.Response::from).toList();
    }

    public StudentDocumentDto.Response saveDocument(Long studentId, StudentDocumentDto.Request request) {
        if (!studentRepository.existsById(studentId))
            throw new ResourceNotFoundException("Student not found with id: " + studentId);
        StudentDocument doc = StudentDocument.builder()
                .studentId(studentId)
                .docType(StudentDocument.DocType.valueOf(request.getDocType()))
                .fileUri(request.getFileUri())
                .uploadedDate(request.getUploadedDate())
                .verificationStatus(StudentDocument.VerificationStatus.valueOf(request.getVerificationStatus()))
                .build();
        return StudentDocumentDto.Response.from(documentRepository.save(doc));
    }
}
