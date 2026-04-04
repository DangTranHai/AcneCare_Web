package com.acnecare.acnecare_app_api.acnePrediction.dto.request;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AcnePredictionCreationRequest {
    String note;
    String imageBase64;
    List<AcnePredictionDetailCreationRequest> details;
}
