package com.smartcampus.backend.controller;

import com.smartcampus.backend.dto.ChartDataDTO;
import com.smartcampus.backend.dto.TechnicianAnalyticsDTO;
import com.smartcampus.backend.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/analytics")
@CrossOrigin(origins = "*")
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    @GetMapping("/technician/{technicianId}")
    public ResponseEntity<TechnicianAnalyticsDTO> getTechnicianAnalytics(@PathVariable String technicianId) {
        return ResponseEntity.ok(analyticsService.getTechnicianAnalytics(technicianId));
    }

    @GetMapping("/technician/{technicianId}/chart")
    public ResponseEntity<List<ChartDataDTO>> getTechnicianChartData(@PathVariable String technicianId) {
        return ResponseEntity.ok(analyticsService.getTechnicianChartData(technicianId));
    }
}
