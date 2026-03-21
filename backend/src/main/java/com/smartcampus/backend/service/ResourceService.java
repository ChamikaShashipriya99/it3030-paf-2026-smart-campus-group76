package com.smartcampus.backend.service;

import com.smartcampus.backend.model.Resource;
import com.smartcampus.backend.repository.ResourceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ResourceService {

    @Autowired
    private ResourceRepository resourceRepository;

    public List<Resource> getAllResources() {
        return resourceRepository.findAll();
    }
    
    public Resource getResourceById(Long id) {
        return resourceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resource not found"));
    }

    public Resource createResource(Resource resource) {
        return resourceRepository.save(resource);
    }
    
    public Resource updateResource(Long id, Resource updatedResource) {
        Resource existing = getResourceById(id);
        existing.setName(updatedResource.getName());
        existing.setType(updatedResource.getType());
        existing.setCapacity(updatedResource.getCapacity());
        existing.setLocation(updatedResource.getLocation());
        existing.setAvailabilityWindows(updatedResource.getAvailabilityWindows());
        existing.setStatus(updatedResource.getStatus());
        return resourceRepository.save(existing);
    }
    
    public void deleteResource(Long id) {
        resourceRepository.deleteById(id);
    }

    public List<Resource> searchResources(String type, Integer minCapacity) {
        if (type != null && !type.isEmpty()) {
            return resourceRepository.findByTypeIgnoreCase(type);
        } else if (minCapacity != null) {
            return resourceRepository.findByCapacityGreaterThanEqual(minCapacity);
        }
        return getAllResources();
    }
}
