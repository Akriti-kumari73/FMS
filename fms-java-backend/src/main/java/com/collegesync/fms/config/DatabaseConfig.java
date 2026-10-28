package com.collegesync.fms.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.springframework.jdbc.datasource.init.ResourceDatabasePopulator;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.DriverManager;

@Configuration
public class DatabaseConfig {

    private static final Logger log = LoggerFactory.getLogger(DatabaseConfig.class);

    @Value("${spring.datasource.mysql.url:jdbc:mysql://localhost:3306/collegesync_fees?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC}")
    private String mysqlUrl;

    @Value("${spring.datasource.mysql.username:root}")
    private String mysqlUsername;

    @Value("${spring.datasource.mysql.password:}")
    private String mysqlPassword;

    @Bean
    @Primary
    public DataSource dataSource() {
        // Try connecting to MySQL first
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            try (Connection conn = DriverManager.getConnection(mysqlUrl, mysqlUsername, mysqlPassword)) {
                log.info("SUCCESS: Connected to MySQL Database at localhost:3306 (collegesync_fees)");
                DriverManagerDataSource ds = new DriverManagerDataSource();
                ds.setDriverClassName("com.mysql.cj.jdbc.Driver");
                ds.setUrl(mysqlUrl);
                ds.setUsername(mysqlUsername);
                ds.setPassword(mysqlPassword);
                
                // Populate schema if needed
                initSchema(ds, "mysql_schema.sql");
                return ds;
            }
        } catch (Exception e) {
            log.warn("MySQL not reachable on port 3306 ({}: {}).", e.getClass().getSimpleName(), e.getMessage());
            log.info("Switching seamlessly to embedded in-memory database with schema.sql so you can run and test immediately!");
        }

        // Fallback to in-memory H2 with MySQL mode
        DriverManagerDataSource h2Ds = new DriverManagerDataSource();
        h2Ds.setDriverClassName("org.h2.Driver");
        h2Ds.setUrl("jdbc:h2:mem:collegesync_fees;DB_CLOSE_DELAY=-1;MODE=MySQL;DATABASE_TO_LOWER=TRUE");
        h2Ds.setUsername("sa");
        h2Ds.setPassword("");

        initSchema(h2Ds, "schema.sql");
        return h2Ds;
    }

    private void initSchema(DataSource ds, String scriptName) {
        try {
            ResourceDatabasePopulator populator = new ResourceDatabasePopulator();
            populator.addScript(new ClassPathResource(scriptName));
            populator.setContinueOnError(true);
            populator.execute(ds);
            log.info("Database schema & seed data initialized successfully using {}", scriptName);
        } catch (Exception ex) {
            log.warn("Schema initialization notice: {}", ex.getMessage());
        }
    }
}
