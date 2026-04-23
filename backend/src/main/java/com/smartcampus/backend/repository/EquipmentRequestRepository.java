package com.smartcampus.backend.repository;

import com.smartcampus.backend.model.EquipmentRequest;
import com.smartcampus.backend.model.EquipmentRequestStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EquipmentRequestRepository extends MongoRepository<EquipmentRequest, String> {

    /** All requests made by a specific user. */
    List<EquipmentRequest> findByUserId(String userId);

    /** All requests with a given status (e.g. PENDING for admin review). */
    List<EquipmentRequest> findByStatus(EquipmentRequestStatus status);

    /** Used to detect time overlaps before approving a new request. */
    List<EquipmentRequest> findByResourceIdAndStatusAndStartTimeLessThanAndEndTimeGreaterThan(
            String resourceId,
            EquipmentRequestStatus status,
            LocalDateTime endTime,
            LocalDateTime startTime);

    /** Check if a user already has any non-rejected request for a resource. */
    List<EquipmentRequest> findByResourceIdAndUserId(String resourceId, String userId);
}
