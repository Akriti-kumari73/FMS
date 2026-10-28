package com.collegesync.fms.dao;

import com.collegesync.fms.model.Student;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

@Repository
public class StudentDao {

    private final JdbcTemplate jdbcTemplate;

    public StudentDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Student> rowMapper = new RowMapper<>() {
        @Override
        public Student mapRow(ResultSet rs, int rowNum) throws SQLException {
            Student s = new Student();
            s.setUniqueId(rs.getString("unique_id"));
            s.setName(rs.getString("name"));
            s.setFatherName(rs.getString("father_name"));
            s.setDob(rs.getString("dob"));
            s.setSemester(rs.getString("semester"));
            s.setBranch(rs.getString("branch"));
            s.setCourse(rs.getString("course"));
            s.setBatch(rs.getString("batch"));
            s.setEmail(rs.getString("email"));
            s.setPassword(rs.getString("password"));
            try {
                String status = rs.getString("course_status");
                s.setCourseStatus(status != null ? status : "Ongoing");
            } catch (SQLException ignored) {
                s.setCourseStatus("Ongoing");
            }
            return s;
        }
    };

    public Optional<Student> findByEmailOrUniqueId(String query) {
        String sql = "SELECT * FROM students WHERE LOWER(email) = LOWER(?) OR UPPER(unique_id) = UPPER(?) LIMIT 1";
        try {
            Student student = jdbcTemplate.queryForObject(sql, rowMapper, query.trim(), query.trim());
            return Optional.ofNullable(student);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    public Optional<Student> findByUniqueId(String uniqueId) {
        String sql = "SELECT * FROM students WHERE UPPER(unique_id) = UPPER(?)";
        try {
            Student student = jdbcTemplate.queryForObject(sql, rowMapper, uniqueId.trim());
            return Optional.ofNullable(student);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    public Optional<Student> findByEmail(String email) {
        String sql = "SELECT * FROM students WHERE LOWER(email) = LOWER(?)";
        try {
            Student student = jdbcTemplate.queryForObject(sql, rowMapper, email.trim());
            return Optional.ofNullable(student);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    public String generateNextUniqueId() {
        String sql = "SELECT COUNT(*) FROM students";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class);
        int nextNum = (count == null ? 0 : count) + 1001;
        return "STU" + nextNum;
    }

    public int save(Student s) {
        String sql = "INSERT INTO students (unique_id, name, father_name, dob, semester, branch, course, batch, email, password, course_status) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        return jdbcTemplate.update(sql,
                s.getUniqueId(),
                s.getName(),
                s.getFatherName(),
                s.getDob(),
                s.getSemester(),
                s.getBranch(),
                s.getCourse(),
                s.getBatch(),
                s.getEmail().toLowerCase().trim(),
                s.getPassword(),
                s.getCourseStatus() != null ? s.getCourseStatus() : "Ongoing"
        );
    }

    public int update(Student s) {
        String sql = "UPDATE students SET name = ?, father_name = ?, dob = ?, semester = ?, branch = ?, course = ?, batch = ?, course_status = ? " +
                     "WHERE unique_id = ?";
        return jdbcTemplate.update(sql,
                s.getName(),
                s.getFatherName(),
                s.getDob(),
                s.getSemester(),
                s.getBranch(),
                s.getCourse(),
                s.getBatch(),
                s.getCourseStatus() != null ? s.getCourseStatus() : "Ongoing",
                s.getUniqueId()
        );
    }

    public int updateCourseStatus(String uniqueId, String status) {
        String sql = "UPDATE students SET course_status = ? WHERE UPPER(unique_id) = UPPER(?)";
        return jdbcTemplate.update(sql, status, uniqueId.trim());
    }

    public int countCompleted() {
        try {
            Integer c = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM students WHERE LOWER(course_status) = 'completed'", Integer.class);
            return c == null ? 0 : c;
        } catch (Exception e) {
            return 0;
        }
    }

    public List<Student> findCompleted() {
        String sql = "SELECT * FROM students WHERE LOWER(course_status) = 'completed' ORDER BY unique_id DESC";
        return jdbcTemplate.query(sql, rowMapper);
    }

    public List<Student> findAll() {
        String sql = "SELECT * FROM students ORDER BY unique_id ASC";
        return jdbcTemplate.query(sql, rowMapper);
    }

    public List<String> findUniqueIdsByFilter(String filterType, String filterValue) {
        String column;
        switch (filterType.toLowerCase()) {
            case "semester": column = "semester"; break;
            case "branch": column = "branch"; break;
            case "course": column = "course"; break;
            case "batch": column = "batch"; break;
            case "student_id": column = "unique_id"; break;
            default: column = null;
        }

        if (column == null || "all".equalsIgnoreCase(filterType)) {
            String sql = "SELECT unique_id FROM students";
            return jdbcTemplate.queryForList(sql, String.class);
        } else {
            String sql = "SELECT unique_id FROM students WHERE " + column + " = ?";
            return jdbcTemplate.queryForList(sql, String.class, filterValue);
        }
    }

    public int count() {
        Integer c = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM students", Integer.class);
        return c == null ? 0 : c;
    }
}
