package com.acnecare.acnecare_app_api.acnePrediction.entity;

import com.acnecare.acnecare_app_api.identity.entity.User;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "acne_predictions")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AcnePrediction {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    String severityLevel;

    @Column(columnDefinition = "TEXT")
    String note;

    @Column(columnDefinition = "LONGTEXT")
    String imageBase64;

    @Column(nullable = false)
    LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    User patient;

    @OneToMany(mappedBy = "acnePrediction", cascade = CascadeType.ALL)
    List<AcnePredictionDetail> details;
}
