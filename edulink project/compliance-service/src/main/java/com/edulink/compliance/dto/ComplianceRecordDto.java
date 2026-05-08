package com.edulink.compliance.dto;

import com.edulink.compliance.entity.ComplianceRecord;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;

public class ComplianceRecordDto {

    @Data
    public static class Request {
        private Long entityId;
        private String type;
        private String result;
        private LocalDate date;
        private String notes;
    }

    @Data
    @Builder
    public static class Response {
        private Long complianceId;
        private Long entityId;
        private String type;
        private String result;
        private LocalDate date;
        private String notes;

        public static Response from(ComplianceRecord r) {
            return Response.builder()
                    .complianceId(r.getComplianceId())
                    .entityId(r.getEntityId())
                    .type(r.getType().name())
                    .result(r.getResult())
                    .date(r.getDate())
                    .notes(r.getNotes())
                    .build();
        }
    }
}
