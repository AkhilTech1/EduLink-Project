package com.edulink.student.seeder;

import com.edulink.student.entity.Student;
import com.edulink.student.entity.StudentDocument;
import com.edulink.student.repository.StudentDocumentRepository;
import com.edulink.student.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final StudentRepository studentRepository;
    private final StudentDocumentRepository documentRepository;

    @Override
    public void run(String... args) {
        if (studentRepository.count() > 0) return;

        Student s1 = studentRepository.save(Student.builder()
                .name("Alice Johnson").dob(LocalDate.of(2005, 3, 15))
                .gender("Female").address("123 Main St").contactInfo("alice@email.com")
                .enrollmentDate(LocalDate.now()).status(Student.Status.ACTIVE).build());

        Student s2 = studentRepository.save(Student.builder()
                .name("Bob Smith").dob(LocalDate.of(2006, 7, 22))
                .gender("Male").address("456 Oak Ave").contactInfo("bob@email.com")
                .enrollmentDate(LocalDate.now()).status(Student.Status.ACTIVE).build());

        documentRepository.save(StudentDocument.builder()
                .studentId(s1.getStudentId()).docType(StudentDocument.DocType.ID_PROOF)
                .fileUri("/docs/alice_id.pdf").uploadedDate(LocalDate.now())
                .verificationStatus(StudentDocument.VerificationStatus.VERIFIED).build());

        documentRepository.save(StudentDocument.builder()
                .studentId(s2.getStudentId()).docType(StudentDocument.DocType.REPORT_CARD)
                .fileUri("/docs/bob_report.pdf").uploadedDate(LocalDate.now())
                .verificationStatus(StudentDocument.VerificationStatus.PENDING).build());

        System.out.println("Student seeder: 2 students and 2 documents created.");
    }
}
