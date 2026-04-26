package com.smartcampus.backend.service;

import com.smartcampus.backend.model.Resource;
import com.smartcampus.backend.repository.ResourceRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.web.server.ResponseStatusException;

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

    // ── getAllResources ──────────────────────────────────────────────────────

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

    // ── getResourceById ──────────────────────────────────────────────────────

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
    void getResourceById_WhenNotExists_ShouldThrowResponseStatusException() {
        when(resourceRepository.findById("999")).thenReturn(Optional.empty());

        // Service now throws ResponseStatusException (404 NOT_FOUND), not a plain RuntimeException
        ResponseStatusException ex = assertThrows(ResponseStatusException.class, () ->
                resourceService.getResourceById("999"));

        assertTrue(ex.getMessage().contains("Resource not found"));
    }

    // ── createFacility ───────────────────────────────────────────────────────

    @Test
    void createFacility_ShouldSetAssetCategoryAndSave() {
        // Arrange: repository echoes back whatever is saved
        when(resourceRepository.save(any(Resource.class))).thenAnswer(inv -> inv.getArgument(0));

        // Act
        Resource result = resourceService.createFacility(
                "New Lab",        // name
                "LAB",            // type (sub-classification)
                50,               // capacity
                "Block B2",       // location
                "ACTIVE",         // status
                "08:00",          // startTime
                "18:00",          // endTime
                null              // image (no file in unit test)
        );

        // Assert
        assertNotNull(result);
        assertEquals("New Lab",   result.getName());
        assertEquals("LAB",       result.getType());
        assertEquals("FACILITY",  result.getAssetCategory());
        assertEquals(50,          result.getCapacity());
        assertEquals("Block B2",  result.getLocation());
        assertEquals("ACTIVE",    result.getStatus());
        assertEquals("08:00",     result.getStartTime());
        assertEquals("18:00",     result.getEndTime());
        verify(resourceRepository, times(1)).save(any(Resource.class));
    }

    // ── createEquipment ──────────────────────────────────────────────────────

    @Test
    void createEquipment_ShouldSetAssetCategoryAndSave() {
        when(resourceRepository.save(any(Resource.class))).thenAnswer(inv -> inv.getArgument(0));

        Resource result = resourceService.createEquipment(
                "Sony Projector",  // name
                "PROJECTOR",       // category → stored in type
                "Sony VPL-EW575", // brand
                "SN-2024-001",    // serialNumber
                3,                 // quantity
                "AV Room A",      // location
                "ACTIVE",         // status
                true,             // portable
                "2024-01-15",     // purchaseDate
                null              // image
        );

        assertNotNull(result);
        assertEquals("Sony Projector",   result.getName());
        assertEquals("PROJECTOR",        result.getType());
        assertEquals("EQUIPMENT",        result.getAssetCategory());
        assertEquals("Sony VPL-EW575",  result.getBrand());
        assertEquals("SN-2024-001",      result.getSerialNumber());
        assertEquals(3,                  result.getQuantity());
        assertTrue(result.getPortable());
        assertEquals("2024-01-15",       result.getPurchaseDate());
        verify(resourceRepository, times(1)).save(any(Resource.class));
    }

    // ── deleteResource ───────────────────────────────────────────────────────

    @Test
    void deleteResource_ShouldInvokeRepository() {
        String id = "123";
        doNothing().when(resourceRepository).deleteById(id);

        resourceService.deleteResource(id);

        verify(resourceRepository, times(1)).deleteById(id);
    }
}
