package com.collegesync.fms.dao;

import com.collegesync.fms.model.Fee;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@Repository
public class FeeDao {

    private final JdbcTemplate jdbcTemplate;

    public FeeDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Fee> rowMapper = new RowMapper<>() {
        @Override
        public Fee mapRow(ResultSet rs, int rowNum) throws SQLException {
            Fee f = new Fee();
            f.setId(rs.getLong("id"));
            f.setStudentId(rs.getString("student_id"));
            try {
                f.setStudentName(rs.getString("student_name"));
            } catch (SQLException ignored) {
                // Not queried or joined
            }
            f.setFeeType(rs.getString("fee_type"));
            f.setAmount(rs.getBigDecimal("amount"));
            f.setDueDate(rs.getString("due_date"));
            f.setPaidDate(rs.getString("paid_date"));
            f.setStatus(rs.getString("status"));
            f.setPaymentMode(rs.getString("payment_mode"));
            f.setTransactionId(rs.getString("transaction_id"));
            return f;
        }
    };

    public List<Fee> findUnpaidByStudentId(String studentId) {
        String sql = "SELECT f.*, s.name as student_name FROM fees f " +
                     "LEFT JOIN students s ON f.student_id = s.unique_id " +
                     "WHERE f.student_id = ? AND (f.status = 'Unpaid' OR f.status = 'Pending Offline') " +
                     "ORDER BY f.due_date ASC";
        return jdbcTemplate.query(sql, rowMapper, studentId);
    }

    public List<Fee> findHistoryByStudentId(String studentId) {
        String sql = "SELECT f.*, s.name as student_name FROM fees f " +
                     "LEFT JOIN students s ON f.student_id = s.unique_id " +
                     "WHERE f.student_id = ? " +
                     "ORDER BY f.id DESC";
        return jdbcTemplate.query(sql, rowMapper, studentId);
    }

    public Optional<Fee> findById(Long id) {
        String sql = "SELECT f.*, s.name as student_name FROM fees f " +
                     "LEFT JOIN students s ON f.student_id = s.unique_id " +
                     "WHERE f.id = ?";
        try {
            Fee f = jdbcTemplate.queryForObject(sql, rowMapper, id);
            return Optional.ofNullable(f);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    public int markPaid(Long feeId, String studentId, String transactionId, String paymentMode) {
        String now = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        String sql = "UPDATE fees SET status = 'Paid', paid_date = ?, transaction_id = ?, payment_mode = ? " +
                     "WHERE id = ? AND student_id = ?";
        return jdbcTemplate.update(sql, now, transactionId, paymentMode, feeId, studentId);
    }

    public int updateStatus(Long feeId, String status) {
        String sql = "UPDATE fees SET status = ? WHERE id = ?";
        return jdbcTemplate.update(sql, status, feeId);
    }

    public int save(Fee f) {
        String sql = "INSERT INTO fees (student_id, fee_type, amount, due_date, status, payment_mode, transaction_id) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?)";
        return jdbcTemplate.update(sql,
                f.getStudentId(),
                f.getFeeType(),
                f.getAmount(),
                f.getDueDate(),
                f.getStatus() != null ? f.getStatus() : "Unpaid",
                f.getPaymentMode(),
                f.getTransactionId()
        );
    }

    public List<Fee> findAll() {
        String sql = "SELECT f.*, s.name as student_name FROM fees f " +
                     "LEFT JOIN students s ON f.student_id = s.unique_id " +
                     "ORDER BY f.id DESC";
        return jdbcTemplate.query(sql, rowMapper);
    }

    public BigDecimal getTotalPaidAmount() {
        String sql = "SELECT SUM(amount) FROM fees WHERE status = 'Paid'";
        try {
            BigDecimal total = jdbcTemplate.queryForObject(sql, BigDecimal.class);
            return total == null ? BigDecimal.ZERO : total;
        } catch (Exception e) {
            return BigDecimal.ZERO;
        }
    }

    public BigDecimal getOfflinePaidAmount() {
        String sql = "SELECT SUM(amount) FROM fees WHERE status = 'Paid' AND (" +
                     "UPPER(payment_mode) = 'CASH_COUNTER' OR " +
                     "UPPER(payment_mode) = 'OFFLINE_TOKEN' OR " +
                     "UPPER(payment_mode) = 'OFFLINE' OR " +
                     "UPPER(payment_mode) LIKE '%CASH%')";
        try {
            BigDecimal total = jdbcTemplate.queryForObject(sql, BigDecimal.class);
            return total == null ? BigDecimal.ZERO : total;
        } catch (Exception e) {
            return BigDecimal.ZERO;
        }
    }

    public BigDecimal getOnlinePaidAmount() {
        String sql = "SELECT SUM(amount) FROM fees WHERE status = 'Paid' AND (" +
                     "UPPER(payment_mode) = 'ONLINE' OR " +
                     "UPPER(payment_mode) LIKE '%UPI%' OR " +
                     "UPPER(payment_mode) LIKE '%CARD%' OR " +
                     "UPPER(payment_mode) LIKE '%NET_BANKING%' OR " +
                     "(payment_mode IS NOT NULL AND UPPER(payment_mode) NOT LIKE '%CASH%' AND UPPER(payment_mode) NOT LIKE '%OFFLINE%'))";
        try {
            BigDecimal total = jdbcTemplate.queryForObject(sql, BigDecimal.class);
            return total == null ? BigDecimal.ZERO : total;
        } catch (Exception e) {
            return BigDecimal.ZERO;
        }
    }

    public BigDecimal getTotalUnpaidAmount() {
        String sql = "SELECT SUM(amount) FROM fees WHERE status = 'Unpaid' OR status = 'Pending Offline'";
        try {
            BigDecimal total = jdbcTemplate.queryForObject(sql, BigDecimal.class);
            return total == null ? BigDecimal.ZERO : total;
        } catch (Exception e) {
            return BigDecimal.ZERO;
        }
    }

    public int countUnpaid() {
        String sql = "SELECT COUNT(*) FROM fees WHERE status = 'Unpaid' OR status = 'Pending Offline'";
        Integer c = jdbcTemplate.queryForObject(sql, Integer.class);
        return c == null ? 0 : c;
    }
}
