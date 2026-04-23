package com.smartcampus.backend.service;

import com.smartcampus.backend.dto.ChartDataDTO;
import com.smartcampus.backend.dto.TechnicianAnalyticsDTO;
import com.smartcampus.backend.model.TicketStatus;
import com.smartcampus.backend.repository.TicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class AnalyticsService {

    @Autowired
    private TicketRepository ticketRepository;

    public TechnicianAnalyticsDTO getTechnicianAnalytics(String technicianId) {
        long totalTickets = ticketRepository.count();
        long assignedTickets = ticketRepository.countByTechnicianId(technicianId);
        long openTickets = ticketRepository.countByTechnicianIdAndStatus(technicianId, TicketStatus.OPEN);
        long inProgressTickets = ticketRepository.countByTechnicianIdAndStatus(technicianId, TicketStatus.IN_PROGRESS);
        long resolvedTickets = ticketRepository.countByTechnicianIdAndStatus(technicianId, TicketStatus.RESOLVED);

        return new TechnicianAnalyticsDTO(totalTickets, assignedTickets, openTickets, inProgressTickets, resolvedTickets);
    }

    public List<ChartDataDTO> getTechnicianChartData(String technicianId) {
        List<ChartDataDTO> chartData = new ArrayList<>();
        
        long openCount = ticketRepository.countByTechnicianIdAndStatus(technicianId, TicketStatus.OPEN);
        long inProgressCount = ticketRepository.countByTechnicianIdAndStatus(technicianId, TicketStatus.IN_PROGRESS);
        long resolvedCount = ticketRepository.countByTechnicianIdAndStatus(technicianId, TicketStatus.RESOLVED);

        chartData.add(new ChartDataDTO("Open", openCount));
        chartData.add(new ChartDataDTO("In Progress", inProgressCount));
        chartData.add(new ChartDataDTO("Resolved", resolvedCount));

        return chartData;
    }
}
