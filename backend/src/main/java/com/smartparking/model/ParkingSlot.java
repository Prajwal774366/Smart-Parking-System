package com.smartparking.model;

import java.time.LocalDateTime;

public class ParkingSlot {

    private int id;
    private String floor;
    private boolean occupied;
    private String vehicleNumber;
    private LocalDateTime entryTime;

    public ParkingSlot(int id, String floor) {
        this.id = id;
        this.floor = floor;
        this.occupied = false;
        this.vehicleNumber = null;
        this.entryTime = null;
    }

    public int getId() {
        return id;
    }

    public String getFloor() {
        return floor;
    }

    public void setFloor(String floor) {
        this.floor = floor;
    }

    public boolean isOccupied() {
        return occupied;
    }

    public void setOccupied(boolean occupied) {
        this.occupied = occupied;
    }

    public String getVehicleNumber() {
        return vehicleNumber;
    }

    public void setVehicleNumber(String vehicleNumber) {
        this.vehicleNumber = vehicleNumber;
    }

    public LocalDateTime getEntryTime() {
        return entryTime;
    }

    public void setEntryTime(LocalDateTime entryTime) {
        this.entryTime = entryTime;
    }
}
