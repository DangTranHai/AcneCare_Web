package com.acnecare.acnecare_app_api.acnePrediction.service;

import org.springframework.stereotype.Service;
import com.acnecare.acnecare_app_api.acnePrediction.repository.AcneRepository;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.AccessLevel;
import lombok.extern.slf4j.Slf4j;
import com.acnecare.acnecare_app_api.acnePrediction.dto.response.AcneResponse;
import com.acnecare.acnecare_app_api.acnePrediction.entity.Acne;
import com.acnecare.acnecare_app_api.common.exception.AppException;
import com.acnecare.acnecare_app_api.common.exception.ErrorCode;
import com.acnecare.acnecare_app_api.acnePrediction.mapper.AcneMapper;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class AcneService {
    AcneRepository acneRepository; 
    AcneMapper acneMapper;
    
    public AcneResponse getAcneById(String id) {
        Acne acne = acneRepository.findById(id)
            .orElseThrow(() -> new AppException(ErrorCode.ACNE_NOT_FOUND)); // Assuming ACNE_NOT_FOUND exists
        return acneMapper.toAcneResponse(acne);
    }

    public List<AcneResponse> getAllAcnes() {
        List<Acne> acnes = acneRepository.findAll();
        return acneMapper.toAcneResponseList(acnes);
    }
}
