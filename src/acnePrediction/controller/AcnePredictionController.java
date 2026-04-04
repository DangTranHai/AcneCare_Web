package com.acnecare.acnecare_app_api.acnePrediction.controller;

import com.acnecare.acnecare_app_api.acnePrediction.dto.request.AcnePredictionCreationRequest;
import com.acnecare.acnecare_app_api.acnePrediction.dto.response.AcnePredictionResponse;
import com.acnecare.acnecare_app_api.acnePrediction.dto.response.AcneResponse;
import com.acnecare.acnecare_app_api.acnePrediction.service.AcnePredictionService;
import com.acnecare.acnecare_app_api.acnePrediction.service.AcneService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/acne-predictions")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AcnePredictionController {

    AcnePredictionService acnePredictionService;
    AcneService acneService;

    @PostMapping
    public ResponseEntity<AcnePredictionResponse> createAcnePrediction(
            @RequestBody AcnePredictionCreationRequest request) {
        return ResponseEntity.ok(acnePredictionService.createAcnePrediction(request));
    }

    @GetMapping("/history/{patientId}")
    public ResponseEntity<List<AcnePredictionResponse>> getPatientScanHistory(@PathVariable String patientId) {
        return ResponseEntity.ok(acnePredictionService.getPatientScanHistory(patientId));
    }

    @DeleteMapping("/{predictionId}")
    public ResponseEntity<Void> deletePrediction(@PathVariable String predictionId) {
        acnePredictionService.deletePrediction(predictionId);
        return ResponseEntity.noContent().build();
    }

    // Endpoints for Acne definitions (these can be moved to AcneController if
    // preferred, but doing here for simplicity)
    @GetMapping("/acnes")
    public ResponseEntity<List<AcneResponse>> getAllAcnes() {
        return ResponseEntity.ok(acneService.getAllAcnes());
    }

    @GetMapping("/acnes/{id}")
    public ResponseEntity<AcneResponse> getAcneById(@PathVariable String id) {
        return ResponseEntity.ok(acneService.getAcneById(id));
    }
}
