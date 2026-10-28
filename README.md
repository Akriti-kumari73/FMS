# CollegeSync - Fee Management System (FMS)

A complete college/university fee payment and student management system built with **Advance Java (Spring Boot, JDBC, DAO Pattern, REST APIs)** on the backend, **HTML5, CSS3, JavaScript** on the frontend, and **SQL (MySQL / MariaDB)** for database persistence.

---

## 🌟 Key Features

### 1. Student Registration Check & Authentication
- **Step 1 Check**: Enter Student ID (e.g. `STU1001`) or Email address.
- **If Already Registered**:
  - Displays student details (*Name, Course, Branch, Semester*).
  - Instantly unlocks password field to **Login**.
- **If Not Registered**:
  - Informs the user that no account exists.
  - Automatically unfolds the **Student Registration** form with the entered details pre-filled.
  - On registration, automatically assigns a unique ID (`STUxxxx`) and generates standard semester tuition & examination fee dues.

### 2. Dual Mode Fee Payment

#### A. Online Fee Payment
- Pay online using:
  - **UPI / QR Code** (GPay, PhonePe, Paytm, BHIM)
  - **Debit / Credit Card** (Visa, Mastercard, RuPay)
  - **Net Banking** (Major Indian Banks)
- Verified transaction generation (`TXN-ONL-YYYYMMDD-XXXX`).
- Instant status update to **`Paid`** in the database.
- **Instant Official PDF Receipt** with university header, student details, fee breakdown, transaction ID, date, and verified stamp (using jsPDF).

#### B. Offline Fee Payment (Counter Slot & Token)
- For cash or Demand Draft (DD) payments at the Accounts Counter.
- Checks available counter capacity from the `time_slots` table (weekday morning/afternoon slots).
- Generates a unique **Accounts Counter Token** (e.g., `TKN-9C249964`) with 7-day validity.
- Displays a printable **Counter Challan / Slip** for the student to carry to the accounts window.
- Administrator verifies payment at the desk and clicks **"Approve Cash"**, automatically updating the fee record to **`Paid`**.

### 3. Administrator Portal
- **Live Metrics**: Total registered students, total fee collection revenue, unpaid dues count, pending offline token requests.
- **Token Verification Desk**: Review offline token slips and approve/reject cash payments.
- **Assign Fees**: Bulk assign fees to entire course, branch, semester, batch, or specific student.
- **Full Ledger**: Searchable directory of students and all historical transactions.

---

## 🚀 How to Run the Project

### Option 1: One-Click Run (Recommended)
Double-click:
```
d:\my\FMS\run_fms.bat
```
This automatically compiles and starts the Advance Java backend.

Once started, open your browser and go to:
👉 **`http://localhost:8080/`**

---

### Option 2: Running via Terminal
In PowerShell or Command Prompt:
```powershell
cd d:\my\FMS\fms-java-backend
.\mvn.bat spring-boot:run
```

---

## 🗄️ Database & SQL Setup

- A complete SQL script is provided at:
  👉 **`d:\my\FMS\schema.sql`**
- It creates the `collegesync_fees` database, tables (`students`, `admins`, `fees`, `time_slots`, `tokens`, `notifications`), and inserts initial demo data.
- **Smart Database Fallback**:
  - When MySQL is running on `localhost:3306`, the application connects to MySQL automatically.
  - If MySQL is not started, the application seamlessly uses an in-memory SQL database with the exact same schema so you can test immediately without any setup!

---

## 🔑 Demo Test Credentials

| Role | Identifier / Username | Password | Notes |
| :--- | :--- | :--- | :--- |
| **Student 1** | `STU1001` or `rahul.sharma@example.com` | `rahul123` | Pre-loaded with tuition & exam dues |
| **Student 2** | `STU1002` or `priya.patel@example.com` | `priya123` | Pre-loaded with semester 3 fees |
| **Admin** | `admin` | `admin123` | Accounts & Admin management |

---

## 📁 Project Architecture

```
FMS/
├── schema.sql                              # Complete MySQL database setup script
├── run_fms.bat                             # One-click launcher script
├── fms-java-backend/                       # Advance Java Backend
│   ├── pom.xml                             # Maven dependencies (Spring Boot, JDBC, MySQL, H2)
│   ├── mvn.bat                             # Bundled Maven wrapper
│   └── src/main/
│       ├── java/com/collegesync/fms/
│       │   ├── FmsApplication.java         # Main Java Spring Boot entrypoint
│       │   ├── config/                     # CORS & Smart Database configuration
│       │   ├── controller/                 # REST Controllers (Auth, Fee, Admin)
│       │   ├── dao/                        # Data Access Objects (JDBC Prepared Statements)
│       │   ├── dto/                        # Request & Response Data Transfer Objects
│       │   └── model/                      # Entities (Student, Fee, Token, Admin, Slot)
│       └── resources/
│           ├── application.properties      # Server & logging configuration
│           ├── schema.sql                  # Schema initialization script
│           ├── mysql_schema.sql            # MySQL specific script
│           └── static/                     # Embedded Web Application (HTML, CSS, JS)
├── html/                                   # Standalone HTML Pages
│   ├── index.html                          # Check Registration & Login / Register
│   ├── student_dashboard.html              # Fee Payment Dashboard (Online/Offline)
│   └── admin_dashboard.html                # Admin & Accounts Counter Dashboard
├── css/
│   └── style.css                           # Modern Responsive UI Styling
└── js/
    ├── app.js                              # Client-side API integration & workflow logic
    └── jspdf.min.js                        # Client-side PDF receipt generator
```
