package com.collegesync.fms.dto;

public class LoginRequest {
    private String identifier; // email or unique_id or username
    private String password;
    private String userType;   // "student" or "admin"

    public LoginRequest() {}

    public String getIdentifier() { return identifier; }
    public void setIdentifier(String identifier) { this.identifier = identifier; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getUserType() { return userType; }
    public void setUserType(String userType) { this.userType = userType; }
}
