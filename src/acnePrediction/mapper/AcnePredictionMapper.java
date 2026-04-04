package com.acnecare.acnecare_app_api.acnePrediction.mapper;

import com.acnecare.acnecare_app_api.acnePrediction.dto.request.AcnePredictionCreationRequest;
import com.acnecare.acnecare_app_api.acnePrediction.dto.response.AcnePredictionResponse;
import com.acnecare.acnecare_app_api.acnePrediction.entity.AcnePrediction;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", unmappedTargetPolicy = org.mapstruct.ReportingPolicy.IGNORE)
public interface AcnePredictionMapper {

    @Mapping(target = "details", ignore = true)
    AcnePrediction toAcnePrediction(AcnePredictionCreationRequest request);

    @Mapping(source = "patient.id", target = "patientId")
    AcnePredictionResponse toAcnePredictionResponse(AcnePrediction acnePrediction);
}
