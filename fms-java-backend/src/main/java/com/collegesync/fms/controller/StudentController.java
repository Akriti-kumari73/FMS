package com.collegesync.fms.controller;

import com.collegesync.fms.dao.StudentDao;
import com.collegesync.fms.dto.ApiResponse;
import com.collegesync.fms.model.Student;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/student")
@CrossOrigin(origins = "*")
public class StudentController {

    private final StudentDao studentDao;

    public StudentController(StudentDao studentDao) {
        this.studentDao = studentDao;
    }

    /**
     * Get Student Profile Details
     */
    @GetMapping("/{studentId}")
    public ResponseEntity<ApiResponse<Student>> getProfile(@PathVariable("studentId") String studentId) {
        Optional<Student> studentOpt = studentDao.findByUniqueId(studentId.trim());
        if (studentOpt.isEmpty()) {
            return ResponseEntity.ok(ApiResponse.error("Student profile not found."));
        }
        Student s = studentOpt.get();
        // Mask password
        s.setPassword(null);
        return ResponseEntity.ok(ApiResponse.ok("Profile loaded successfully", s));
    }

    /**
     * Update Student Profile
     */
    @PutMapping("/{studentId}")
    public ResponseEntity<ApiResponse<Student>> updateProfile(
            @PathVariable("studentId") String studentId,
            @RequestBody Student req) {

        Optional<Student> studentOpt = studentDao.findByUniqueId(studentId.trim());
        if (studentOpt.isEmpty()) {
            return ResponseEntity.ok(ApiResponse.error("Student not found."));
        }

        Student s = studentOpt.get();
        if (req.getName() != null && !req.getName().trim().isEmpty()) s.setName(req.getName().trim());
        if (req.getFatherName() != null) s.setFatherName(req.getFatherName().trim());
        if (req.getDob() != null) s.setDob(req.getDob());
        if (req.getSemester() != null) s.setSemester(req.getSemester());
        if (req.getBranch() != null) s.setBranch(req.getBranch().trim());
        if (req.getCourse() != null) s.setCourse(req.getCourse().trim());
        if (req.getBatch() != null) s.setBatch(req.getBatch().trim());
        if (req.getCourseStatus() != null) s.setCourseStatus(req.getCourseStatus().trim());

        studentDao.update(s);
        s.setPassword(null);

        return ResponseEntity.ok(ApiResponse.ok("Student profile updated successfully!", s));
    }
}
