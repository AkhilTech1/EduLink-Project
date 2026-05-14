package com.edulink.exam.service;

import com.edulink.exam.dto.ExamDto;
import com.edulink.exam.dto.GradeDto;
import com.edulink.exam.entity.Exam;
import com.edulink.exam.entity.ExamEnrollment;
import com.edulink.exam.entity.Grade;
import com.edulink.exam.exception.ResourceNotFoundException;
import com.edulink.exam.repository.ExamEnrollmentRepository;
import com.edulink.exam.repository.ExamRepository;
import com.edulink.exam.repository.GradeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ExamService {

    private final ExamRepository examRepository;
    private final GradeRepository gradeRepository;
    private final ExamEnrollmentRepository examEnrollmentRepository;

    public List<ExamDto.Response> getAllExams() {
        return examRepository.findAll().stream().map(ExamDto.Response::from).toList();
    }

    public List<ExamDto.Response> getExamsByStudent(Long studentId) {
        List<Long> examIds = examEnrollmentRepository.findByStudentId(studentId)
                .stream().map(ExamEnrollment::getExamId).toList();
        return examRepository.findAll().stream()
                .filter(e -> examIds.contains(e.getExamId()))
                .map(ExamDto.Response::from).toList();
    }

    public ExamDto.Response getExam(Long id) {
        return ExamDto.Response.from(examRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Exam not found with id: " + id)));
    }

    public ExamDto.Response saveExam(ExamDto.Request request) {
        Exam exam = Exam.builder()
                .courseId(request.getCourseId())
                .gradeLevel(request.getGradeLevel())
                .type(Exam.ExamType.valueOf(request.getType() != null ? request.getType() : "QUIZ"))
                .date(parseDate(request.getDate()))
                .status(Exam.Status.valueOf(request.getStatus() != null ? request.getStatus() : "SCHEDULED"))
                .questions(request.getQuestions())
                .build();
        return ExamDto.Response.from(examRepository.save(exam));
    }

    public ExamDto.Response updateExam(Long id, ExamDto.Request request) {
        Exam exam = examRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Exam not found with id: " + id));
        if (request.getCourseId() != null) exam.setCourseId(request.getCourseId());
        if (request.getGradeLevel() != null) exam.setGradeLevel(request.getGradeLevel());
        if (request.getType() != null) exam.setType(Exam.ExamType.valueOf(request.getType()));
        if (request.getDate() != null) exam.setDate(parseDate(request.getDate()));
        if (request.getStatus() != null) exam.setStatus(Exam.Status.valueOf(request.getStatus()));
        if (request.getQuestions() != null) exam.setQuestions(request.getQuestions());
        return ExamDto.Response.from(examRepository.save(exam));
    }

    public List<ExamDto.Response> getExamsByGrade(String gradeLevel) {
        return examRepository.findByGradeLevel(gradeLevel).stream().map(ExamDto.Response::from).toList();
    }

    private java.time.LocalDate parseDate(String date) {
        if (date == null || date.isBlank()) return java.time.LocalDate.now();
        try { return java.time.LocalDate.parse(date); } catch (Exception e) { return java.time.LocalDate.now(); }
    }

    public void deleteExam(Long id) {
        if (!examRepository.existsById(id))
            throw new ResourceNotFoundException("Exam not found with id: " + id);
        examEnrollmentRepository.deleteAll(examEnrollmentRepository.findByExamId(id));
        examRepository.deleteById(id);
    }

    public Map<String, Object> enrollStudentInExam(Long examId, Long studentId) {
        examEnrollmentRepository.findByExamIdAndStudentId(examId, studentId)
                .ifPresent(e -> { throw new IllegalArgumentException("Student already enrolled in this exam"); });
        ExamEnrollment e = ExamEnrollment.builder()
                .examId(examId).studentId(studentId).status(ExamEnrollment.Status.ENROLLED).build();
        examEnrollmentRepository.save(e);
        return Map.of("message", "Student enrolled in exam successfully", "examId", examId, "studentId", studentId);
    }

    public void unenrollStudentFromExam(Long examId, Long studentId) {
        examEnrollmentRepository.findByExamIdAndStudentId(examId, studentId)
                .ifPresent(examEnrollmentRepository::delete);
    }

    public List<Map<String, Object>> getStudentsForExam(Long examId) {
        return examEnrollmentRepository.findByExamId(examId).stream()
                .map(e -> Map.<String, Object>of("studentId", e.getStudentId(), "status", e.getStatus().name()))
                .toList();
    }

    public List<GradeDto.Response> getAllGrades() {
        return gradeRepository.findAll().stream().map(GradeDto.Response::from).toList();
    }

    public GradeDto.Response getGrade(Long id) {
        return GradeDto.Response.from(gradeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Grade not found with id: " + id)));
    }

    public GradeDto.Response saveGrade(GradeDto.Request request) {
        Grade grade = Grade.builder()
                .examId(request.getExamId()).studentId(request.getStudentId())
                .score(request.getScore()).grade(request.getGrade())
                .status(Grade.Status.valueOf(request.getStatus())).build();
        return GradeDto.Response.from(gradeRepository.save(grade));
    }

    public GradeDto.Response updateGrade(Long id, GradeDto.Request request) {
        Grade grade = gradeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Grade not found with id: " + id));
        grade.setExamId(request.getExamId()); grade.setStudentId(request.getStudentId());
        grade.setScore(request.getScore()); grade.setGrade(request.getGrade());
        grade.setStatus(Grade.Status.valueOf(request.getStatus()));
        return GradeDto.Response.from(gradeRepository.save(grade));
    }

    public void deleteGrade(Long id) {
        if (!gradeRepository.existsById(id))
            throw new ResourceNotFoundException("Grade not found with id: " + id);
        gradeRepository.deleteById(id);
    }

    public List<GradeDto.Response> getGradesByStudent(Long studentId) {
        return gradeRepository.findByStudentId(studentId).stream().map(GradeDto.Response::from).toList();
    }
}
