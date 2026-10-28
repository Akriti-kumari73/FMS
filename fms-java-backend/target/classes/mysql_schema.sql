-- ====================================================
-- CollegeSync Fees (FMS) MySQL Database Setup Script
-- Database: collegesync_fees
-- ====================================================

CREATE DATABASE IF NOT EXISTS collegesync_fees;
USE collegesync_fees;

-- 1. Students Table
CREATE TABLE IF NOT EXISTS students (
    unique_id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    father_name VARCHAR(150),
    dob VARCHAR(50),
    semester VARCHAR(50),
    branch VARCHAR(100),
    course VARCHAR(100),
    batch VARCHAR(50),
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    course_status VARCHAR(50) DEFAULT 'Ongoing',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. Admins Table
CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 3. Fees Table
CREATE TABLE IF NOT EXISTS fees (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id VARCHAR(50) NOT NULL,
    fee_type VARCHAR(100) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    due_date VARCHAR(50) NOT NULL,
    paid_date VARCHAR(50),
    status VARCHAR(50) DEFAULT 'Unpaid',
    payment_mode VARCHAR(50),
    transaction_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX (student_id),
    INDEX (status)
) ENGINE=InnoDB;

-- 4. Time Slots for Offline Booking
CREATE TABLE IF NOT EXISTS time_slots (
    id INT AUTO_INCREMENT PRIMARY KEY,
    slot_date VARCHAR(50) NOT NULL,
    slot_time VARCHAR(50) NOT NULL,
    used INT DEFAULT 0,
    capacity INT DEFAULT 10
) ENGINE=InnoDB;

-- 5. Offline Tokens Table
CREATE TABLE IF NOT EXISTS tokens (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    fee_id BIGINT NOT NULL,
    student_id VARCHAR(50) NOT NULL,
    token VARCHAR(100) NOT NULL,
    slot_date VARCHAR(50) NOT NULL,
    slot_time VARCHAR(50) NOT NULL,
    created_at VARCHAR(50),
    expiry_date VARCHAR(50),
    status VARCHAR(50) DEFAULT 'Pending',
    INDEX (student_id),
    INDEX (fee_id)
) ENGINE=InnoDB;

-- 6. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id VARCHAR(50) NOT NULL,
    type VARCHAR(100) DEFAULT 'Info',
    message TEXT NOT NULL,
    created_at VARCHAR(50),
    is_read BOOLEAN DEFAULT FALSE,
    INDEX (student_id)
) ENGINE=InnoDB;

-- Default Admin
INSERT INTO admins (id, username, password)
VALUES (1, 'admin', 'admin123')
ON DUPLICATE KEY UPDATE username=VALUES(username);

-- Default Time Slots
INSERT INTO time_slots (id, slot_date, slot_time, used, capacity) VALUES 
(1, '2026-10-24', '10:00 AM - 11:00 AM', 0, 15),
(2, '2026-10-24', '11:30 AM - 12:30 PM', 0, 15),
(3, '2026-10-24', '02:00 PM - 03:00 PM', 0, 15),
(4, '2026-10-25', '10:00 AM - 11:00 AM', 0, 15),
(5, '2026-10-25', '11:30 AM - 12:30 PM', 0, 15),
(6, '2026-10-26', '10:00 AM - 11:00 AM', 0, 15)
ON DUPLICATE KEY UPDATE slot_time=VALUES(slot_time);

-- Demo Students (Ongoing & Completed)
INSERT INTO students (unique_id, name, father_name, dob, semester, branch, course, batch, email, password, course_status) VALUES 
('STU1001', 'Rahul Sharma', 'Mr. Rajesh Sharma', '2003-05-14', '5th', 'CSE', 'B.Tech', '2022-2026', 'rahul.sharma@example.com', 'rahul123', 'Ongoing'),
('STU1002', 'Priya Patel', 'Mr. Suresh Patel', '2004-02-18', '3rd', 'ECE', 'B.Tech', '2023-2027', 'priya.patel@example.com', 'priya123', 'Ongoing'),
('STU1003', 'Amit Kumar Verma', 'Mr. R. K. Verma', '2002-08-15', '8th', 'CSE', 'B.Tech', '2020-2024', 'amit.verma@example.com', 'amit123', 'Completed'),
('STU1004', 'Sneha Singh', 'Mr. Vijay Singh', '2001-11-20', '8th', 'ECE', 'B.Tech', '2020-2024', 'sneha.singh@example.com', 'sneha123', 'Completed')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Demo Fees (Online & Cash Counter Offline Collections)
INSERT INTO fees (id, student_id, fee_type, amount, due_date, paid_date, status, payment_mode, transaction_id) VALUES 
(1, 'STU1001', 'Tuition Fee (Semester 5)', 45000.00, '2026-11-15', NULL, 'Unpaid', NULL, NULL),
(2, 'STU1001', 'Examination Fee', 2500.00, '2026-11-05', NULL, 'Unpaid', NULL, NULL),
(3, 'STU1001', 'Library & Lab Security Fee', 1500.00, '2026-10-10', '2026-10-12', 'Paid', 'ONLINE', 'TXN-ONL-20261012-7819'),
(4, 'STU1001', 'Hostel Security Deposit', 12000.00, '2026-10-14', '2026-10-18', 'Paid', 'CASH_COUNTER', 'TXN-OFF-20261018-TKN401'),
(5, 'STU1002', 'Tuition Fee (Semester 3)', 42000.00, '2026-11-20', NULL, 'Unpaid', NULL, NULL),
(6, 'STU1002', 'Hostel & Mess Fee', 28000.00, '2026-11-10', NULL, 'Unpaid', NULL, NULL),
(7, 'STU1003', 'Final Degree & Convocation Fee', 5000.00, '2024-05-10', '2024-05-12', 'Paid', 'CASH_COUNTER', 'TXN-OFF-20240512-TKN102'),
(8, 'STU1004', 'Final Degree & Convocation Fee', 5000.00, '2024-05-10', '2024-05-15', 'Paid', 'ONLINE', 'TXN-ONL-20240515-9921')
ON DUPLICATE KEY UPDATE status=VALUES(status);
