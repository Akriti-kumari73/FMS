package com.collegesync.fms.dto;

import java.math.BigDecimal;

public class AssignFeeRequest {
    private String filterType; // "all", "semester", "branch", "course", "batch", "student_id"
    private String filterValue;
    private String feeType;
    private BigDecimal amount;
    private String dueDate;

    public AssignFeeRequest() {}

    public String getFilterType() { return filterType; }
    public void setFilterType(String filterType) { this.filterType = filterType; }

    public String getFilterValue() { return filterValue; }
    public void setFilterValue(String filterValue) { this.filterValue = filterValue; }

    public String getFeeType() { return feeType; }
    public void setFeeType(String feeType) { this.feeType = feeType; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public String getDueDate() { return dueDate; }
    public void setDueDate(String dueDate) { this.dueDate = dueDate; }
}
