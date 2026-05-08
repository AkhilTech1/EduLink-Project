package com.edulink.reporting.seeder;

import com.edulink.reporting.entity.Report;
import com.edulink.reporting.repository.ReportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final ReportRepository reportRepository;

    @Override
    public void run(String... args) {
        if (reportRepository.count() > 0) return;

        reportRepository.save(Report.builder().scope(Report.ReportScope.STUDENT)
                .metrics("{\"totalStudents\":2,\"activeStudents\":2}")
                .generatedDate(LocalDate.now()).build());

        reportRepository.save(Report.builder().scope(Report.ReportScope.EXAM)
                .metrics("{\"totalExams\":2,\"passRate\":100}")
                .generatedDate(LocalDate.now()).build());

        reportRepository.save(Report.builder().scope(Report.ReportScope.ATTENDANCE)
                .metrics("{\"averageAttendance\":95.5}")
                .generatedDate(LocalDate.now()).build());

        System.out.println("Reporting seeder: 3 reports created.");
    }
}
