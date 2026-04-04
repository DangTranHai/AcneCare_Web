package com.acnecare.acnecare_app_api.acnePrediction.mapper;

import com.acnecare.acnecare_app_api.acnePrediction.dto.response.AcneResponse;
import com.acnecare.acnecare_app_api.acnePrediction.entity.Acne;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface AcneMapper {
    AcneResponse toAcneResponse(Acne acne);
    List<AcneResponse> toAcneResponseList(List<Acne> acnes);
}
