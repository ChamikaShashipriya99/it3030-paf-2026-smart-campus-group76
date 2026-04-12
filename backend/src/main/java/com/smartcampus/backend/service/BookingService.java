package com.smartcampus.backend.service;

import com.smartcampus.backend.model.Booking;
import com.smartcampus.backend.model.BookingStatus;
import com.smartcampus.backend.model.Resource;
import com.smartcampus.backend.model.Role;
import com.smartcampus.backend.model.User;
import com.smartcampus.backend.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private ResourceService resourceService;

    @Autowired
    private NotificationService notificationService;

    public List<Booking> getUserBookings(String userId) {
        return bookingRepository.findByUserId(userId);
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    @Transactional
    public Booking createBookingRequest(String userId, String resourceId, LocalDateTime start, LocalDateTime end,
            String purpose) {
        // Validation for overlap against existing APPROVED bookings
        List<Booking> overlapping = bookingRepository
                .findByResourceIdAndStatusAndStartTimeLessThanAndEndTimeGreaterThan(
                        resourceId, BookingStatus.APPROVED, end, start);

        if (!overlapping.isEmpty()) {
            throw new RuntimeException("Resource is already successfully booked for the specified time range.");
        }

        Resource resource = resourceService.getResourceById(resourceId);

        Booking booking = new Booking();
        User user = new User();
        user.setId(userId);
        booking.setUser(user);
        booking.setResource(resource);
        booking.setStartTime(start);
        booking.setEndTime(end);
        booking.setPurpose(purpose);
        booking.setStatus(BookingStatus.PENDING);

        Booking saved = bookingRepository.save(booking);

        // Notify Admins
        notificationService.notifyUsersByRole(Role.ROLE_ADMIN,
                "New booking request for " + resource.getName() + " by " + userId, "INFO");

        return saved;
    }

    public Booking updateBookingStatus(String bookingId, BookingStatus status, String reason) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        // Final sanity check when approving to prevent race conditions
        if (status == BookingStatus.APPROVED) {
            List<Booking> overlapping = bookingRepository
                    .findByResourceIdAndStatusAndStartTimeLessThanAndEndTimeGreaterThan(
                            booking.getResource().getId(), BookingStatus.APPROVED, booking.getEndTime(),
                            booking.getStartTime());
            if (!overlapping.isEmpty()) {
                throw new RuntimeException("Time conflict occurred. Another booking is already approved.");
            }
        }

        booking.setStatus(status);
        if (status == BookingStatus.REJECTED && reason != null) {
            booking.setRejectionReason(reason);
        }

        Booking saved = bookingRepository.save(booking);

        if (status == BookingStatus.APPROVED || status == BookingStatus.REJECTED) {
            String msg = "Your booking for " + booking.getResource().getName() + " was " + status + ".";
            if (status == BookingStatus.REJECTED && reason != null) {
                msg += " Reason: " + reason;
            }
            notificationService.createNotification(booking.getUser().getId(), msg,
                    status == BookingStatus.APPROVED ? "SUCCESS" : "WARNING");
        }

        return saved;
    }

    public Booking checkInBooking(String bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        if (booking.getStatus() != BookingStatus.APPROVED) {
            throw new RuntimeException("Only approved bookings can be checked in.");
        }
        booking.setStatus(BookingStatus.CHECKED_IN);
        notificationService.createNotification(booking.getUser().getId(),
                "Security: Successful QR Check-in for " + booking.getResource().getName(), "SUCCESS");
        return bookingRepository.save(booking);
    }
}
