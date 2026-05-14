package com.edulink.compliance.dto;

import com.edulink.compliance.entity.Audit;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;

public class AuditDto {

    @Data
    public static class Request {
        private Long officerId;
        private String scope;
        private String findings;
        private LocalDate date;
        private String status;
    }

    @Data
    @Builder
    public static class Response {
        private Long auditId;
        private Long officerId;
        private String scope;
        private String findings;
        private LocalDate date;
        private String status;

        public static Response from(Audit a) {
            return Response.builder()
                    .auditId(a.getAuditId())
                    .officerId(a.getOfficerId())
                    .scope(a.getScope())
                    .findings(a.getFindings())
                    .date(a.getDate())
                    .status(a.getStatus().name())
                    .build();
        }
    }
}
