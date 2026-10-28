package com.collegesync.fms.controller;

import com.collegesync.fms.dao.FeeDao;
import com.collegesync.fms.dao.StudentDao;
import com.collegesync.fms.dao.TokenDao;
import com.collegesync.fms.dto.ApiResponse;
import com.collegesync.fms.dto.AssignFeeRequest;
import com.collegesync.fms.model.Fee;
import com.collegesync.fms.model.OfflineToken;
import com.collegesync.fms.model.Student;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    private final StudentDao studentDao;
    private final FeeDao feeDao;
    private final TokenDao tokenDao;

    public AdminController(StudentDao studentDao, FeeDao feeDao, TokenDao tokenDao) {
        this.studentDao = studentDao;
        this.feeDao = feeDao;
        this.tokenDao = tokenDao;
    }

    /**
     * Admin Dashboard Metrics Overview
     */
    @GetMapping("/overview")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getOverview() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalStudents", studentDao.count());
        stats.put("totalCollections", feeDao.getTotalPaidAmount());
        stats.put("totalOfflineCollections", feeDao.getOfflinePaidAmount());
        stats.put("totalOnlineCollections", feeDao.getOnlinePaidAmount());
        stats.put("totalUnpaidAmount", feeDao.getTotalUnpaidAmount());
        stats.put("unpaidFeesCount", feeDao.countUnpaid());
        stats.put("pendingTokensCount", tokenDao.countPending());
        stats.put("courseCompletedCount", studentDao.countCompleted());
        return ResponseEntity.ok(ApiResponse.ok("Overview stats fetched", stats));
    }

    /**
     * Get All Students
     */
    @GetMapping("/students")
    public ResponseEntity<ApiResponse<List<Student>>> getAllStudents() {
        List<Student> list = studentDao.findAll();
        // Mask passwords
        list.forEach(s -> s.setPassword(null));
        return ResponseEntity.ok(ApiResponse.ok("Students list fetched", list));
    }

    /**
     * Admin Direct Student Enrollment
     */
    @PostMapping("/students")
    public ResponseEntity<ApiResponse<Student>> addStudent(@RequestBody com.collegesync.fms.dto.RegisterStudentRequest req) {
        if (req.getEmail() == null || req.getEmail().trim().isEmpty() || req.getName() == null || req.getName().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Name and email are required."));
        }
        if (studentDao.findByEmail(req.getEmail().trim()).isPresent()) {
            return ResponseEntity.ok(ApiResponse.error("Student with this email already exists."));
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
        s.setPassword(req.getPassword() != null && !req.getPassword().isEmpty() ? req.getPassword() : "student123");
        s.setCourseStatus(req.getCourseStatus() != null ? req.getCourseStatus() : "Ongoing");
        studentDao.save(s);
        s.setPassword(null);
        return ResponseEntity.ok(ApiResponse.ok("Student enrolled successfully! Unique ID: " + uniqueId, s));
    }

    /**
     * Get All Fee Records
     */
    @GetMapping("/fees")
    public ResponseEntity<ApiResponse<List<Fee>>> getAllFees() {
        List<Fee> fees = feeDao.findAll();
        return ResponseEntity.ok(ApiResponse.ok("Fees list fetched", fees));
    }

    /**
     * Assign Fee (bulk by cohort or individual)
     */
    @PostMapping("/assign-fees")
    public ResponseEntity<ApiResponse<Map<String, Object>>> assignFees(@RequestBody AssignFeeRequest req) {
        if (req.getFeeType() == null || req.getAmount() == null || req.getDueDate() == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Fee type, amount, and due date are required."));
        }

        List<String> studentIds = studentDao.findUniqueIdsByFilter(
                req.getFilterType() != null ? req.getFilterType() : "all",
                req.getFilterValue() != null ? req.getFilterValue() : ""
        );

        if (studentIds.isEmpty()) {
            return ResponseEntity.ok(ApiResponse.error("No students found matching the selected filter criteria."));
        }

        int count = 0;
        for (String stuId : studentIds) {
            Fee fee = new Fee();
            fee.setStudentId(stuId);
            fee.setFeeType(req.getFeeType());
            fee.setAmount(req.getAmount());
            fee.setDueDate(req.getDueDate());
            fee.setStatus("Unpaid");
            feeDao.save(fee);
            count++;
        }

        Map<String, Object> res = new HashMap<>();
        res.put("affectedCount", count);
        return ResponseEntity.ok(ApiResponse.ok("Successfully assigned fee to " + count + " student(s)!", res));
    }

    /**
     * Get All Offline Tokens
     */
    @GetMapping("/tokens")
    public ResponseEntity<ApiResponse<List<OfflineToken>>> getAllTokens() {
        List<OfflineToken> tokens = tokenDao.findAll();
        return ResponseEntity.ok(ApiResponse.ok("Tokens list fetched", tokens));
    }

    /**
     * Approve or Reject an Offline Counter Payment Token
     */
    @PutMapping("/tokens/{tokenId}/status")
    public ResponseEntity<ApiResponse<String>> updateTokenStatus(
            @PathVariable("tokenId") Long tokenId,
            @RequestParam("status") String status) {

        Optional<OfflineToken> tokenOpt = tokenDao.findById(tokenId);
        if (tokenOpt.isEmpty()) {
            return ResponseEntity.ok(ApiResponse.error("Token not found."));
        }

        OfflineToken token = tokenOpt.get();
        String validStatus = "Approved".equalsIgnoreCase(status) ? "Approved" : "Rejected";
        tokenDao.updateStatus(tokenId, validStatus);

        if ("Approved".equalsIgnoreCase(validStatus)) {
            // When admin approves cash payment at counter, mark fee as Paid
            String datePart = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
            String txnId = "TXN-OFF-" + datePart + "-" + token.getToken();
            feeDao.markPaid(token.getFeeId(), token.getStudentId(), txnId, "CASH_COUNTER");
            return ResponseEntity.ok(ApiResponse.ok("Token approved! Payment of ₹" + token.getAmount() + " recorded as Paid at Accounts Counter."));
        } else {
            // If rejected, set fee status back to Unpaid
            feeDao.updateStatus(token.getFeeId(), "Unpaid");
            return ResponseEntity.ok(ApiResponse.ok("Token rejected. Fee marked back as Unpaid."));
        }
    }

    /**
     * Get Course Completed Students
     */
    @GetMapping("/students/completed")
    public ResponseEntity<ApiResponse<List<Student>>> getCompletedStudents() {
        List<Student> list = studentDao.findCompleted();
        list.forEach(s -> s.setPassword(null));
        return ResponseEntity.ok(ApiResponse.ok("Completed students fetched", list));
    }

    /**
     * Update Student Course Status (e.g. "Completed" or "Ongoing")
     */
    @PutMapping("/students/{studentId}/course-status")
    public ResponseEntity<ApiResponse<String>> updateStudentCourseStatus(
            @PathVariable("studentId") String studentId,
            @RequestParam("status") String status) {
        String safeStatus = "Completed".equalsIgnoreCase(status) ? "Completed" : "Ongoing";
        int updated = studentDao.updateCourseStatus(studentId, safeStatus);
        if (updated > 0) {
            return ResponseEntity.ok(ApiResponse.ok("Student " + studentId + " course status updated to: " + safeStatus));
        } else {
            return ResponseEntity.ok(ApiResponse.error("Student with ID " + studentId + " not found."));
        }
    }
}
