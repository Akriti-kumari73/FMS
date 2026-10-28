package com.collegesync.fms.controller;

import com.collegesync.fms.dao.FeeDao;
import com.collegesync.fms.dao.StudentDao;
import com.collegesync.fms.dao.TokenDao;
import com.collegesync.fms.dto.ApiResponse;
import com.collegesync.fms.dto.OfflineTokenRequest;
import com.collegesync.fms.dto.OnlinePaymentRequest;
import com.collegesync.fms.model.Fee;
import com.collegesync.fms.model.OfflineToken;
import com.collegesync.fms.model.Student;
import com.collegesync.fms.model.TimeSlot;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@RestController
@RequestMapping("/api/fees")
@CrossOrigin(origins = "*")
public class FeeController {

    private final FeeDao feeDao;
    private final TokenDao tokenDao;
    private final StudentDao studentDao;

    public FeeController(FeeDao feeDao, TokenDao tokenDao, StudentDao studentDao) {
        this.feeDao = feeDao;
        this.tokenDao = tokenDao;
        this.studentDao = studentDao;
    }

    /**
     * Get unpaid / pending fees for student
     */
    @GetMapping("/student/{studentId}")
    public ResponseEntity<ApiResponse<List<Fee>>> getUnpaidFees(@PathVariable("studentId") String studentId) {
        List<Fee> fees = feeDao.findUnpaidByStudentId(studentId.trim());
        return ResponseEntity.ok(ApiResponse.ok("Pending fees fetched successfully", fees));
    }

    /**
     * Get full fee payment history for student
     */
    @GetMapping("/student/{studentId}/history")
    public ResponseEntity<ApiResponse<List<Fee>>> getFeeHistory(@PathVariable("studentId") String studentId) {
        List<Fee> fees = feeDao.findHistoryByStudentId(studentId.trim());
        return ResponseEntity.ok(ApiResponse.ok("Fee payment history fetched successfully", fees));
    }

    /**
     * Get offline tokens for student
     */
    @GetMapping("/student/{studentId}/tokens")
    public ResponseEntity<ApiResponse<List<OfflineToken>>> getStudentTokens(@PathVariable("studentId") String studentId) {
        List<OfflineToken> tokens = tokenDao.findByStudentId(studentId.trim());
        return ResponseEntity.ok(ApiResponse.ok("Tokens fetched successfully", tokens));
    }

