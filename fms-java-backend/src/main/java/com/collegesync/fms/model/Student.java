package com.collegesync.fms.model;

public class Student {
    private String uniqueId;
    private String name;
    private String fatherName;
    private String dob;
    private String semester;
    private String branch;
    private String course;
    private String batch;
    private String email;
    private String password;
    private String courseStatus = "Ongoing"; // "Ongoing" or "Completed"

    public Student() {}

    public Student(String uniqueId, String name, String fatherName, String dob,
                   String semester, String branch, String course, String batch,
                   String email, String password) {
        this(uniqueId, name, fatherName, dob, semester, branch, course, batch, email, password, "Ongoing");
    }

    public Student(String uniqueId, String name, String fatherName, String dob,
                   String semester, String branch, String course, String batch,
                   String email, String password, String courseStatus) {
        this.uniqueId = uniqueId;
        this.name = name;
        this.fatherName = fatherName;
        this.dob = dob;
        this.semester = semester;
        this.branch = branch;
        this.course = course;
        this.batch = batch;
        this.email = email;
        this.password = password;
        this.courseStatus = (courseStatus != null && !courseStatus.trim().isEmpty()) ? courseStatus : "Ongoing";
    }

    public String getUniqueId() { return uniqueId; }
    public void setUniqueId(String uniqueId) { this.uniqueId = uniqueId; }

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
