package com.collegesync.fms.model;

public class TimeSlot {
    private Long id;
    private String slotDate;
    private String slotTime;
    private int used;
    private int capacity;

    public TimeSlot() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getSlotDate() { return slotDate; }
    public void setSlotDate(String slotDate) { this.slotDate = slotDate; }

    public String getSlotTime() { return slotTime; }
    public void setSlotTime(String slotTime) { this.slotTime = slotTime; }

    public int getUsed() { return used; }
    public void setUsed(int used) { this.used = used; }

    public int getCapacity() { return capacity; }
    public void setCapacity(int capacity) { this.capacity = capacity; }
}
