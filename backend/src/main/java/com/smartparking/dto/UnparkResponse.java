package com.smartparking.dto;

import java.time.LocalDateTime;

public class UnparkResponse {

    private int slotId;
    private String vehicleNumber;
    private LocalDateTime entryTime;
    private LocalDateTime exitTime;
    private long totalMinutes;
    private long billableHours;
    private double amountToPay;
    private String message;

    public UnparkResponse(int slotId,
            String vehicleNumber,
            LocalDateTime entryTime,
            LocalDateTime exitTime,
            long totalMinutes,
            long billableHours,
            double amountToPay,
            String message) {
        this.slotId = slotId;
        this.vehicleNumber = vehicleNumber;
        this.entryTime = entryTime;
        this.exitTime = exitTime;
        this.totalMinutes = totalMinutes;
        this.billableHours = billableHours;
        this.amountToPay = amountToPay;
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

    public LocalDateTime getExitTime() {
        return exitTime;
    }

    public long getTotalMinutes() {
        return totalMinutes;
    }

    public long getBillableHours() {
        return billableHours;
    }

    public double getAmountToPay() {
        return amountToPay;
    }

    public String getMessage() {
        return message;
    }
}
