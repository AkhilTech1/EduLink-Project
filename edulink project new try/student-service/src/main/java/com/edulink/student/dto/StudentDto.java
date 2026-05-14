package com.edulink.student.dto;

import com.edulink.student.entity.Student;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;

public class StudentDto {

    @Data
    public static class Request {
        private String name;
        private String dob;
        private String gender;
        private String address;
        private String contactInfo;
        private String enrollmentDate;
        private String status;
        private String gradeLevel;
    }

    @Data
    @Builder
    public static class Response {
        private Long studentId;
        private String name;
        private String dob;
        private String gender;
        private String address;
        private String contactInfo;
        private String enrollmentDate;
        private String status;
        private String gradeLevel;

        public static Response from(Student s) {
            return Response.builder()
                    .studentId(s.getStudentId())
                    .name(s.getName())
                    .dob(s.getDob() != null ? s.getDob().toString() : null)
                    .gender(s.getGender())
                    .address(s.getAddress())
                    .contactInfo(s.getContactInfo())
                    .enrollmentDate(s.getEnrollmentDate() != null ? s.getEnrollmentDate().toString() : null)
                    .status(s.getStatus().name())
                    .gradeLevel(s.getGradeLevel())
                    .build();
        }
    }
}
