package com.acnecare.acnecare_app_api.acnePrediction.repository;

import com.acnecare.acnecare_app_api.acnePrediction.entity.Acne;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AcneRepository extends JpaRepository<Acne, String> {
    Optional<Acne> findByCodeName(String codeName);
}
