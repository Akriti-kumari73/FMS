package com.collegesync.fms.dto;

public class RegisterStudentRequest {
    private String name;
    private String fatherName;
    private String dob;
    private String semester;
    private String branch;
    private String course;
    private String batch;
    private String email;
    private String password;
    private String courseStatus = "Ongoing";

    public RegisterStudentRequest() {}

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getFatherName() { return fatherName; }
    public void setFatherName(String fatherName) { this.fatherName = fatherName; }

    public String getDob() { return dob; }
    public void setDob(String dob) { this.dob = dob; }

    public String getSemester() { return semester; }
    public void setSemester(String semester) { this.semester = semester; }

    public String getBranch() { return branch; }
    public void setBranch(String branch) { this.branch = branch; }

    public String getCourse() { return course; }
    public void setCourse(String course) { this.course = course; }

    public String getBatch() { return batch; }
    public void setBatch(String batch) { this.batch = batch; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getCourseStatus() { return courseStatus; }
    public void setCourseStatus(String courseStatus) { this.courseStatus = courseStatus; }
}
