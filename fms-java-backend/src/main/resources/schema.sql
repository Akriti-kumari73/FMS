-- CollegeSync Fees Management System (FMS) Schema
-- Compatible with MySQL/MariaDB & H2

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
);

CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS time_slots (
    id INT AUTO_INCREMENT PRIMARY KEY,
    slot_date VARCHAR(50) NOT NULL,
    slot_time VARCHAR(50) NOT NULL,
    used INT DEFAULT 0,
    capacity INT DEFAULT 10
);

CREATE TABLE IF NOT EXISTS tokens (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    fee_id BIGINT NOT NULL,
    student_id VARCHAR(50) NOT NULL,
    token VARCHAR(100) NOT NULL,
    slot_date VARCHAR(50) NOT NULL,
    slot_time VARCHAR(50) NOT NULL,
    created_at VARCHAR(50),
    expiry_date VARCHAR(50),
    status VARCHAR(50) DEFAULT 'Pending'
);

CREATE TABLE IF NOT EXISTS notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id VARCHAR(50) NOT NULL,
    type VARCHAR(100) DEFAULT 'Info',
    message TEXT NOT NULL,
    created_at VARCHAR(50),
    is_read BOOLEAN DEFAULT FALSE
);

-- Seed Default Admin if not exists
MERGE INTO admins (id, username, password) KEY(id) VALUES (1, 'admin', 'admin123');

-- Seed Sample Time Slots for offline counter booking
MERGE INTO time_slots (id, slot_date, slot_time, used, capacity) KEY(id) VALUES (1, '2026-10-24', '10:00 AM - 11:00 AM', 0, 15);
MERGE INTO time_slots (id, slot_date, slot_time, used, capacity) KEY(id) VALUES (2, '2026-10-24', '11:30 AM - 12:30 PM', 0, 15);
MERGE INTO time_slots (id, slot_date, slot_time, used, capacity) KEY(id) VALUES (3, '2026-10-24', '02:00 PM - 03:00 PM', 0, 15);
MERGE INTO time_slots (id, slot_date, slot_time, used, capacity) KEY(id) VALUES (4, '2026-10-25', '10:00 AM - 11:00 AM', 0, 15);
MERGE INTO time_slots (id, slot_date, slot_time, used, capacity) KEY(id) VALUES (5, '2026-10-25', '11:30 AM - 12:30 PM', 0, 15);
MERGE INTO time_slots (id, slot_date, slot_time, used, capacity) KEY(id) VALUES (6, '2026-10-26', '10:00 AM - 11:00 AM', 0, 15);

-- Seed Sample Demo Students for quick testing
MERGE INTO students (unique_id, name, father_name, dob, semester, branch, course, batch, email, password, course_status) KEY(unique_id) 
VALUES ('STU1001', 'Rahul Sharma', 'Mr. Rajesh Sharma', '2003-05-14', '5th', 'CSE', 'B.Tech', '2022-2026', 'rahul.sharma@example.com', 'rahul123', 'Ongoing');

MERGE INTO students (unique_id, name, father_name, dob, semester, branch, course, batch, email, password, course_status) KEY(unique_id) 
VALUES ('STU1002', 'Priya Patel', 'Mr. Suresh Patel', '2004-02-18', '3rd', 'ECE', 'B.Tech', '2023-2027', 'priya.patel@example.com', 'priya123', 'Ongoing');

-- Seed Sample Course Completed Students ("kiska course complete ho gaya")
MERGE INTO students (unique_id, name, father_name, dob, semester, branch, course, batch, email, password, course_status) KEY(unique_id) 
VALUES ('STU1003', 'Amit Kumar Verma', 'Mr. R. K. Verma', '2002-08-15', '8th', 'CSE', 'B.Tech', '2020-2024', 'amit.verma@example.com', 'amit123', 'Completed');

MERGE INTO students (unique_id, name, father_name, dob, semester, branch, course, batch, email, password, course_status) KEY(unique_id) 
VALUES ('STU1004', 'Sneha Singh', 'Mr. Vijay Singh', '2001-11-20', '8th', 'ECE', 'B.Tech', '2020-2024', 'sneha.singh@example.com', 'sneha123', 'Completed');

-- Seed Sample Fees for STU1001 (Ongoing student)
MERGE INTO fees (id, student_id, fee_type, amount, due_date, paid_date, status, payment_mode, transaction_id) KEY(id)
VALUES (1, 'STU1001', 'Tuition Fee (Semester 5)', 45000.00, '2026-11-15', NULL, 'Unpaid', NULL, NULL);

MERGE INTO fees (id, student_id, fee_type, amount, due_date, paid_date, status, payment_mode, transaction_id) KEY(id)
VALUES (2, 'STU1001', 'Examination Fee', 2500.00, '2026-11-05', NULL, 'Unpaid', NULL, NULL);

MERGE INTO fees (id, student_id, fee_type, amount, due_date, paid_date, status, payment_mode, transaction_id) KEY(id)
VALUES (3, 'STU1001', 'Library & Lab Security Fee', 1500.00, '2026-10-10', '2026-10-12', 'Paid', 'ONLINE', 'TXN-ONL-20261012-7819');

MERGE INTO fees (id, student_id, fee_type, amount, due_date, paid_date, status, payment_mode, transaction_id) KEY(id)
VALUES (4, 'STU1001', 'Hostel Security Deposit', 12000.00, '2026-10-14', '2026-10-18', 'Paid', 'CASH_COUNTER', 'TXN-OFF-20261018-TKN401');

-- Seed Sample Fees for STU1002 (Ongoing student)
MERGE INTO fees (id, student_id, fee_type, amount, due_date, paid_date, status, payment_mode, transaction_id) KEY(id)
VALUES (5, 'STU1002', 'Tuition Fee (Semester 3)', 42000.00, '2026-11-20', NULL, 'Unpaid', NULL, NULL);

MERGE INTO fees (id, student_id, fee_type, amount, due_date, paid_date, status, payment_mode, transaction_id) KEY(id)
VALUES (6, 'STU1002', 'Hostel & Mess Fee', 28000.00, '2026-11-10', NULL, 'Unpaid', NULL, NULL);

-- Seed Sample Fees for STU1003 & STU1004 (Completed students - paid final clearance)
MERGE INTO fees (id, student_id, fee_type, amount, due_date, paid_date, status, payment_mode, transaction_id) KEY(id)
VALUES (7, 'STU1003', 'Final Degree & Convocation Fee', 5000.00, '2024-05-10', '2024-05-12', 'Paid', 'CASH_COUNTER', 'TXN-OFF-20240512-TKN102');

MERGE INTO fees (id, student_id, fee_type, amount, due_date, paid_date, status, payment_mode, transaction_id) KEY(id)
VALUES (8, 'STU1004', 'Final Degree & Convocation Fee', 5000.00, '2024-05-10', '2024-05-15', 'Paid', 'ONLINE', 'TXN-ONL-20240515-9921');
