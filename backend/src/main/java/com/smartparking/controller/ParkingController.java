package com.smartparking.controller;

import com.smartparking.dto.ParkRequest;
import com.smartparking.dto.ParkResponse;
import com.smartparking.dto.UnparkRequest;
import com.smartparking.dto.UnparkResponse;
import com.smartparking.model.ParkingSlot;
import com.smartparking.service.ParkingService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*") // allow frontend calls
public class ParkingController {

    private final ParkingService parkingService;

    public ParkingController(ParkingService parkingService) {
        this.parkingService = parkingService;
    }

    @GetMapping("/slots")
    public ResponseEntity<List<ParkingSlot>> getSlots() {
        return ResponseEntity.ok(parkingService.getAllSlots());
    }

    @PostMapping("/park")
    public ResponseEntity<ParkResponse> parkVehicle(@Valid @RequestBody ParkRequest request) {
        ParkResponse response = parkingService.parkVehicle(
                request.getVehicleNumber(),
                request.getSlotId());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/unpark")
    public ResponseEntity<UnparkResponse> unparkVehicle(@Valid @RequestBody UnparkRequest request) {
        UnparkResponse response = parkingService.unparkVehicle(request.getSlotId());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/summary")
    public ResponseEntity<Map<String, Long>> getSummary() {
        return ResponseEntity.ok(parkingService.getSummary());
    }
}
