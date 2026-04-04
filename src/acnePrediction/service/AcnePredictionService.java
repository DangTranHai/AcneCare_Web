package com.acnecare.acnecare_app_api.acnePrediction.service;

import com.acnecare.acnecare_app_api.acnePrediction.entity.Acne;
import com.acnecare.acnecare_app_api.acnePrediction.repository.AcneRepository;
import com.acnecare.acnecare_app_api.common.exception.AppException;
import com.acnecare.acnecare_app_api.common.exception.ErrorCode;
import com.acnecare.acnecare_app_api.acnePrediction.dto.request.AcnePredictionCreationRequest;
import com.acnecare.acnecare_app_api.acnePrediction.dto.response.AcnePredictionResponse;
import com.acnecare.acnecare_app_api.acnePrediction.entity.AcnePrediction;
import com.acnecare.acnecare_app_api.acnePrediction.entity.AcnePredictionDetail;
import com.acnecare.acnecare_app_api.acnePrediction.mapper.AcnePredictionMapper;
import com.acnecare.acnecare_app_api.acnePrediction.repository.AcnePredictionRepository;
import com.acnecare.acnecare_app_api.identity.entity.User;
import com.acnecare.acnecare_app_api.identity.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AcnePredictionService {

    AcnePredictionRepository acnePredictionRepository;
    UserRepository userRepository;
    AcneRepository acneRepository;
    AcnePredictionMapper acnePredictionMapper;

    @Transactional
    @PreAuthorize("hasAnyAuthority('ROLE_PATIENT', 'ROLE_ADMIN')")
    public AcnePredictionResponse createAcnePrediction(AcnePredictionCreationRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String currentUserId = auth.getName();

        User currentUser = userRepository.findById(currentUserId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        AcnePrediction prediction = acnePredictionMapper.toAcnePrediction(request);
        prediction.setCreatedAt(LocalDateTime.now());
        
        // No doctor logic anymore: always associates with the current patient user
        prediction.setPatient(currentUser);
        prediction.setSeverityLevel("Tu dong");

        List<AcnePredictionDetail> details = new ArrayList<>();
        if (request.getDetails() != null) {
            for (var detailReq : request.getDetails()) {
                Acne acne = acneRepository.findByCodeName(detailReq.getClassName())
                        .orElseGet(() -> acneRepository.save(
                                Acne.builder()
                                        .codeName(detailReq.getClassName())
                                        .name(translateToVn(detailReq.getClassName()))
                                        .createdAt(LocalDateTime.now())
                                        .build()));

                details.add(AcnePredictionDetail.builder()
                        .acnePrediction(prediction)
                        .acne(acne)
                        .count(detailReq.getCount())
                        .build());
            }
        }
        prediction.setDetails(details);

        AcnePrediction savedPrediction = acnePredictionRepository.save(prediction);
        return acnePredictionMapper.toAcnePredictionResponse(savedPrediction);
    }

    @PreAuthorize("hasAnyAuthority('ROLE_PATIENT', 'ROLE_ADMIN')")
    public List<AcnePredictionResponse> getPatientScanHistory(String patientId) {
        return acnePredictionRepository.findByPatientIdOrderByCreatedAtDesc(patientId)
                .stream()
                .map(acnePredictionMapper::toAcnePredictionResponse)
                .toList();
    }

    @Transactional
    @PreAuthorize("hasAnyAuthority('ROLE_PATIENT', 'ROLE_ADMIN')")
    public void deletePrediction(String predictionId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String currentUserId = auth.getName();

        User currentUser = userRepository.findById(currentUserId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        AcnePrediction prediction = acnePredictionRepository.findById(predictionId)
                .orElseThrow(() -> new AppException(ErrorCode.ACNE_PREDICTION_NOT_FOUND));

        boolean isAdmin = currentUser.getRoles().stream()
                .anyMatch(r -> r.getName().equals("ADMIN") || r.getName().equals("ROLE_ADMIN"));

        boolean isOwner = prediction.getPatient() != null
                && currentUserId.equals(prediction.getPatient().getId());

        if (!isAdmin && !isOwner) {
            throw new AppException(ErrorCode.ACCESS_DENIED);
        }

        acnePredictionRepository.delete(prediction);
    }

    private String translateToVn(String className) {
        return switch (className.toLowerCase().trim()) {
            case "dark spot" -> "Vết thâm";
            case "blackheads" -> "Mụn đầu đen";
            case "whiteheads" -> "Mụn đầu trắng";
            case "nodules" -> "Mụn bọc";
            case "papules" -> "Mụn sẩn";
            case "pustules" -> "Mụn mủ";
            default -> className;
        };
    }
}
