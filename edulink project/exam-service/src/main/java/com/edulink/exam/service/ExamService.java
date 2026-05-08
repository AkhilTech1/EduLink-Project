package com.edulink.exam.service;

import com.edulink.exam.dto.ExamDto;
import com.edulink.exam.dto.GradeDto;
import com.edulink.exam.entity.Exam;
import com.edulink.exam.entity.Grade;
import com.edulink.exam.exception.ResourceNotFoundException;
import com.edulink.exam.repository.ExamRepository;
import com.edulink.exam.repository.GradeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ExamService {

    private final ExamRepository examRepository;
    private final GradeRepository gradeRepository;

    public List<ExamDto.Response> getAllExams() {
        return examRepository.findAll().stream().map(ExamDto.Response::from).toList();
    }

    public ExamDto.Response getExam(Long id) {
        return ExamDto.Response.from(examRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Exam not found with id: " + id)));
    }

    public ExamDto.Response saveExam(ExamDto.Request request) {
        Exam exam = Exam.builder()
                .courseId(request.getCourseId())
                .type(Exam.ExamType.valueOf(request.getType()))
                .date(request.getDate())
                .status(Exam.Status.valueOf(request.getStatus()))
                .build();
        return ExamDto.Response.from(examRepository.save(exam));
    }

    public ExamDto.Response updateExam(Long id, ExamDto.Request request) {
        Exam exam = examRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Exam not found with id: " + id));
        exam.setCourseId(request.getCourseId());
        exam.setType(Exam.ExamType.valueOf(request.getType()));
        exam.setDate(request.getDate());
        exam.setStatus(Exam.Status.valueOf(request.getStatus()));
        return ExamDto.Response.from(examRepository.save(exam));
    }

    public void deleteExam(Long id) {
        if (!examRepository.existsById(id))
            throw new ResourceNotFoundException("Exam not found with id: " + id);
        examRepository.deleteById(id);
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
                .examId(request.getExamId())
                .studentId(request.getStudentId())
                .score(request.getScore())
                .grade(request.getGrade())
                .status(Grade.Status.valueOf(request.getStatus()))
                .build();
        return GradeDto.Response.from(gradeRepository.save(grade));
    }

    public GradeDto.Response updateGrade(Long id, GradeDto.Request request) {
        Grade grade = gradeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Grade not found with id: " + id));
        grade.setExamId(request.getExamId());
        grade.setStudentId(request.getStudentId());
        grade.setScore(request.getScore());
        grade.setGrade(request.getGrade());
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
