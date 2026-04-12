package com.smartcampus.backend.service;

import com.smartcampus.backend.model.Resource;
import com.smartcampus.backend.repository.ResourceRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class ResourceServiceTest {

    @Mock
    private ResourceRepository resourceRepository;

    @InjectMocks
    private ResourceService resourceService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void getAllResources_ShouldReturnList() {
        Resource r1 = new Resource();
        r1.setName("Lab 01");
        Resource r2 = new Resource();
        r2.setName("Hall A");

        when(resourceRepository.findAll()).thenReturn(Arrays.asList(r1, r2));

        List<Resource> result = resourceService.getAllResources();

        assertEquals(2, result.size());
        assertEquals("Lab 01", result.get(0).getName());
        verify(resourceRepository, times(1)).findAll();
    }

    @Test
    void getResourceById_WhenExists_ShouldReturnResource() {
        Resource r = new Resource();
        r.setId("123");
        r.setName("Test Resource");

        when(resourceRepository.findById("123")).thenReturn(Optional.of(r));

        Resource result = resourceService.getResourceById("123");

        assertNotNull(result);
        assertEquals("Test Resource", result.getName());
    }

    @Test
    void getResourceById_WhenNotExists_ShouldThrowException() {
        when(resourceRepository.findById("999")).thenReturn(Optional.empty());

        Exception exception = assertThrows(RuntimeException.class, () -> {
            resourceService.getResourceById("999");
        });

        assertEquals("Resource not found", exception.getMessage());
    }

    @Test
    void createResource_ShouldSaveAndReturn() {
        Resource r = new Resource();
        r.setName("New Lab");

        when(resourceRepository.save(any(Resource.class))).thenReturn(r);

        Resource result = resourceService.createResource("New Lab", "LAB", 50, "B2", "ACTIVE", "08:00", "18:00", null);

        assertNotNull(result);
        assertEquals("New Lab", result.getName());
        verify(resourceRepository, times(1)).save(any(Resource.class));
    }

    @Test
    void deleteResource_ShouldInvokeRepository() {
        String id = "123";
        doNothing().when(resourceRepository).deleteById(id);

        resourceService.deleteResource(id);

        verify(resourceRepository, times(1)).deleteById(id);
    }
}
