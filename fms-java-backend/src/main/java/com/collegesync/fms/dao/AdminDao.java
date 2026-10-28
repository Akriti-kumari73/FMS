package com.collegesync.fms.dao;

import com.collegesync.fms.model.Admin;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public class AdminDao {

    private final JdbcTemplate jdbcTemplate;

    public AdminDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Admin> rowMapper = (rs, rowNum) -> {
        Admin a = new Admin();
        a.setId(rs.getLong("id"));
        a.setUsername(rs.getString("username"));
        a.setPassword(rs.getString("password"));
        return a;
    };

    public Optional<Admin> findByUsername(String username) {
        String sql = "SELECT * FROM admins WHERE username = ?";
        try {
            Admin admin = jdbcTemplate.queryForObject(sql, rowMapper, username.trim());
            return Optional.ofNullable(admin);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    public int save(String username, String password) {
        String sql = "INSERT INTO admins (username, password) VALUES (?, ?)";
        return jdbcTemplate.update(sql, username, password);
    }
}
