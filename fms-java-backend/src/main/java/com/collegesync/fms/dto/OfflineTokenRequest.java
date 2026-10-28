package com.collegesync.fms.dto;

public class OfflineTokenRequest {
    private Long feeId;
    private String studentId;

    public OfflineTokenRequest() {}

    public Long getFeeId() { return feeId; }
    public void setFeeId(Long feeId) { this.feeId = feeId; }

    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }
}
