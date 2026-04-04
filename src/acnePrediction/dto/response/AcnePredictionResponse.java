package com.acnecare.acnecare_app_api.acnePrediction.dto.response;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AcnePredictionResponse {
    String id;
    String severityLevel;
    String note;
    String imageBase64;
    LocalDateTime createdAt;
    String patientId;
    List<AcnePredictionDetailResponse> details;
}
