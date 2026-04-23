package com.smartcampus.backend.service;

import com.smartcampus.backend.model.Booking;
import com.smartcampus.backend.model.BookingStatus;
import com.smartcampus.backend.model.Resource;
import com.smartcampus.backend.repository.BookingRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

class BookingServiceTest {

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private ResourceService resourceService;

    @Mock
    private NotificationService notificationService;

    @InjectMocks
    private BookingService bookingService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void createBookingRequest_WhenNoConflict_ShouldSave() {
        String userId = "user123";
        String resourceId = "res123";
        LocalDateTime start = LocalDateTime.now();
        LocalDateTime end = start.plusHours(2);

        when(bookingRepository.findByResourceIdAndStatusAndStartTimeLessThanAndEndTimeGreaterThan(
                anyString(), any(BookingStatus.class), any(LocalDateTime.class), any(LocalDateTime.class)))
                .thenReturn(Collections.emptyList());

        Resource mockRes = new Resource();
        mockRes.setName("Mock Lab");
        when(resourceService.getResourceById(resourceId)).thenReturn(mockRes);

        when(bookingRepository.save(any(Booking.class))).thenAnswer(i -> i.getArguments()[0]);

        Booking result = bookingService.createBookingRequest(userId, resourceId, start, end, "Exam", 30);

        assertNotNull(result);
        assertEquals(BookingStatus.PENDING, result.getStatus());
        verify(bookingRepository).save(any(Booking.class));
    }

    @Test
    void createBookingRequest_WhenConflict_ShouldThrowException() {
        when(bookingRepository.findByResourceIdAndStatusAndStartTimeLessThanAndEndTimeGreaterThan(
                anyString(), any(BookingStatus.class), any(LocalDateTime.class), any(LocalDateTime.class)))
                .thenReturn(Collections.singletonList(new Booking()));

        assertThrows(RuntimeException.class, () -> {
            bookingService.createBookingRequest("u1", "r1", LocalDateTime.now(), LocalDateTime.now().plusHours(1),
                    "Fail", 10);
        });
    }

    @Test
    void updateBookingStatus_ToApproved_ShouldCheckConflictAgain() {
        Booking booking = new Booking();
        booking.setId("b1");
        Resource r = new Resource();
        r.setId("r1");
        r.setName("Resource");
        booking.setResource(r);
        booking.setStartTime(LocalDateTime.now());
        booking.setEndTime(LocalDateTime.now().plusHours(1));
        booking.setUser(new com.smartcampus.backend.model.User());

        when(bookingRepository.findById("b1")).thenReturn(Optional.of(booking));
        when(bookingRepository.findByResourceIdAndStatusAndStartTimeLessThanAndEndTimeGreaterThan(any(), any(), any(),
                any()))
                .thenReturn(Collections.emptyList());
        when(bookingRepository.save(any())).thenReturn(booking);

        Booking result = bookingService.updateBookingStatus("b1", BookingStatus.APPROVED, null);

        assertEquals(BookingStatus.APPROVED, result.getStatus());
        verify(bookingRepository).save(booking);
    }
}
