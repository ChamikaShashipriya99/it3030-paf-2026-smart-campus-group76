package com.smartcampus.backend.service;

import com.smartcampus.backend.model.Resource;
import com.smartcampus.backend.model.Ticket;
import com.smartcampus.backend.model.TicketStatus;
import com.smartcampus.backend.model.User;
import com.smartcampus.backend.repository.TicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TicketService {

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private ResourceService resourceService;

    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }

    public List<Ticket> getTicketsByCreator(Long userId) {
        return ticketRepository.findByCreatorId(userId);
    }
    
    public List<Ticket> getTicketsByTechnician(Long technicianId) {
        return ticketRepository.findByTechnicianId(technicianId);
    }

    public Ticket createTicket(Long creatorId, Long resourceId, String category, String description, String priority) {
        Resource resource = resourceService.getResourceById(resourceId);
        Ticket ticket = new Ticket();
        
        User creator = new User();
        creator.setId(creatorId);
        
        ticket.setCreator(creator);
        ticket.setResource(resource);
        ticket.setCategory(category);
        ticket.setDescription(description);
        ticket.setPriority(priority);
        ticket.setStatus(TicketStatus.OPEN);
        ticket.setCreatedAt(LocalDateTime.now());
        
        return ticketRepository.save(ticket);
    }

    public Ticket assignTechnician(Long ticketId, Long technicianId) {
        Ticket ticket = ticketRepository.findById(ticketId).orElseThrow(() -> new RuntimeException("Ticket not found"));
        User tech = new User();
        tech.setId(technicianId);
        ticket.setTechnician(tech);
        ticket.setStatus(TicketStatus.IN_PROGRESS);
        return ticketRepository.save(ticket);
    }

    public Ticket updateTicketStatus(Long ticketId, TicketStatus status, String resolutionNotes) {
        Ticket ticket = ticketRepository.findById(ticketId).orElseThrow(() -> new RuntimeException("Ticket not found"));
        ticket.setStatus(status);
        if (resolutionNotes != null) {
            ticket.setResolutionNotes(resolutionNotes);
        }
        return ticketRepository.save(ticket);
    }
}
