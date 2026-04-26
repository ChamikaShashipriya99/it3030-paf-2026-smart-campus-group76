package com.smartcampus.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import jakarta.validation.constraints.NotBlank;

/**
 * Unified Resource document for both Facility Assets and Special Equipment.
 *
 * assetCategory discriminator:
 *   "FACILITY"  → Lecture Hall, Laboratory, Meeting Room, Study Area
 *   "EQUIPMENT" → Camera, Projector, AC, Microphone, Speaker, Laptop, Smart Board
 *
 * Fields are selectively populated depending on assetCategory.
 * All equipment-specific fields are optional (nullable) so existing
 * facility documents in MongoDB are not affected.
 */
@Document(collection = "resources")
public class Resource {

    @Id
    private String id;

    // ── Common fields ─────────────────────────────────────────────────────────

    @NotBlank(message = "Resource name is required")
    private String name;

    /**
     * Top-level category: "FACILITY" | "EQUIPMENT"
     * Previously only classifications like LECTURE_HALL were stored in `type`.
     * We keep `type` for backward-compatibility (stores the sub-classification).
     * New field `assetCategory` is the discriminator.
     */
    private String assetCategory; // "FACILITY" | "EQUIPMENT"

    /**
     * Sub-classification.
     * Facility  → LECTURE_HALL | LAB | MEETING_ROOM | STUDY_AREA
     * Equipment → CAMERA | PROJECTOR | AC | MICROPHONE | SPEAKER | LAPTOP | SMART_BOARD | OTHER
     */
    @NotBlank(message = "Resource type is required")
    private String type;

    @NotBlank(message = "Location is required")
    private String location;

    private String status; // ACTIVE | MAINTENANCE | INACTIVE

    private byte[] image;
    private String imageContentType;

    // ── Facility-specific fields ──────────────────────────────────────────────

    private Integer capacity;        // nullable for equipment
    private String availabilityWindows;
    private String startTime;
    private String endTime;

    // ── Equipment-specific fields ─────────────────────────────────────────────

    private String brand;           // Brand / Model
    private String serialNumber;
    private Integer quantity;       // number of units
    private Boolean portable;       // true = portable, false = fixed
    private String purchaseDate;    // ISO date string yyyy-MM-dd

    // ── Constructors ──────────────────────────────────────────────────────────

    public Resource() {}

    // ── Getters & Setters ─────────────────────────────────────────────────────

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getAssetCategory() { return assetCategory; }
    public void setAssetCategory(String assetCategory) { this.assetCategory = assetCategory; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public byte[] getImage() { return image; }
    public void setImage(byte[] image) { this.image = image; }

    public String getImageContentType() { return imageContentType; }
    public void setImageContentType(String imageContentType) { this.imageContentType = imageContentType; }

    // Facility fields
    public Integer getCapacity() { return capacity; }
    public void setCapacity(Integer capacity) { this.capacity = capacity; }

    public String getAvailabilityWindows() { return availabilityWindows; }
    public void setAvailabilityWindows(String availabilityWindows) { this.availabilityWindows = availabilityWindows; }

    public String getStartTime() { return startTime; }
    public void setStartTime(String startTime) { this.startTime = startTime; }

    public String getEndTime() { return endTime; }
    public void setEndTime(String endTime) { this.endTime = endTime; }

    // Equipment fields
    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }

    public String getSerialNumber() { return serialNumber; }
    public void setSerialNumber(String serialNumber) { this.serialNumber = serialNumber; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public Boolean getPortable() { return portable; }
    public void setPortable(Boolean portable) { this.portable = portable; }

    public String getPurchaseDate() { return purchaseDate; }
    public void setPurchaseDate(String purchaseDate) { this.purchaseDate = purchaseDate; }
}
