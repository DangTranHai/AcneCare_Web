package com.acnecare.acnecare_app_api.acnePrediction.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "acne_prediction_details")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AcnePredictionDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "prediction_id", nullable = false)
    AcnePrediction acnePrediction;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "acne_id", nullable = false)
    Acne acne;

    int count;
}
