package com.smartcampus.backend.service;

import com.smartcampus.backend.model.Resource;
import com.smartcampus.backend.repository.ResourceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class ResourceService {

    @Autowired
    private ResourceRepository resourceRepository;

    // ── Read ─────────────────────────────────────────────────────────────────

    public List<Resource> getAllResources() {
        return resourceRepository.findAll();
    }

    public Resource getResourceById(String id) {
        return resourceRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Resource not found: " + id));
    }

    public List<Resource> searchResources(String type, Integer minCapacity) {
        if (type != null && !type.isEmpty()) {
            return resourceRepository.findByTypeIgnoreCase(type);
        } else if (minCapacity != null) {
            return resourceRepository.findByCapacityGreaterThanEqual(minCapacity);
        }
        return getAllResources();
    }

    // ── Create Facility ───────────────────────────────────────────────────────

    public Resource createFacility(String name, String type, int capacity,
            String location, String status, String startTime, String endTime,
            MultipartFile image) {

        Resource r = new Resource();
        r.setAssetCategory("FACILITY");
        r.setName(name);
        r.setType(type);
        r.setCapacity(capacity);
        r.setLocation(location);
        r.setStatus(status);
        r.setStartTime(startTime);
        r.setEndTime(endTime);
        r.setAvailabilityWindows("Daily " + startTime + " to " + endTime);
        applyImage(r, image);
        return resourceRepository.save(r);
    }

    // ── Create Equipment ──────────────────────────────────────────────────────

    public Resource createEquipment(String name, String category, String brand,
            String serialNumber, int quantity, String location, String status,
            Boolean portable, String purchaseDate, MultipartFile image) {

        Resource r = new Resource();
        r.setAssetCategory("EQUIPMENT");
        r.setName(name);
        r.setType(category);          // category stored in `type` field
        r.setBrand(brand);
        r.setSerialNumber(serialNumber);
        r.setQuantity(quantity);
        r.setLocation(location);
        r.setStatus(status);
        r.setPortable(portable);
        r.setPurchaseDate(purchaseDate);
        applyImage(r, image);
        return resourceRepository.save(r);
    }

    // ── Update Facility ───────────────────────────────────────────────────────

    public Resource updateFacility(String id, String name, String type, int capacity,
            String location, String status, String startTime, String endTime,
            MultipartFile image) {

        Resource r = getResourceById(id);
        r.setName(name);
        r.setType(type);
        r.setCapacity(capacity);
        r.setLocation(location);
        r.setStatus(status);
        r.setStartTime(startTime);
        r.setEndTime(endTime);
        r.setAvailabilityWindows("Daily " + startTime + " to " + endTime);
        applyImage(r, image);
        return resourceRepository.save(r);
    }

    // ── Update Equipment ──────────────────────────────────────────────────────

    public Resource updateEquipment(String id, String name, String category, String brand,
            String serialNumber, int quantity, String location, String status,
            Boolean portable, String purchaseDate, MultipartFile image) {

        Resource r = getResourceById(id);
        r.setName(name);
        r.setType(category);
        r.setBrand(brand);
        r.setSerialNumber(serialNumber);
        r.setQuantity(quantity);
        r.setLocation(location);
        r.setStatus(status);
        r.setPortable(portable);
        r.setPurchaseDate(purchaseDate);
        applyImage(r, image);
        return resourceRepository.save(r);
    }

    // ── Legacy multipart update (keeps existing edit-facility flow working) ───

    public Resource updateResourceMultipart(String id, String name, String type, int capacity,
            String location, String status, String startTime, String endTime,
            MultipartFile image) {

        Resource r = getResourceById(id);
        // Preserve assetCategory if already set; default to FACILITY for old docs
        if (r.getAssetCategory() == null) r.setAssetCategory("FACILITY");
        r.setName(name);
        r.setType(type);
        r.setCapacity(capacity);
        r.setLocation(location);
        r.setStatus(status);
        r.setStartTime(startTime);
        r.setEndTime(endTime);
        r.setAvailabilityWindows("Daily " + startTime + " to " + endTime);
        applyImage(r, image);
        return resourceRepository.save(r);
    }

    // ── Delete ────────────────────────────────────────────────────────────────

    public void deleteResource(String id) {
        resourceRepository.deleteById(id);
    }

    // ── Helper ────────────────────────────────────────────────────────────────

    private void applyImage(Resource r, MultipartFile image) {
        if (image != null && !image.isEmpty()) {
            try {
                r.setImage(image.getBytes());
                r.setImageContentType(image.getContentType());
            } catch (java.io.IOException e) {
                throw new RuntimeException("Failed to store image", e);
            }
        }
    }
}
