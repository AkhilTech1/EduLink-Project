package com.edulink.student.service;

import com.edulink.student.dto.EnrollmentDto;
import com.edulink.student.dto.StudentDocumentDto;
import com.edulink.student.dto.StudentDto;
import com.edulink.student.entity.Enrollment;
import com.edulink.student.entity.Student;
import com.edulink.student.entity.StudentDocument;
import com.edulink.student.exception.ResourceNotFoundException;
import com.edulink.student.repository.EnrollmentRepository;
import com.edulink.student.repository.StudentDocumentRepository;
import com.edulink.student.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final StudentRepository studentRepository;
    private final StudentDocumentRepository documentRepository;
    private final EnrollmentRepository enrollmentRepository;

    public List<StudentDto.Response> getAllStudents() {
        return studentRepository.findAll().stream().map(StudentDto.Response::from).toList();
    }

    public StudentDto.Response getStudent(Long id) {
        return StudentDto.Response.from(studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id)));
    }

    public List<StudentDto.Response> findByNameAndContact(String name, String contactInfo) {
        return studentRepository.findByNameAndContactInfo(name, contactInfo)
                .stream().map(StudentDto.Response::from).toList();
    }

    public StudentDto.Response saveStudent(StudentDto.Request request) {
        Student student = Student.builder()
                .name(request.getName())
                .dob(parseDate(request.getDob()))
                .gender(request.getGender())
                .address(request.getAddress())
                .contactInfo(request.getContactInfo())
                .enrollmentDate(parseDate(request.getEnrollmentDate()))
                .status(request.getStatus() != null ? Student.Status.valueOf(request.getStatus()) : Student.Status.ACTIVE)
                .gradeLevel(request.getGradeLevel())
                .build();
        return StudentDto.Response.from(studentRepository.save(student));
    }

    public StudentDto.Response updateStudent(Long id, StudentDto.Request request) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));
        student.setName(request.getName());
        student.setDob(parseDate(request.getDob()));
        student.setGender(request.getGender());
        student.setAddress(request.getAddress());
        student.setContactInfo(request.getContactInfo());
        student.setEnrollmentDate(parseDate(request.getEnrollmentDate()));
        student.setStatus(Student.Status.valueOf(request.getStatus()));
        student.setGradeLevel(request.getGradeLevel());
        return StudentDto.Response.from(studentRepository.save(student));
    }

    public void deleteStudent(Long id) {
        if (!studentRepository.existsById(id))
            throw new ResourceNotFoundException("Student not found with id: " + id);
        enrollmentRepository.deleteAll(enrollmentRepository.findByStudentId(id));
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
                .uploadedDate(parseDate(request.getUploadedDate()))
                .verificationStatus(StudentDocument.VerificationStatus.valueOf(request.getVerificationStatus()))
                .build();
        return StudentDocumentDto.Response.from(documentRepository.save(doc));
    }

    public EnrollmentDto.Response enroll(EnrollmentDto.Request request) {
        enrollmentRepository.findByStudentIdAndCourseId(request.getStudentId(), request.getCourseId())
                .ifPresent(e -> { throw new IllegalArgumentException("Student already enrolled in this course"); });
        Enrollment e = Enrollment.builder()
                .studentId(request.getStudentId())
                .courseId(request.getCourseId())
                .classId(request.getClassId())
                .teacherId(request.getTeacherId())
                .status(Enrollment.Status.ACTIVE)
                .build();
        return EnrollmentDto.Response.from(enrollmentRepository.save(e));
    }

    public void unenroll(Long enrollmentId) {
        if (!enrollmentRepository.existsById(enrollmentId))
            throw new ResourceNotFoundException("Enrollment not found with id: " + enrollmentId);
        enrollmentRepository.deleteById(enrollmentId);
    }

    public List<EnrollmentDto.Response> getEnrollmentsByStudent(Long studentId) {
        return enrollmentRepository.findByStudentId(studentId).stream().map(EnrollmentDto.Response::from).toList();
    }

    public List<EnrollmentDto.Response> getEnrollmentsByCourse(Long courseId) {
        return enrollmentRepository.findByCourseId(courseId).stream().map(EnrollmentDto.Response::from).toList();
    }

    public List<EnrollmentDto.Response> getEnrollmentsByTeacher(Long teacherId) {
        return enrollmentRepository.findByTeacherId(teacherId).stream().map(EnrollmentDto.Response::from).toList();
    }

    public List<EnrollmentDto.Response> getAllEnrollments() {
        return enrollmentRepository.findAll().stream().map(EnrollmentDto.Response::from).toList();
    }

    private LocalDate parseDate(String date) {
        if (date == null || date.isBlank()) return null;
        try { return LocalDate.parse(date); } catch (Exception e) { return null; }
    }
}
