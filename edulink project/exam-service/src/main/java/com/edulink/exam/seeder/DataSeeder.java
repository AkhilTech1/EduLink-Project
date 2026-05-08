package com.edulink.exam.seeder;

import com.edulink.exam.entity.Exam;
import com.edulink.exam.entity.Grade;
import com.edulink.exam.repository.ExamRepository;
import com.edulink.exam.repository.GradeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final ExamRepository examRepository;
    private final GradeRepository gradeRepository;

    @Override
    public void run(String... args) {
        if (examRepository.count() > 0) return;

        Exam midterm = examRepository.save(Exam.builder().courseId(1L).type(Exam.ExamType.MIDTERM)
                .date(LocalDate.now().plusDays(30)).status(Exam.Status.SCHEDULED).build());

        Exam finalExam = examRepository.save(Exam.builder().courseId(1L).type(Exam.ExamType.FINAL)
                .date(LocalDate.now().plusDays(90)).status(Exam.Status.SCHEDULED).build());

        gradeRepository.save(Grade.builder().examId(midterm.getExamId()).studentId(1L)
                .score(85.5).grade("B+").status(Grade.Status.PUBLISHED).build());

        gradeRepository.save(Grade.builder().examId(midterm.getExamId()).studentId(2L)
                .score(92.0).grade("A").status(Grade.Status.PUBLISHED).build());

        System.out.println("Exam seeder: 2 exams and 2 grades created.");
    }
}
