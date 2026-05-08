package com.edulink.student.dto;

import com.edulink.student.entity.Student;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;

public class StudentDto {

    @Data
    public static class Request {
        private String name;
        private LocalDate dob;
        private String gender;
        private String address;
        private String contactInfo;
        private LocalDate enrollmentDate;
        private String status;
    }

    @Data
    @Builder
    public static class Response {
        private Long studentId;
        private String name;
        private LocalDate dob;
        private String gender;
        private String address;
        private String contactInfo;
        private LocalDate enrollmentDate;
        private String status;

        public static Response from(Student s) {
            return Response.builder()
                    .studentId(s.getStudentId())
                    .name(s.getName())
                    .dob(s.getDob())
                    .gender(s.getGender())
                    .address(s.getAddress())
                    .contactInfo(s.getContactInfo())
                    .enrollmentDate(s.getEnrollmentDate())
                    .status(s.getStatus().name())
                    .build();
        }
    }
}
