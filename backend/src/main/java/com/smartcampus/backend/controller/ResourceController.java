package com.smartcampus.backend.controller;

import com.smartcampus.backend.model.Resource;
import com.smartcampus.backend.service.ResourceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/resources")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class ResourceController {

    @Autowired
    private ResourceService resourceService;

    // ── GET all (with optional type / capacity filter) ───────────────────────
    @GetMapping
    public ResponseEntity<List<Resource>> getAllResources(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) Integer minCapacity) {

        if (type != null || minCapacity != null) {
            return ResponseEntity.ok(resourceService.searchResources(type, minCapacity));
        }
        return ResponseEntity.ok(resourceService.getAllResources());
    }

    // ── GET by id ────────────────────────────────────────────────────────────
    @GetMapping("/{id}")
    public ResponseEntity<Resource> getResourceById(@PathVariable String id) {
        return ResponseEntity.ok(resourceService.getResourceById(id));
    }

    // ── POST /api/resources  — single unified create endpoint ────────────────
    //
    //   Facility fields:  name, type (sub-classification), capacity, location,
    //                     status, startTime, endTime, image
    //   Equipment fields: name, type="EQUIPMENT", assetCategory="EQUIPMENT",
    //                     brand, serialNumber, quantity, portable, purchaseDate,
    //                     location, status, image
    //
    //   assetCategory discriminator (optional, defaults to "FACILITY"):
    //     "FACILITY"  → Lecture Hall, Lab, Meeting Room, Study Area
    //     "EQUIPMENT" → Camera, Projector, AC, Mic, Speaker, Laptop, Smart Board
    //
    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<Resource> createResource(
            @RequestParam("name")                                         String name,
            @RequestParam("type")                                         String type,
            @RequestParam(value = "assetCategory", defaultValue = "FACILITY") String assetCategory,
            @RequestParam(value = "capacity",      defaultValue = "0")    int capacity,
            @RequestParam("location")                                     String location,
            @RequestParam("status")                                       String status,
            // Facility-only
            @RequestParam(value = "startTime",    required = false)       String startTime,
            @RequestParam(value = "endTime",      required = false)       String endTime,
            // Equipment-only
            @RequestParam(value = "brand",        required = false)       String brand,
            @RequestParam(value = "serialNumber", required = false)       String serialNumber,
            @RequestParam(value = "quantity",     defaultValue = "1")     int quantity,
            @RequestParam(value = "portable",     defaultValue = "true")  boolean portable,
            @RequestParam(value = "purchaseDate", required = false)       String purchaseDate,
            // Shared
            @RequestParam(value = "image",        required = false)       MultipartFile image) {

        if (name == null || name.isBlank())
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Name is required");

        if ("EQUIPMENT".equalsIgnoreCase(assetCategory)) {
            if (quantity <= 0)
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Quantity must be at least 1");

            return ResponseEntity.ok(
                    resourceService.createEquipment(name, type, brand, serialNumber,
                            quantity, location, status, portable, purchaseDate, image));
        }

        // FACILITY (default)
        if (capacity < 0)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Capacity cannot be negative");

        return ResponseEntity.ok(
                resourceService.createFacility(name, type, capacity, location, status, startTime, endTime, image));
    }

    // ── PUT /api/resources/{id}  — single unified update endpoint ────────────
    @PutMapping(value = "/{id}", consumes = "multipart/form-data")
    public ResponseEntity<Resource> updateResource(
            @PathVariable                                                  String id,
            @RequestParam("name")                                         String name,
            @RequestParam("type")                                         String type,
            @RequestParam(value = "assetCategory", defaultValue = "FACILITY") String assetCategory,
            @RequestParam(value = "capacity",      defaultValue = "0")    int capacity,
            @RequestParam("location")                                     String location,
            @RequestParam("status")                                       String status,
            // Facility-only
            @RequestParam(value = "startTime",    required = false)       String startTime,
            @RequestParam(value = "endTime",      required = false)       String endTime,
            // Equipment-only
            @RequestParam(value = "brand",        required = false)       String brand,
            @RequestParam(value = "serialNumber", required = false)       String serialNumber,
            @RequestParam(value = "quantity",     defaultValue = "1")     int quantity,
            @RequestParam(value = "portable",     defaultValue = "true")  boolean portable,
            @RequestParam(value = "purchaseDate", required = false)       String purchaseDate,
            // Shared
            @RequestParam(value = "image",        required = false)       MultipartFile image) {

        if ("EQUIPMENT".equalsIgnoreCase(assetCategory)) {
            return ResponseEntity.ok(
                    resourceService.updateEquipment(id, name, type, brand, serialNumber,
                            quantity, location, status, portable, purchaseDate, image));
        }

        return ResponseEntity.ok(
                resourceService.updateFacility(id, name, type, capacity, location, status, startTime, endTime, image));
    }

    // ── DELETE ───────────────────────────────────────────────────────────────
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResource(@PathVariable String id) {
        resourceService.deleteResource(id);
        return ResponseEntity.ok().build();
    }
}
