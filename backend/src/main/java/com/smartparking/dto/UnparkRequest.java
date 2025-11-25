package com.smartparking.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class UnparkRequest {

    @NotNull(message = "Slot ID is required")
    @Min(value = 1, message = "Slot ID must be positive")
    private Integer slotId;

    public Integer getSlotId() {
        return slotId;
    }

    public void setSlotId(Integer slotId) {
        this.slotId = slotId;
    }
}
