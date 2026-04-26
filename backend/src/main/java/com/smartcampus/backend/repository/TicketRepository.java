package com.smartcampus.backend.repository;

import com.smartcampus.backend.model.Ticket;
import com.smartcampus.backend.model.TicketStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketRepository extends MongoRepository<Ticket, String> {
    List<Ticket> findByCreatorIdOrderByCreatedAtDesc(String creatorId);
    List<Ticket> findByCreatorId(String creatorId);
    List<Ticket> findByTechnicianId(String technicianId);
    List<Ticket> findByStatus(TicketStatus status);
    long countByTechnicianId(String technicianId);
    long countByTechnicianIdAndStatus(String technicianId, TicketStatus status);
    long countByStatus(TicketStatus status);
    long countByStatusIn(java.util.Collection<TicketStatus> statuses);
    long countByStatusNotIn(java.util.Collection<TicketStatus> statuses);
}
