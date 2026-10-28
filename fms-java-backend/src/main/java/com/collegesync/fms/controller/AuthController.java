package com.collegesync.fms.controller;

import com.collegesync.fms.dao.AdminDao;
import com.collegesync.fms.dao.FeeDao;
import com.collegesync.fms.dao.StudentDao;
import com.collegesync.fms.dto.ApiResponse;
import com.collegesync.fms.dto.LoginRequest;
import com.collegesync.fms.dto.RegisterStudentRequest;
import com.collegesync.fms.dto.StudentCheckResponse;
import com.collegesync.fms.model.Admin;
import com.collegesync.fms.model.Fee;
import com.collegesync.fms.model.Student;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final StudentDao studentDao;
    private final AdminDao adminDao;
    private final FeeDao feeDao;

    public AuthController(StudentDao studentDao, AdminDao adminDao, FeeDao feeDao) {
        this.studentDao = studentDao;
        this.adminDao = adminDao;
        this.feeDao = feeDao;
    }

    /**
     * Unified Login for both Admin and Student/User
     * If user is not registered, informs client so it can seamlessly direct to Registration!
     */
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<java.util.Map<String, Object>>> unifiedLogin(@RequestBody LoginRequest req) {
        if (req.getIdentifier() == null || req.getPassword() == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Identifier and password are required"));
        }

        String id = req.getIdentifier().trim();
        String pwd = req.getPassword();
        String role = req.getUserType(); // "admin" or "student" or null

        // 1. Check Admin login if explicitly specified or if username is admin
        if ("admin".equalsIgnoreCase(role) || "admin".equalsIgnoreCase(id)) {
            Optional<Admin> adminOpt = adminDao.findByUsername(id);
            if (adminOpt.isPresent()) {
                if (adminOpt.get().getPassword().equals(pwd)) {
                    java.util.Map<String, Object> map = new java.util.HashMap<>();
                    map.put("role", "admin");
                    map.put("user", new Admin(adminOpt.get().getId(), adminOpt.get().getUsername(), null));
                    return ResponseEntity.ok(ApiResponse.ok("Admin login successful!", map));
                } else {
                    return ResponseEntity.ok(ApiResponse.error("Incorrect admin password."));
                }
            } else if ("admin".equalsIgnoreCase(role)) {
                return ResponseEntity.ok(ApiResponse.error("Admin user not found."));
            }
        }

        // 2. Check Student/User
        Optional<Student> studentOpt = studentDao.findByEmailOrUniqueId(id);
        if (studentOpt.isEmpty()) {
            java.util.Map<String, Object> notRegMap = new java.util.HashMap<>();
            notRegMap.put("notRegistered", true);
            notRegMap.put("identifier", id);
            return ResponseEntity.ok(new ApiResponse<>(
                    false,
                    "Account not found for '" + id + "'! You are not registered yet. Please complete registration first.",
                    notRegMap
            ));
        }

        Student s = studentOpt.get();
        if (!s.getPassword().equals(pwd)) {
            return ResponseEntity.ok(ApiResponse.error("Incorrect password. Please try again."));
        }

        Student safe = new Student(s.getUniqueId(), s.getName(), s.getFatherName(), s.getDob(),
                s.getSemester(), s.getBranch(), s.getCourse(), s.getBatch(), s.getEmail(), null, s.getCourseStatus());

        java.util.Map<String, Object> map = new java.util.HashMap<>();
        map.put("role", "student");
        map.put("user", safe);
        return ResponseEntity.ok(ApiResponse.ok("Login successful!", map));
    }

    /**
     * Requirement: Check if student is already registered or not.
     */
    @GetMapping("/check-student")
    public ResponseEntity<StudentCheckResponse> checkStudentRegistration(@RequestParam("query") String query) {
        if (query == null || query.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(new StudentCheckResponse(false, "Please provide Student Roll No, ID, or Email.", null));
        }

        Optional<Student> studentOpt = studentDao.findByEmailOrUniqueId(query.trim());
        if (studentOpt.isPresent()) {
            Student s = studentOpt.get();
            // Don't expose password in check response
            Student safeStudent = new Student(s.getUniqueId(), s.getName(), s.getFatherName(), s.getDob(),
                    s.getSemester(), s.getBranch(), s.getCourse(), s.getBatch(), s.getEmail(), null);
            return ResponseEntity.ok(new StudentCheckResponse(
                    true,
                    "Student found: " + s.getName() + " (" + s.getUniqueId() + "). Please enter password to login.",
                    safeStudent
            ));
        } else {
            return ResponseEntity.ok(new StudentCheckResponse(
                    false,
                    "No student found with '" + query + "'. Please register first to continue.",
                    null
            ));
        }
    }

    /**
     * Student Login
     */
    @PostMapping("/student-login")
    public ResponseEntity<ApiResponse<Student>> studentLogin(@RequestBody LoginRequest req) {
        if (req.getIdentifier() == null || req.getPassword() == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Identifier and password are required"));
        }

        Optional<Student> studentOpt = studentDao.findByEmailOrUniqueId(req.getIdentifier().trim());
        if (studentOpt.isEmpty()) {
            return ResponseEntity.ok(ApiResponse.error("Student not found. Please register first."));
        }

        Student s = studentOpt.get();
        if (!s.getPassword().equals(req.getPassword())) {
            return ResponseEntity.ok(ApiResponse.error("Incorrect password. Please try again."));
        }

        // Mask password
        Student safe = new Student(s.getUniqueId(), s.getName(), s.getFatherName(), s.getDob(),
                s.getSemester(), s.getBranch(), s.getCourse(), s.getBatch(), s.getEmail(), null, s.getCourseStatus());

        return ResponseEntity.ok(ApiResponse.ok("Login successful!", safe));
    }

    /**
     * Student Registration
     */
    @PostMapping("/student-register")
    public ResponseEntity<ApiResponse<Student>> registerStudent(@RequestBody RegisterStudentRequest req) {
        if (req.getEmail() == null || req.getEmail().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Email is required"));
        }
        if (req.getName() == null || req.getName().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Name is required"));
        }
        if (req.getPassword() == null || req.getPassword().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Password is required"));
        }

        // Check if email already registered
        if (studentDao.findByEmail(req.getEmail()).isPresent()) {
            return ResponseEntity.ok(ApiResponse.error("This email is already registered! Please login instead."));
        }

        String uniqueId = studentDao.generateNextUniqueId();

        Student s = new Student();
        s.setUniqueId(uniqueId);
        s.setName(req.getName().trim());
        s.setFatherName(req.getFatherName());
        s.setDob(req.getDob());
        s.setSemester(req.getSemester() != null ? req.getSemester() : "1st");
        s.setBranch(req.getBranch() != null ? req.getBranch() : "CSE");
        s.setCourse(req.getCourse() != null ? req.getCourse() : "B.Tech");
        s.setBatch(req.getBatch() != null ? req.getBatch() : "2024-2028");
        s.setEmail(req.getEmail().trim().toLowerCase());
        s.setPassword(req.getPassword());
        s.setCourseStatus(req.getCourseStatus() != null ? req.getCourseStatus() : "Ongoing");

        studentDao.save(s);

        // Assign standard semester tuition fee and exam fee for new student
        Fee tuition = new Fee();
        tuition.setStudentId(uniqueId);
        tuition.setFeeType("Semester Tuition Fee (" + s.getSemester() + ")");
        tuition.setAmount(new BigDecimal("45000.00"));
        tuition.setDueDate(LocalDate.now().plusDays(30).toString());
        tuition.setStatus("Unpaid");
        feeDao.save(tuition);

        Fee exam = new Fee();
        exam.setStudentId(uniqueId);
        exam.setFeeType("University Examination Fee");
        exam.setAmount(new BigDecimal("2500.00"));
        exam.setDueDate(LocalDate.now().plusDays(15).toString());
        exam.setStatus("Unpaid");
        feeDao.save(exam);

        Student safe = new Student(s.getUniqueId(), s.getName(), s.getFatherName(), s.getDob(),
                s.getSemester(), s.getBranch(), s.getCourse(), s.getBatch(), s.getEmail(), null, s.getCourseStatus());

        return ResponseEntity.ok(ApiResponse.ok("Registration successful! Your Unique Student ID is: " + uniqueId, safe));
    }

    /**
     * Admin Login
     */
    @PostMapping("/admin-login")
    public ResponseEntity<ApiResponse<Admin>> adminLogin(@RequestBody LoginRequest req) {
        if (req.getIdentifier() == null || req.getPassword() == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Username and password are required"));
        }

        Optional<Admin> adminOpt = adminDao.findByUsername(req.getIdentifier().trim());
        if (adminOpt.isEmpty()) {
            return ResponseEntity.ok(ApiResponse.error("Admin user not found."));
        }

        Admin a = adminOpt.get();
        if (!a.getPassword().equals(req.getPassword())) {
            return ResponseEntity.ok(ApiResponse.error("Invalid admin credentials."));
        }

        Admin safe = new Admin(a.getId(), a.getUsername(), null);
        return ResponseEntity.ok(ApiResponse.ok("Admin login successful!", safe));
    }
}
