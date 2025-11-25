package com.smartparking.service;

import com.smartparking.dto.ParkResponse;
import com.smartparking.dto.UnparkResponse;
import com.smartparking.model.ParkingSlot;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class ParkingService {

    private final Map<Integer, ParkingSlot> slots = new LinkedHashMap<>();
    private final double hourlyRate = 50.0; // e.g. ₹50 per hour

    public ParkingService() {
        // Each floor has 100 slots
        String[] floors = { "G", "F1", "F2", "F3", "F4", "B1", "B2" };
        int slotsPerFloor = 100;

        int globalSlotId = 1;
        for (String floor : floors) {
            for (int i = 1; i <= slotsPerFloor; i++) {
                slots.put(globalSlotId, new ParkingSlot(globalSlotId, floor));
                globalSlotId++;
            }
        }
        // Total slots = floors.length * slotsPerFloor = 700
    }

    public List<ParkingSlot> getAllSlots() {
        return new ArrayList<>(slots.values());
    }

    /**
     * Park a vehicle in a specific slot chosen by admin.
     * If requestedSlotId is null → falls back to first free slot.
     */
    public ParkResponse parkVehicle(String vehicleNumber, Integer requestedSlotId) {

        // Check if vehicle already parked
        Optional<ParkingSlot> existing = slots.values().stream()
                .filter(ParkingSlot::isOccupied)
                .filter(slot -> vehicleNumber.equalsIgnoreCase(slot.getVehicleNumber()))
                .findFirst();

        if (existing.isPresent()) {
            ParkingSlot slot = existing.get();
            return new ParkResponse(
                    slot.getId(),
                    slot.getVehicleNumber(),
                    slot.getEntryTime(),
                    "Vehicle is already parked in slot " + slot.getId());
        }

        ParkingSlot targetSlot;

        if (requestedSlotId != null) {
            // Admin chose a particular slot
            targetSlot = slots.get(requestedSlotId);
            if (targetSlot == null) {
                return new ParkResponse(
                        -1,
                        vehicleNumber,
                        null,
                        "Invalid slot selected.");
            }
            if (targetSlot.isOccupied()) {
                return new ParkResponse(
                        -1,
                        vehicleNumber,
                        null,
                        "Selected slot is already occupied.");
            }
        } else {
            // Fallback: first free slot (any floor)
            Optional<ParkingSlot> freeSlotOpt = slots.values().stream()
                    .filter(slot -> !slot.isOccupied())
                    .findFirst();

            if (freeSlotOpt.isEmpty()) {
                return new ParkResponse(
                        -1,
                        vehicleNumber,
                        null,
                        "No free slots available!");
            }
            targetSlot = freeSlotOpt.get();
        }

        targetSlot.setOccupied(true);
        targetSlot.setVehicleNumber(vehicleNumber);
        targetSlot.setEntryTime(LocalDateTime.now());

        return new ParkResponse(
                targetSlot.getId(),
                targetSlot.getVehicleNumber(),
                targetSlot.getEntryTime(),
                "Vehicle parked successfully.");
    }

    public UnparkResponse unparkVehicle(int slotId) {
        ParkingSlot slot = slots.get(slotId);
        if (slot == null) {
            return new UnparkResponse(
                    slotId,
                    null,
                    null,
                    null,
                    0,
                    0,
                    0.0,
                    "Invalid slot ID.");
        }

        if (!slot.isOccupied()) {
            return new UnparkResponse(
                    slotId,
                    null,
                    null,
                    null,
                    0,
                    0,
                    0.0,
                    "Slot is already empty.");
        }

        LocalDateTime entryTime = slot.getEntryTime();
        LocalDateTime exitTime = LocalDateTime.now();

        long totalMinutes = Duration.between(entryTime, exitTime).toMinutes();
        if (totalMinutes <= 0)
            totalMinutes = 1;

        long billableHours = (long) Math.ceil(totalMinutes / 60.0);
        if (billableHours == 0)
            billableHours = 1;

        double amount = billableHours * hourlyRate;

        String vehicleNumber = slot.getVehicleNumber();

        // Free the slot
        slot.setOccupied(false);
        slot.setVehicleNumber(null);
        slot.setEntryTime(null);

        return new UnparkResponse(
                slotId,
                vehicleNumber,
                entryTime,
                exitTime,
                totalMinutes,
                billableHours,
                amount,
                "Vehicle unparked successfully.");
    }

    public Map<String, Long> getSummary() {
        long occupied = slots.values().stream().filter(ParkingSlot::isOccupied).count();
        long free = slots.size() - occupied;

        Map<String, Long> summary = new LinkedHashMap<>();
        summary.put("totalSlots", (long) slots.size()); // 700
        summary.put("occupiedSlots", occupied);
        summary.put("freeSlots", free);
        return summary;
    }
}
