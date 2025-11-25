package com.smartparking.dto;

import java.time.LocalDateTime;

public class ParkResponse {

    private int slotId;
    private String vehicleNumber;
    private LocalDateTime entryTime;
    private String message;

    public ParkResponse(int slotId, String vehicleNumber, LocalDateTime entryTime, String message) {
        this.slotId = slotId;
        this.vehicleNumber = vehicleNumber;
        this.entryTime = entryTime;
        this.message = message;
    }

    public int getSlotId() {
        return slotId;
    }

    public String getVehicleNumber() {
        return vehicleNumber;
    }

    public LocalDateTime getEntryTime() {
        return entryTime;
    }

    public String getMessage() {
        return message;
    }
}
