package com.smartcampus.backend.repository;

import com.smartcampus.backend.model.Booking;
import com.smartcampus.backend.model.BookingStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BookingRepository extends MongoRepository<Booking, String> {
    
    // Core conflict resolution query logic
    List<Booking> findByResourceIdAndStatusAndStartTimeLessThanAndEndTimeGreaterThan(
            String resourceId, BookingStatus status, LocalDateTime endTime, LocalDateTime startTime);
            
    List<Booking> findByUserId(String userId);
    List<Booking> findByStatus(BookingStatus status);
}
