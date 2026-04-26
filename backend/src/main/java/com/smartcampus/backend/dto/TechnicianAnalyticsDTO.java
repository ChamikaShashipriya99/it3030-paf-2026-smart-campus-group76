package com.smartcampus.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

public class TechnicianAnalyticsDTO {
    private long totalTickets;
    private long assignedTickets;
    private long openTickets;
    private long inProgressTickets;
    private long resolvedTickets;

    public TechnicianAnalyticsDTO() {}

    public TechnicianAnalyticsDTO(long totalTickets, long assignedTickets, long openTickets, long inProgressTickets, long resolvedTickets) {
        this.totalTickets = totalTickets;
        this.assignedTickets = assignedTickets;
        this.openTickets = openTickets;
        this.inProgressTickets = inProgressTickets;
        this.resolvedTickets = resolvedTickets;
    }

    public long getTotalTickets() { return totalTickets; }
    public void setTotalTickets(long totalTickets) { this.totalTickets = totalTickets; }
    public long getAssignedTickets() { return assignedTickets; }
    public void setAssignedTickets(long assignedTickets) { this.assignedTickets = assignedTickets; }
    public long getOpenTickets() { return openTickets; }
    public void setOpenTickets(long openTickets) { this.openTickets = openTickets; }
    public long getInProgressTickets() { return inProgressTickets; }
    public void setInProgressTickets(long inProgressTickets) { this.inProgressTickets = inProgressTickets; }
    public long getResolvedTickets() { return resolvedTickets; }
    public void setResolvedTickets(long resolvedTickets) { this.resolvedTickets = resolvedTickets; }
}
