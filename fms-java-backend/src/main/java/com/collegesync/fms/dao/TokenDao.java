package com.collegesync.fms.dao;

import com.collegesync.fms.model.OfflineToken;
import com.collegesync.fms.model.TimeSlot;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

@Repository
public class TokenDao {

    private final JdbcTemplate jdbcTemplate;

    public TokenDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<OfflineToken> tokenRowMapper = new RowMapper<>() {
        @Override
        public OfflineToken mapRow(ResultSet rs, int rowNum) throws SQLException {
            OfflineToken t = new OfflineToken();
            t.setId(rs.getLong("id"));
            t.setFeeId(rs.getLong("fee_id"));
            t.setStudentId(rs.getString("student_id"));
            try {
                t.setStudentName(rs.getString("student_name"));
                t.setFeeType(rs.getString("fee_type"));
                t.setAmount(rs.getBigDecimal("amount"));
            } catch (SQLException ignored) {
            }
            t.setToken(rs.getString("token"));
            t.setSlotDate(rs.getString("slot_date"));
            t.setSlotTime(rs.getString("slot_time"));
            t.setCreatedAt(rs.getString("created_at"));
            t.setExpiryDate(rs.getString("expiry_date"));
            t.setStatus(rs.getString("status"));
            return t;
        }
    };

    private final RowMapper<TimeSlot> slotRowMapper = (rs, rowNum) -> {
        TimeSlot ts = new TimeSlot();
        ts.setId(rs.getLong("id"));
        ts.setSlotDate(rs.getString("slot_date"));
        ts.setSlotTime(rs.getString("slot_time"));
        ts.setUsed(rs.getInt("used"));
        ts.setCapacity(rs.getInt("capacity"));
        return ts;
    };

    public Optional<TimeSlot> findAvailableSlot() {
        String sql = "SELECT * FROM time_slots WHERE used < capacity ORDER BY slot_date ASC, id ASC LIMIT 1";
        try {
            TimeSlot slot = jdbcTemplate.queryForObject(sql, slotRowMapper);
            return Optional.ofNullable(slot);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    public void incrementSlotUsed(Long slotId) {
        jdbcTemplate.update("UPDATE time_slots SET used = used + 1 WHERE id = ?", slotId);
    }

    public int saveToken(OfflineToken t) {
        String sql = "INSERT INTO tokens (fee_id, student_id, token, slot_date, slot_time, created_at, expiry_date, status) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        return jdbcTemplate.update(sql,
                t.getFeeId(),
                t.getStudentId(),
                t.getToken(),
                t.getSlotDate(),
                t.getSlotTime(),
                t.getCreatedAt(),
                t.getExpiryDate(),
                t.getStatus() != null ? t.getStatus() : "Pending"
        );
    }

    public Optional<OfflineToken> findById(Long id) {
        String sql = "SELECT t.*, s.name as student_name, f.fee_type, f.amount " +
                     "FROM tokens t " +
                     "JOIN students s ON t.student_id = s.unique_id " +
                     "JOIN fees f ON t.fee_id = f.id " +
                     "WHERE t.id = ?";
        try {
            OfflineToken token = jdbcTemplate.queryForObject(sql, tokenRowMapper, id);
            return Optional.ofNullable(token);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    public List<OfflineToken> findAll() {
        String sql = "SELECT t.*, s.name as student_name, f.fee_type, f.amount " +
                     "FROM tokens t " +
                     "JOIN students s ON t.student_id = s.unique_id " +
                     "JOIN fees f ON t.fee_id = f.id " +
                     "ORDER BY t.id DESC";
        return jdbcTemplate.query(sql, tokenRowMapper);
    }

    public List<OfflineToken> findByStudentId(String studentId) {
        String sql = "SELECT t.*, s.name as student_name, f.fee_type, f.amount " +
                     "FROM tokens t " +
                     "JOIN students s ON t.student_id = s.unique_id " +
                     "JOIN fees f ON t.fee_id = f.id " +
                     "WHERE t.student_id = ? " +
                     "ORDER BY t.id DESC";
        return jdbcTemplate.query(sql, tokenRowMapper, studentId);
    }

    public int updateStatus(Long id, String status) {
        return jdbcTemplate.update("UPDATE tokens SET status = ? WHERE id = ?", status, id);
    }

    public int countPending() {
        Integer c = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM tokens WHERE status = 'Pending'", Integer.class);
        return c == null ? 0 : c;
    }
}
