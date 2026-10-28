package com.collegesync.fms.dto;

import com.collegesync.fms.model.Student;

public class StudentCheckResponse {
    private boolean registered;
    private String message;
    private Student student;

    public StudentCheckResponse() {}

    public StudentCheckResponse(boolean registered, String message, Student student) {
        this.registered = registered;
        this.message = message;
        this.student = student;
    }

    public boolean isRegistered() { return registered; }
    public void setRegistered(boolean registered) { this.registered = registered; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }
}
