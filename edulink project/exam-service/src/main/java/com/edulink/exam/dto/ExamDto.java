package com.edulink.exam.dto;

import com.edulink.exam.entity.Exam;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;

public class ExamDto {

    @Data
    public static class Request {
        private Long courseId;
        private String type;
        private LocalDate date;
        private String status;
    }

    @Data
    @Builder
    public static class Response {
        private Long examId;
        private Long courseId;
        private String type;
        private LocalDate date;
        private String status;

        public static Response from(Exam e) {
            return Response.builder()
                    .examId(e.getExamId())
                    .courseId(e.getCourseId())
                    .type(e.getType().name())
                    .date(e.getDate())
                    .status(e.getStatus().name())
                    .build();
        }
    }
}
