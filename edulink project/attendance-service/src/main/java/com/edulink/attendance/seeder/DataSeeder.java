package com.edulink.attendance.seeder;

import com.edulink.attendance.entity.Attendance;
import com.edulink.attendance.entity.PerformanceMetric;
import com.edulink.attendance.repository.AttendanceRepository;
import com.edulink.attendance.repository.PerformanceMetricRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final AttendanceRepository attendanceRepository;
    private final PerformanceMetricRepository performanceMetricRepository;

    @Override
    public void run(String... args) {
        if (attendanceRepository.count() > 0) return;

        attendanceRepository.save(Attendance.builder().studentId(1L).classId(1L)
                .date(LocalDate.now()).status(Attendance.Status.PRESENT).build());

        attendanceRepository.save(Attendance.builder().studentId(2L).classId(1L)
                .date(LocalDate.now()).status(Attendance.Status.PRESENT).build());

        performanceMetricRepository.save(PerformanceMetric.builder().studentId(1L).courseId(1L)
                .score(88.5).date(LocalDate.now()).status(PerformanceMetric.Status.ACTIVE).build());

        performanceMetricRepository.save(PerformanceMetric.builder().studentId(2L).courseId(1L)
                .score(91.0).date(LocalDate.now()).status(PerformanceMetric.Status.ACTIVE).build());

        System.out.println("Attendance seeder: 2 attendance records and 2 performance metrics created.");
    }
}