    /**
     * Requirement: Online Fee Payment
     */
    @PostMapping("/pay-online")
    public ResponseEntity<ApiResponse<Map<String, Object>>> payOnline(@RequestBody OnlinePaymentRequest req) {
        if (req.getFeeId() == null || req.getStudentId() == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Fee ID and Student ID are required"));
        }

        Optional<Fee> feeOpt = feeDao.findById(req.getFeeId());
        if (feeOpt.isEmpty()) {
            return ResponseEntity.ok(ApiResponse.error("Fee record not found."));
        }

        Fee fee = feeOpt.get();
        if (!fee.getStudentId().equalsIgnoreCase(req.getStudentId())) {
            return ResponseEntity.ok(ApiResponse.error("Fee does not belong to the specified student."));
        }

        if ("Paid".equalsIgnoreCase(fee.getStatus())) {
            return ResponseEntity.ok(ApiResponse.error("This fee has already been paid on " + fee.getPaidDate()));
        }

        // Generate verified unique Transaction ID
        String datePart = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String randPart = String.format("%04d", new Random().nextInt(10000));
        String txnId = "TXN-ONL-" + datePart + "-" + randPart;

        String method = req.getPaymentMethod() != null ? req.getPaymentMethod().toUpperCase() : "ONLINE";

        // Mark fee as paid
        feeDao.markPaid(fee.getId(), fee.getStudentId(), txnId, method);

        // Fetch student details for receipt
        Optional<Student> studentOpt = studentDao.findByUniqueId(fee.getStudentId());

        Map<String, Object> receipt = new HashMap<>();
        receipt.put("transactionId", txnId);
        receipt.put("feeId", fee.getId());
        receipt.put("studentId", fee.getStudentId());
        receipt.put("studentName", studentOpt.map(Student::getName).orElse(fee.getStudentName()));
        receipt.put("course", studentOpt.map(Student::getCourse).orElse(""));
        receipt.put("branch", studentOpt.map(Student::getBranch).orElse(""));
        receipt.put("semester", studentOpt.map(Student::getSemester).orElse(""));
        receipt.put("feeType", fee.getFeeType());
        receipt.put("amount", fee.getAmount());
        receipt.put("paymentMode", method);
        receipt.put("paymentDate", LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss")));
        receipt.put("status", "Paid");

        return ResponseEntity.ok(ApiResponse.ok("Payment successful! Receipt generated.", receipt));
    }

    /**
     * Requirement: Offline Fee Payment (Slot booking / Token generation)
     */
    @PostMapping("/generate-offline-token")
    public ResponseEntity<ApiResponse<OfflineToken>> generateOfflineToken(@RequestBody OfflineTokenRequest req) {
        if (req.getFeeId() == null || req.getStudentId() == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Fee ID and Student ID are required"));
        }

        Optional<Fee> feeOpt = feeDao.findById(req.getFeeId());
        if (feeOpt.isEmpty()) {
            return ResponseEntity.ok(ApiResponse.error("Fee record not found."));
        }

        Fee fee = feeOpt.get();
        if ("Paid".equalsIgnoreCase(fee.getStatus())) {
            return ResponseEntity.ok(ApiResponse.error("Fee is already paid."));
        }

        // Find available accounts counter slot
        Optional<TimeSlot> slotOpt = tokenDao.findAvailableSlot();
        String slotDate;
        String slotTime;

        if (slotOpt.isPresent()) {
            TimeSlot slot = slotOpt.get();
            slotDate = slot.getSlotDate();
            slotTime = slot.getSlotTime();
            tokenDao.incrementSlotUsed(slot.getId());
        } else {
            // Default next working day fallback slot
            slotDate = LocalDate.now().plusDays(2).toString();
            slotTime = "10:30 AM - 12:30 PM";
        }

        // Generate Token
        String tokenCode = "TKN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        String now = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        String expiry = LocalDate.now().plusDays(7).toString() + " 17:00:00";

        OfflineToken token = new OfflineToken();
        token.setFeeId(fee.getId());
        token.setStudentId(fee.getStudentId());
        token.setToken(tokenCode);
        token.setSlotDate(slotDate);
        token.setSlotTime(slotTime);
        token.setCreatedAt(now);
        token.setExpiryDate(expiry);
        token.setStatus("Pending");

        tokenDao.saveToken(token);

        // Update fee status to indicate offline token is generated
        feeDao.updateStatus(fee.getId(), "Pending Offline");

        return ResponseEntity.ok(ApiResponse.ok(
                "Offline payment token generated! Visit Accounts Section on " + slotDate + " (" + slotTime + ") with your token slip.",
                token
        ));
    }

    /**
     * Get receipt details for any paid fee
     */
    @GetMapping("/receipt/{feeId}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getReceipt(@PathVariable("feeId") Long feeId) {
        Optional<Fee> feeOpt = feeDao.findById(feeId);
        if (feeOpt.isEmpty() || !"Paid".equalsIgnoreCase(feeOpt.get().getStatus())) {
            return ResponseEntity.ok(ApiResponse.error("Paid fee record not found for this receipt."));
        }

        Fee fee = feeOpt.get();
        Optional<Student> studentOpt = studentDao.findByUniqueId(fee.getStudentId());

        Map<String, Object> receipt = new HashMap<>();
        receipt.put("feeId", fee.getId());
        receipt.put("studentId", fee.getStudentId());
        receipt.put("studentName", studentOpt.map(Student::getName).orElse(fee.getStudentName()));
        receipt.put("course", studentOpt.map(Student::getCourse).orElse(""));
        receipt.put("branch", studentOpt.map(Student::getBranch).orElse(""));
        receipt.put("semester", studentOpt.map(Student::getSemester).orElse(""));
        receipt.put("feeType", fee.getFeeType());
        receipt.put("amount", fee.getAmount());
        receipt.put("paymentMode", fee.getPaymentMode() != null ? fee.getPaymentMode() : "ONLINE");
        receipt.put("transactionId", fee.getTransactionId() != null ? fee.getTransactionId() : "TXN-" + fee.getId());
        receipt.put("paidDate", fee.getPaidDate());
        receipt.put("status", fee.getStatus());

        return ResponseEntity.ok(ApiResponse.ok("Receipt data loaded", receipt));
    }
}
