package com.smartparking.controller;

import com.smartparking.dto.AdminLoginRequest;
import com.smartparking.dto.AdminLoginResponse;
import com.smartparking.dto.AdminRegisterRequest;
import com.smartparking.model.Admin;
import com.smartparking.service.AdminService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @PostMapping("/register")
    public ResponseEntity<AdminLoginResponse> register(@Valid @RequestBody AdminRegisterRequest request) {
        Admin created = adminService.register(request.getUsername(), request.getPassword());
        if (created == null) {
            return ResponseEntity.ok(
                    new AdminLoginResponse(false, "Username already exists.", null));
        }
        return ResponseEntity.ok(
                new AdminLoginResponse(true, "Admin registered successfully.", created.getUsername()));
    }

    @PostMapping("/login")
    public ResponseEntity<AdminLoginResponse> login(@Valid @RequestBody AdminLoginRequest request) {
        Admin admin = adminService.login(request.getUsername(), request.getPassword());
        if (admin == null) {
            return ResponseEntity.ok(
                    new AdminLoginResponse(false, "Invalid username or password.", null));
        }
        return ResponseEntity.ok(
                new AdminLoginResponse(true, "Login successful.", admin.getUsername()));
    }
}
