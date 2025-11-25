package com.smartparking.service;

import com.smartparking.model.Admin;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class AdminService {

    private final Map<String, Admin> adminsByUsername = new ConcurrentHashMap<>();
    private final AtomicLong idGenerator = new AtomicLong(1);

    public AdminService() {
        // default admin for demo
        Admin defaultAdmin = new Admin(
                idGenerator.getAndIncrement(),
                "admin",
                "admin123");
        adminsByUsername.put(defaultAdmin.getUsername().toLowerCase(), defaultAdmin);
    }

    public Admin register(String username, String password) {
        String key = username.toLowerCase();
        if (adminsByUsername.containsKey(key)) {
            return null; // already exists
        }
        Admin admin = new Admin(idGenerator.getAndIncrement(), username, password);
        adminsByUsername.put(key, admin);
        return admin;
    }

    public Admin login(String username, String password) {
        String key = username.toLowerCase();
        Admin admin = adminsByUsername.get(key);
        if (admin == null)
            return null;
        if (!admin.getPassword().equals(password))
            return null;
        return admin;
    }
}
