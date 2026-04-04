package com.acnecare.acnecare_app_api.acnePrediction.repository;

import com.acnecare.acnecare_app_api.acnePrediction.entity.AcnePrediction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AcnePredictionRepository extends JpaRepository<AcnePrediction, String> {
    List<AcnePrediction> findByPatientIdOrderByCreatedAtDesc(String patientId);
}
