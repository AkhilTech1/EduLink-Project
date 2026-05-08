package com.edulink.learning.seeder;

import com.edulink.learning.entity.Assignment;
import com.edulink.learning.entity.LearningMaterial;
import com.edulink.learning.repository.AssignmentRepository;
import com.edulink.learning.repository.LearningMaterialRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final LearningMaterialRepository materialRepository;
    private final AssignmentRepository assignmentRepository;

    @Override
    public void run(String... args) {
        if (materialRepository.count() > 0) return;

        materialRepository.save(LearningMaterial.builder().courseId(1L).title("Math Chapter 1 - Algebra")
                .fileUri("/materials/math_ch1.pdf").uploadedDate(LocalDate.now()).status(LearningMaterial.Status.ACTIVE).build());

        materialRepository.save(LearningMaterial.builder().courseId(2L).title("Science Chapter 1 - Physics")
                .fileUri("/materials/science_ch1.pdf").uploadedDate(LocalDate.now()).status(LearningMaterial.Status.ACTIVE).build());

        assignmentRepository.save(Assignment.builder().courseId(1L).studentId(1L).title("Algebra Homework 1")
                .submissionDate(LocalDate.now().plusDays(7)).status(Assignment.Status.PENDING).build());

        assignmentRepository.save(Assignment.builder().courseId(2L).studentId(2L).title("Physics Lab Report")
                .submissionDate(LocalDate.now().plusDays(5)).status(Assignment.Status.PENDING).build());

        System.out.println("Learning seeder: 2 materials and 2 assignments created.");
    }
}
