package com.smartparking.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class ParkRequest {

    @NotBlank(message = "Vehicle number is required")
    @Pattern(regexp = "^[A-Za-z0-9]{10,}$", message = "Vehicle number must be alphanumeric and at least 10 characters (e.g. KA14RD6006)")
    private String vehicleNumber;

    // Slot chosen by admin
    @Min(value = 1, message = "Slot id must be >= 1")
    private Integer slotId;

    public String getVehicleNumber() {
        return vehicleNumber;
    }

    public void setVehicleNumber(String vehicleNumber) {
        this.vehicleNumber = vehicleNumber;
    }

    public Integer getSlotId() {
        return slotId;
    }

    public void setSlotId(Integer slotId) {
        this.slotId = slotId;
    }
}
