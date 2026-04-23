package com.smartcampus.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

public class ChartDataDTO {
    private String name;
    private long value;

    public ChartDataDTO() {}

    public ChartDataDTO(String name, long value) {
        this.name = name;
        this.value = value;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public long getValue() { return value; }
    public void setValue(long value) { this.value = value; }
}
