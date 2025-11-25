package com.smartparking.dto;

public class AdminLoginResponse {

    private boolean success;
    private String message;
    private String username;

    public AdminLoginResponse(boolean success, String message, String username) {
        this.success = success;
        this.message = message;
        this.username = username;
    }

    public boolean isSuccess() {
        return success;
    }

    public String getMessage() {
        return message;
    }

    public String getUsername() {
        return username;
    }
}
