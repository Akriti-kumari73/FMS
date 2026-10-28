package com.collegesync.fms.model;

import java.math.BigDecimal;

public class OfflineToken {
    private Long id;
    private Long feeId;
    private String studentId;
    private String studentName;
    private String feeType;
    private BigDecimal amount;
    private String token;
    private String slotDate;
    private String slotTime;
    private String createdAt;
    private String expiryDate;
    private String status; // "Pending", "Approved", "Rejected"

    public OfflineToken() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getFeeId() { return feeId; }
    public void setFeeId(Long feeId) { this.feeId = feeId; }

    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getFeeType() { return feeType; }
    public void setFeeType(String feeType) { this.feeType = feeType; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getSlotDate() { return slotDate; }
    public void setSlotDate(String slotDate) { this.slotDate = slotDate; }

    public String getSlotTime() { return slotTime; }
    public void setSlotTime(String slotTime) { this.slotTime = slotTime; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }

    public String getExpiryDate() { return expiryDate; }
    public void setExpiryDate(String expiryDate) { this.expiryDate = expiryDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
