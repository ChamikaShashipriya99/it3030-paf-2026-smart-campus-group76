package com.smartcampus.backend.service;

import com.smartcampus.backend.model.*;
import com.smartcampus.backend.repository.BookingRepository;
import com.smartcampus.backend.repository.EquipmentRequestRepository;
import com.smartcampus.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class EquipmentRequestService {

    @Autowired
    private EquipmentRequestRepository requestRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private ResourceService resourceService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationService notificationService;

    // ── Create ────────────────────────────────────────────────────────────────

    @Transactional
    public EquipmentRequest createRequest(String userId, String resourceId,
                                          String requestDate,
                                          LocalDateTime startTime,
                                          LocalDateTime endTime,
                                          String purpose) {

        // Guard: only EQUIPMENT assets may be requested through this flow.
        Resource resource = resourceService.getResourceById(resourceId);
        if (!"EQUIPMENT".equalsIgnoreCase(resource.getAssetCategory())) {
            throw new RuntimeException("This resource is a facility. Please use the booking system instead.");
        }
        if (!"ACTIVE".equalsIgnoreCase(resource.getStatus())) {
            throw new RuntimeException("Equipment is not currently available for requests.");
        }

        // Validate timing
        if (!endTime.isAfter(startTime)) {
            throw new RuntimeException("End time must be after start time.");
        }

        // Removed time conflict check: this is just an access permission request, not a final booking.

        // Check for an existing PENDING/APPROVED request (time conflict)
        List<EquipmentRequest> requestConflicts = requestRepository
                .findByResourceIdAndStatusAndStartTimeLessThanAndEndTimeGreaterThan(
                        resourceId, EquipmentRequestStatus.APPROVED, endTime, startTime);
        if (!requestConflicts.isEmpty()) {
            throw new RuntimeException("An approved request already exists for this equipment at the selected time.");
        }

        // Fetch user details for denormalisation
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        EquipmentRequest req = new EquipmentRequest();
        req.setResourceId(resourceId);
        req.setResourceName(resource.getName());
        req.setUserId(userId);
        req.setUserName(user.getName());
        req.setRequestDate(requestDate);
        req.setStartTime(startTime);
        req.setEndTime(endTime);
        req.setPurpose(purpose);
        req.setStatus(EquipmentRequestStatus.PENDING);

        EquipmentRequest saved = requestRepository.save(req);

        // Notify all admins
        notificationService.notifyUsersByRole(Role.ROLE_ADMIN,
                "New equipment request: " + resource.getName() + " by " + user.getName(), "INFO");

        return saved;
    }

    // ── Query ─────────────────────────────────────────────────────────────────

    public List<EquipmentRequest> getMyRequests(String userId) {
        return requestRepository.findByUserId(userId);
    }

    public List<EquipmentRequest> getAllPendingRequests() {
        return requestRepository.findByStatus(EquipmentRequestStatus.PENDING);
    }

    public List<EquipmentRequest> getAllRequests() {
        return requestRepository.findAll();
    }

    // ── Approve ───────────────────────────────────────────────────────────────

    @Transactional
    public EquipmentRequest approveRequest(String requestId) {
        EquipmentRequest req = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Equipment request not found"));

        if (req.getStatus() != EquipmentRequestStatus.PENDING) {
            throw new RuntimeException("Only PENDING requests can be approved.");
        }

        // Re-validate resource
        Resource resource = resourceService.getResourceById(req.getResourceId());
        if (!"EQUIPMENT".equalsIgnoreCase(resource.getAssetCategory())) {
            throw new RuntimeException("Resource is not EQUIPMENT.");
        }

        // Race-condition guard: check bookings once more
        List<Booking> conflicts = bookingRepository
                .findByResourceIdAndStatusAndStartTimeLessThanAndEndTimeGreaterThan(
                        req.getResourceId(), BookingStatus.APPROVED,
                        req.getEndTime(), req.getStartTime());
        if (!conflicts.isEmpty()) {
            throw new RuntimeException("Time conflict: another booking has been approved for this slot.");
        }

        // Approval now strictly means the request is finalized.
        // No secondary booking step is required.

        // Mark the permission request as officially APPROVED
        req.setStatus(EquipmentRequestStatus.APPROVED);
        EquipmentRequest saved = requestRepository.save(req);

        // Notify the requester
        notificationService.createNotification(req.getUserId(),
                "Your equipment request for " + resource.getName() + " has been approved.",
                "Equipment Request Approved");

        return saved;
    }

    // ── Reject ────────────────────────────────────────────────────────────────

    @Transactional
    public EquipmentRequest rejectRequest(String requestId, String reason) {
        EquipmentRequest req = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Equipment request not found"));

        if (req.getStatus() != EquipmentRequestStatus.PENDING) {
            throw new RuntimeException("Only PENDING requests can be rejected.");
        }

        req.setStatus(EquipmentRequestStatus.REJECTED);
        if (reason != null && !reason.isBlank()) {
            req.setRejectionReason(reason);
        }
        EquipmentRequest saved = requestRepository.save(req);

        // Notify the requester
        String msg = "Your equipment request for " + req.getResourceName() + " has been rejected.";
        if (reason != null && !reason.isBlank()) msg += " Reason: " + reason;
        notificationService.createNotification(req.getUserId(), msg, "Equipment Request Rejected");

        return saved;
    }
}
