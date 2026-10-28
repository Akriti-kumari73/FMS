/**
 * CollegeSync Fees Management System (FMS)
 * Interactive Frontend Logic (Advance Java Spring Boot Backend Integration)
 */

// Configure Backend API Base URL
const API_BASE = (window.location.port === '8080') ? '/api' : 'http://localhost:8080/api';

// Intelligent Navigation Helper across root, /AccSoft/, and file:// protocols
function getAppNavUrl(page) {
    if (window.location.protocol === 'file:') {
        return page;
    }
    return '/' + page.replace(/^\/+/, '');
}

// Format currency in Indian Rupees
function formatCurrency(amount) {
    return '₹' + Number(amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 });
}

// Format date nicely
function formatDate(dateStr) {
    if (!dateStr) return '-';
    try {
        const d = new Date(dateStr);
        return isNaN(d.getTime()) ? dateStr : d.toLocaleDateString('en-GB');
    } catch (e) {
        return dateStr;
    }
}

// Interactive Toast Notification System
function showToast(message, type = 'info') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let icon = 'ℹ️';
    if (type === 'success') icon = '✓';
    if (type === 'error') icon = '✕';
    if (type === 'warning') icon = '⚠️';

    toast.innerHTML = `<span style="font-size: 16px;">${icon}</span> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        if (toast.parentElement) toast.remove();
    }, 4500);
}

// Password Visibility Toggle
function togglePassword(inputId, btn) {
    const input = document.getElementById(inputId);
    if (!input) return;
    if (input.type === 'password') {
        input.type = 'text';
        btn.innerHTML = '👁️‍🗨️';
        btn.setAttribute('aria-label', 'Hide password');
    } else {
        input.type = 'password';
        btn.innerHTML = '👁️';
        btn.setAttribute('aria-label', 'Show password');
    }
}

// Dynamic Password Strength Meter
function checkPasswordStrength(password) {
    const fill = document.getElementById('password-strength-fill');
    const label = document.getElementById('password-strength-label');
    if (!fill || !label) return;

    if (!password) {
        fill.style.width = '0%';
        label.innerText = 'Strength: Empty';
        label.style.color = 'var(--text-muted)';
        return;
    }

    let score = 0;
    if (password.length >= 6) score += 25;
    if (password.length >= 8) score += 25;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 25;
    if (/[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password)) score += 25;

    fill.style.width = score + '%';
    if (score <= 25) {
        fill.style.background = '#d32f2f';
        label.innerText = 'Weak (use letters, numbers & symbols)';
        label.style.color = '#d32f2f';
    } else if (score <= 75) {
        fill.style.background = '#f57c00';
        label.innerText = 'Medium';
        label.style.color = '#f57c00';
    } else {
        fill.style.background = '#2e7d32';
        label.innerText = 'Strong Password ✓';
        label.style.color = '#2e7d32';
    }
}

// Password Match Verification
function checkPasswordMatch() {
    const p1 = document.getElementById('reg-password')?.value || '';
    const p2 = document.getElementById('reg-confirm-password')?.value || '';
    const matchMsg = document.getElementById('password-match-msg');
    if (!matchMsg) return;

    if (!p2) {
        matchMsg.innerText = '';
        return;
    }

    if (p1 === p2) {
        matchMsg.innerText = '✓ Passwords match perfectly';
        matchMsg.style.color = '#2e7d32';
    } else {
        matchMsg.innerText = '✕ Passwords do not match';
        matchMsg.style.color = '#d32f2f';
    }
}

// Session Storage Helpers
function getSessionStudent() {
    try {
        return JSON.parse(sessionStorage.getItem('fms_student'));
    } catch (e) {
        return null;
    }
}

function setSessionStudent(student) {
    sessionStorage.setItem('fms_student', JSON.stringify(student));
}

function getSessionAdmin() {
    try {
        return JSON.parse(sessionStorage.getItem('fms_admin'));
    } catch (e) {
        return null;
    }
}

function setSessionAdmin(admin) {
    sessionStorage.setItem('fms_admin', JSON.stringify(admin));
}

function logout() {
    sessionStorage.clear();
    showToast('Logged out successfully', 'info');
    setTimeout(() => { window.location.href = getAppNavUrl('index.html'); }, 300);
}

// ==========================================
// 1. UNIFIED LOGIN & REGISTRATION WORKFLOWS
// ==========================================

function switchAuthView(view) {
    const loginCard = document.getElementById('auth-login-card');
    const registerCard = document.getElementById('auth-register-card');
    const tabLogin = document.getElementById('tab-btn-login-view');
    const tabReg = document.getElementById('tab-btn-reg-view');

    if (view === 'register') {
        if (loginCard) loginCard.classList.add('hidden');
        if (registerCard) registerCard.classList.remove('hidden');
        if (tabLogin) tabLogin.classList.remove('active');
        if (tabReg) tabReg.classList.add('active');
    } else {
        if (registerCard) registerCard.classList.add('hidden');
        if (loginCard) loginCard.classList.remove('hidden');
        if (tabReg) tabReg.classList.remove('active');
        if (tabLogin) tabLogin.classList.add('active');
    }
}

function switchToRegisterView(prefill = '') {
    switchAuthView('register');
    if (prefill) {
        if (prefill.includes('@')) {
            const emailInput = document.getElementById('reg-email');
            if (emailInput) emailInput.value = prefill;
        }
    }
    const nameInput = document.getElementById('reg-name');
    if (nameInput) nameInput.focus();
}

function selectLoginRole(role) {
    const btnStudent = document.getElementById('role-btn-student');
    const btnAdmin = document.getElementById('role-btn-admin');
    const input = document.getElementById('login-identifier');
    const pwdInput = document.getElementById('login-password');
    const label = document.getElementById('login-id-label');
    const roleInput = document.getElementById('login-selected-role');

    if (role === 'admin') {
        if (btnStudent) btnStudent.classList.remove('active');
        if (btnAdmin) btnAdmin.classList.add('active');
        if (roleInput) roleInput.value = 'admin';
        if (label) label.innerText = 'Admin Username';
        if (input) {
            input.placeholder = 'e.g. admin';
            input.value = 'admin';
        }
        if (pwdInput) pwdInput.value = 'admin123';
    } else {
        if (btnAdmin) btnAdmin.classList.remove('active');
        if (btnStudent) btnStudent.classList.add('active');
        if (roleInput) roleInput.value = 'student';
        if (label) label.innerText = 'Student Roll No / ID / Registered Email';
        if (input) {
            input.placeholder = 'e.g. STU1001 or rahul.sharma@example.com';
            input.value = 'STU1001';
        }
        if (pwdInput) pwdInput.value = 'rahul123';
    }
}

function quickFillLogin(identifier, password, role = 'student') {
    selectLoginRole(role);
    const idInput = document.getElementById('login-identifier');
    const pwdInput = document.getElementById('login-password');
    if (idInput) idInput.value = identifier;
    if (pwdInput) pwdInput.value = password;
}

/**
 * Requirement:
 * User & Admin Login Form
 * - If registered -> login success & redirect to dashboard
 * - If NOT registered -> prompt message & smoothly open Registration form!
 */
async function handleUnifiedLogin(event) {
    if (event) event.preventDefault();

    const identifier = document.getElementById('login-identifier').value.trim();
    const password = document.getElementById('login-password').value;
    const role = document.getElementById('login-selected-role')?.value || 'student';

    if (!identifier || !password) {
        showToast('Please enter both identifier and password.', 'warning');
        return;
    }

    const btn = document.getElementById('btn-login-submit');
    if (btn) {
        btn.disabled = true;
        btn.innerText = 'Signing In...';
    }

    try {
        const res = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ identifier, password, userType: role })
        });
        const data = await res.json();

        if (data.success && data.data) {
            if (data.data.role === 'admin') {
                setSessionAdmin(data.data.user);
                showToast('Welcome Administrator! Redirecting...', 'success');
                setTimeout(() => { window.location.href = getAppNavUrl('admin_dashboard.html'); }, 600);
            } else {
                setSessionStudent(data.data.user);
                showToast(`Login Successful! Welcome, ${data.data.user.name}`, 'success');
                setTimeout(() => { window.location.href = getAppNavUrl('student_dashboard.html'); }, 600);
            }
        } else {
            // Check if user is NOT REGISTERED in database!
            if (data.data && data.data.notRegistered) {
                showToast(`Account not found for "${identifier}". You are not registered yet. Opening registration form...`, 'warning');
                setTimeout(() => {
                    switchToRegisterView(identifier);
                }, 900);
            } else {
                showToast(data.message || 'Login failed. Incorrect credentials.', 'error');
            }
        }
    } catch (err) {
        console.error('Login error:', err);
        showToast('Unable to reach Java backend server on port 8080.', 'error');
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.innerText = 'Sign In to Portal →';
        }
    }
}

/**
 * Student Registration Form Submission
 */
async function handleStudentRegister(event) {
    if (event) event.preventDefault();

    const name = document.getElementById('reg-name').value.trim();
    const fatherName = document.getElementById('reg-father').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const dob = document.getElementById('reg-dob').value;
    const course = document.getElementById('reg-course').value;
    const branch = document.getElementById('reg-branch').value.trim();
    const semester = document.getElementById('reg-semester').value;
    const batch = document.getElementById('reg-batch').value.trim();
    const password = document.getElementById('reg-password').value;
    const confirmPassword = document.getElementById('reg-confirm-password')?.value;

    if (!name || !email || !password) {
        showToast('Please fill out all mandatory fields (*).', 'warning');
        return;
    }

    if (confirmPassword && password !== confirmPassword) {
        showToast('Passwords do not match. Please check again.', 'error');
        document.getElementById('reg-confirm-password').focus();
        return;
    }

    const btn = document.getElementById('btn-student-register');
    if (btn) {
        btn.disabled = true;
        btn.innerText = 'Registering Student Account...';
    }

    try {
        const res = await fetch(`${API_BASE}/auth/student-register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, fatherName, email, dob, course, branch, semester, batch, password })
        });
        const data = await res.json();

        if (data.success && data.data) {
            setSessionStudent(data.data);
            showToast(`Registration Successful! Assigned ID: ${data.data.uniqueId}`, 'success');
            setTimeout(() => {
                window.location.href = getAppNavUrl('student_dashboard.html');
            }, 800);
        } else {
            showToast(data.message || 'Registration failed.', 'error');
        }
    } catch (err) {
        console.error('Register error:', err);
        showToast('Server error creating registration.', 'error');
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.innerText = '✓ Complete Registration & Open Fee Portal';
        }
    }
}

// ==========================================
// 2. STUDENT DASHBOARD & FEES LOGIC
// ==========================================

let currentPayingFee = null;

async function loadStudentDashboard() {
    const student = getSessionStudent();
    if (!student) {
        window.location.href = getAppNavUrl('index.html');
        return;
    }

    document.getElementById('student-name-display').innerText = student.name;
    document.getElementById('student-id-display').innerText = student.uniqueId;
    document.getElementById('student-meta-display').innerText = `${student.course} - ${student.branch} | Semester: ${student.semester} | Batch: ${student.batch || 'Current'}`;

    const initials = student.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    const avatarEl = document.getElementById('student-avatar-initials');
    if (avatarEl) avatarEl.innerText = initials;

    // Sidebar user widget
    const sideAvatar = document.getElementById('sidebar-avatar-initials');
    if (sideAvatar) sideAvatar.innerText = initials;
    const sideName = document.getElementById('sidebar-user-name');
    if (sideName) sideName.innerText = student.name;
    const sideRoll = document.getElementById('sidebar-user-roll');
    if (sideRoll) sideRoll.innerText = student.uniqueId;

    // Course status badge
    const isCompleted = student.courseStatus && student.courseStatus.toLowerCase() === 'completed';
    const badgeEl = document.getElementById('student-course-status-badge');
    if (badgeEl) {
        if (isCompleted) {
            badgeEl.className = 'badge badge-completed';
            badgeEl.style.background = '#f3e5f5';
            badgeEl.style.color = '#7b1fa2';
            badgeEl.innerHTML = '🎓 Status: Course Completed / Graduated';
        } else {
            badgeEl.className = 'badge badge-ongoing';
            badgeEl.style.background = 'rgba(255,255,255,0.2)';
            badgeEl.style.color = 'white';
            badgeEl.innerHTML = `🟢 Status: Ongoing (${student.semester || '1st'} Semester)`;
        }
    }

    renderStudentIdCard(student);
    await loadStudentFees(student.uniqueId);
    await loadStudentHistory(student.uniqueId);
    await loadStudentTokens(student.uniqueId);
    await loadStudentProfile(student.uniqueId);
}

async function loadStudentFees(studentId) {
    const container = document.getElementById('fees-container');
    if (!container) return;

    try {
        const res = await fetch(`${API_BASE}/fees/student/${studentId}`);
        const data = await res.json();

        let totalDue = 0;
        container.innerHTML = '';

        if (!data.success || !data.data || data.data.length === 0) {
            container.innerHTML = `
                <div class="card text-center" style="grid-column: 1 / -1; padding: 40px;">
                    <div style="font-size: 40px; margin-bottom: 10px;">🎉</div>
                    <h3 style="color: #2e7d32; margin-bottom: 6px;">All Fees Cleared!</h3>
                    <p class="text-muted">You have no pending fee dues on record at this time.</p>
                </div>`;
            document.getElementById('total-due-display').innerText = '₹0.00';
            updateClearanceAndHallTicket(student, 0);
            return;
        }

        data.data.forEach(fee => {
            totalDue += Number(fee.amount);
            const isPendingOffline = fee.status === 'Pending Offline';

            const card = document.createElement('div');
            card.className = 'fee-card';
            card.innerHTML = `
                <div>
                    <div class="fee-card-top">
                        <h4>${fee.feeType}</h4>
                        <span class="badge ${isPendingOffline ? 'badge-pending' : 'badge-unpaid'}">
                            ${isPendingOffline ? '🎟️ Counter Token Booked' : 'Unpaid'}
                        </span>
                    </div>
                    <div class="fee-amount">${formatCurrency(fee.amount)}</div>
                    <div class="fee-due-date">📅 Due Date: <strong>${formatDate(fee.dueDate)}</strong></div>
                </div>
                <div class="fee-actions">
                    <button class="btn btn-success" onclick="openOnlinePaymentModal(${fee.id}, ${fee.amount}, '${fee.feeType}')">
                        💳 Pay Online
                    </button>
                    <button class="btn btn-info" onclick="openOfflineTokenModal(${fee.id}, ${fee.amount}, '${fee.feeType}')">
                        🎟️ Pay Offline
                    </button>
                </div>
            `;
            container.appendChild(card);
        });

        document.getElementById('total-due-display').innerText = formatCurrency(totalDue);
        updateClearanceAndHallTicket(student, totalDue);
    } catch (err) {
        console.error('Fetch fees error:', err);
    }
}

async function loadStudentHistory(studentId) {
    const tbody = document.querySelector('#history-table tbody');
    if (!tbody) return;

    try {
        const res = await fetch(`${API_BASE}/fees/student/${studentId}/history`);
        const data = await res.json();

        let totalPaid = 0;
        tbody.innerHTML = '';

        if (!data.success || !data.data || data.data.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" class="text-center text-muted">No transactions found.</td></tr>`;
            document.getElementById('total-paid-display').innerText = '₹0.00';
            return;
        }

        data.data.forEach(item => {
            if (item.status === 'Paid') {
                totalPaid += Number(item.amount);
            }

            const isPaid = item.status === 'Paid';
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>#${item.id}</strong></td>
                <td>${item.feeType}</td>
                <td><strong>${formatCurrency(item.amount)}</strong></td>
                <td>${formatDate(item.paidDate || item.dueDate)}</td>
                <td>${item.paymentMode || '-'}</td>
                <td><span class="badge ${isPaid ? 'badge-paid' : 'badge-unpaid'}">${item.status}</span></td>
                <td>
                    ${isPaid ? `
                        <button class="btn btn-sm btn-outline" onclick="downloadPdfReceipt(${item.id})">
                            📄 Download PDF
                        </button>
                    ` : `<span class="text-muted">-</span>`}
                </td>
            `;
            tbody.appendChild(tr);
        });

        document.getElementById('total-paid-display').innerText = formatCurrency(totalPaid);
    } catch (err) {
        console.error('History fetch error:', err);
    }
}

async function loadStudentTokens(studentId) {
    const tbody = document.querySelector('#tokens-table tbody');
    if (!tbody) return;

    try {
        const res = await fetch(`${API_BASE}/fees/student/${studentId}/tokens`);
        const data = await res.json();

        tbody.innerHTML = '';
        let activeCount = 0;

        if (!data.success || !data.data || data.data.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted">No offline tokens generated yet.</td></tr>`;
            document.getElementById('active-tokens-display').innerText = '0';
            return;
        }

        data.data.forEach(t => {
            if (t.status === 'Pending') activeCount++;
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong style="color: #004d40;">${t.token}</strong></td>
                <td>${t.feeType} (${formatCurrency(t.amount)})</td>
                <td>📅 ${formatDate(t.slotDate)}<br><small class="text-muted">${t.slotTime}</small></td>
                <td>${formatDate(t.createdAt)}</td>
                <td><span class="badge ${t.status === 'Approved' ? 'badge-paid' : t.status === 'Rejected' ? 'badge-unpaid' : 'badge-pending'}">${t.status}</span></td>
                <td>
                    <button class="btn btn-sm btn-secondary" onclick="viewChallanSlip('${t.token}', '${t.feeType}', ${t.amount}, '${t.slotDate}', '${t.slotTime}')">
                        🖨️ View Slip
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });

        document.getElementById('active-tokens-display').innerText = activeCount;
    } catch (err) {
        console.error('Tokens fetch error:', err);
    }
}

// Payment Modals
function openOnlinePaymentModal(feeId, amount, feeType) {
    currentPayingFee = { id: feeId, amount, feeType };
    document.getElementById('pay-modal-fee-title').innerText = feeType;
    document.getElementById('pay-modal-amount').innerText = formatCurrency(amount);
    document.getElementById('pay-button-amount').innerText = formatCurrency(amount);
    document.getElementById('online-payment-modal').classList.add('active');
    selectPayOption('upi');
}

function selectPayOption(mode) {
    document.querySelectorAll('.pay-option-btn').forEach(btn => btn.classList.remove('active'));
    const targetTab = document.getElementById(`tab-pay-${mode}`);
    if (targetTab) targetTab.classList.add('active');

    document.getElementById('pay-section-upi').classList.add('hidden');
    document.getElementById('pay-section-card').classList.add('hidden');
    document.getElementById('pay-section-netbanking').classList.add('hidden');

    const targetSec = document.getElementById(`pay-section-${mode}`);
    if (targetSec) targetSec.classList.remove('hidden');
}

async function submitOnlinePayment() {
    const student = getSessionStudent();
    if (!student || !currentPayingFee) return;

    const activeTab = document.querySelector('.pay-option-btn.active').dataset.mode;
    const btn = document.getElementById('btn-confirm-payment');
    btn.disabled = true;
    btn.innerText = 'Authorizing Transaction...';

    const payload = {
        feeId: currentPayingFee.id,
        studentId: student.uniqueId,
        amount: currentPayingFee.amount,
        paymentMethod: activeTab.toUpperCase()
    };

    try {
        const res = await fetch(`${API_BASE}/fees/pay-online`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await res.json();

        if (data.success && data.data) {
            closeModals();
            showSuccessModal(data.data);
            showToast('Fee paid successfully! Receipt ready.', 'success');
            await loadStudentDashboard();
        } else {
            showToast(data.message || 'Payment transaction failed.', 'error');
        }
    } catch (err) {
        console.error('Payment error:', err);
        showToast('Payment processing error.', 'error');
    } finally {
        btn.disabled = false;
        btn.innerText = 'Confirm & Pay Securely';
    }
}

function showSuccessModal(receiptData) {
    document.getElementById('success-txn-id').innerText = receiptData.transactionId;
    document.getElementById('success-fee-type').innerText = receiptData.feeType;
    document.getElementById('success-amount').innerText = formatCurrency(receiptData.amount);
    document.getElementById('success-date').innerText = receiptData.paymentDate;

    document.getElementById('btn-download-success-receipt').onclick = () => {
        generatePdfDocument(receiptData);
    };

    document.getElementById('payment-success-modal').classList.add('active');
}

function openOfflineTokenModal(feeId, amount, feeType) {
    currentPayingFee = { id: feeId, amount, feeType };
    document.getElementById('token-modal-fee-title').innerText = feeType;
    document.getElementById('token-modal-amount').innerText = formatCurrency(amount);
    document.getElementById('offline-token-modal').classList.add('active');
}

async function submitGenerateOfflineToken() {
    const student = getSessionStudent();
    if (!student || !currentPayingFee) return;

    const btn = document.getElementById('btn-confirm-token');
    btn.disabled = true;
    btn.innerText = 'Allocating Counter Slot...';

    try {
        const res = await fetch(`${API_BASE}/fees/generate-offline-token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ feeId: currentPayingFee.id, studentId: student.uniqueId })
        });
        const data = await res.json();

        if (data.success && data.data) {
            closeModals();
            showToast('Slot token booked successfully!', 'success');
            viewChallanSlip(
                data.data.token, 
                currentPayingFee.feeType, 
                currentPayingFee.amount, 
                data.data.slotDate, 
                data.data.slotTime
            );
            await loadStudentDashboard();
        } else {
            showToast(data.message || 'Slot allocation failed.', 'error');
        }
    } catch (err) {
        console.error('Token error:', err);
        showToast('Error booking counter token.', 'error');
    } finally {
        btn.disabled = false;
        btn.innerText = 'Generate Token & Book Counter Slot →';
    }
}

function viewChallanSlip(token, feeType, amount, slotDate, slotTime) {
    const student = getSessionStudent();
    document.getElementById('slip-token-code').innerText = token;
    document.getElementById('slip-student').innerText = student ? `${student.name} (${student.uniqueId})` : '-';
    document.getElementById('slip-fee-type').innerText = feeType;
    document.getElementById('slip-amount').innerText = formatCurrency(amount);
    document.getElementById('slip-slot-date').innerText = formatDate(slotDate);
    document.getElementById('slip-slot-time').innerText = slotTime;

    document.getElementById('challan-slip-modal').classList.add('active');
}

function closeModals() {
    document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
}

// PDF Receipt Generator (jsPDF)
async function downloadPdfReceipt(feeId) {
    try {
        const res = await fetch(`${API_BASE}/fees/receipt/${feeId}`);
        const data = await res.json();
        if (data.success && data.data) {
            generatePdfDocument(data.data);
            showToast('Receipt downloaded successfully', 'success');
        } else {
            showToast(data.message || 'Receipt data unavailable.', 'warning');
        }
    } catch (e) {
        console.error(e);
        showToast('Error generating receipt.', 'error');
    }
}

function generatePdfDocument(r) {
    if (!window.jspdf) {
        showToast('PDF generator loading...', 'info');
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });

    doc.setFillColor(15, 41, 66); // IES University Navy
    doc.rect(0, 0, 210, 38, 'F');

    doc.setFillColor(245, 158, 11); // IES Gold line
    doc.rect(0, 38, 210, 2.5, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.text('IES UNIVERSITY, BHOPAL', 105, 15, { align: 'center' });

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(245, 158, 11);
    doc.text('AccSoft ERP 2.0 | Central Accounts & Student Fee Directorate', 105, 23, { align: 'center' });

    doc.setFontSize(8.5);
    doc.setTextColor(203, 213, 225);
    doc.text('Campus: Kalkheda, Ratibad Main Road, Bhopal (M.P.) 462044 | Recognized by UGC & AICTE', 105, 31, { align: 'center' });

    doc.setDrawColor(203, 213, 225);
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(15, 46, 180, 24, 3, 3, 'FD');

    doc.setTextColor(30, 41, 59);
    doc.setFontSize(10);
    doc.text(`Receipt Voucher: IES/REC-${r.feeId || '001'}`, 22, 54);
    doc.text(`Transaction Ref: ${r.transactionId || 'N/A'}`, 22, 63);
    doc.text(`Payment Date: ${r.paidDate || r.paymentDate || '-'}`, 120, 54);
    doc.text(`Clearance: VERIFIED (PAID)`, 120, 63);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12.5);
    doc.setTextColor(15, 41, 66);
    doc.text('Scholar Institutional Profile', 15, 80);
    doc.line(15, 82, 195, 82);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10.5);
    doc.setTextColor(30, 41, 59);
    doc.text(`Scholar Name:   ${r.studentName || '-'}`, 15, 90);
    doc.text(`Scholar / Roll: ${r.studentId || '-'}`, 15, 98);
    doc.text(`Program:        ${r.course || 'B.Tech'}`, 120, 90);
    doc.text(`Department:     ${r.branch || 'CSE'} (Sem: ${r.semester || '5th'})`, 120, 98);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12.5);
    doc.setTextColor(15, 41, 66);
    doc.text('Fee Head Realization Breakdown', 15, 115);
    doc.line(15, 117, 195, 117);

    doc.setFillColor(241, 245, 249);
    doc.rect(15, 122, 180, 10, 'F');
    doc.setFontSize(10);
    doc.setTextColor(15, 41, 66);
    doc.text('Fee Description', 20, 128);
    doc.text('Realization Mode', 120, 128);
    doc.text('Amount (INR)', 170, 128);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(30, 41, 59);
    doc.text(r.feeType || 'University Demand Fee', 20, 140);
    doc.text(r.paymentMode || 'ONLINE', 120, 140);
    doc.text(formatCurrency(r.amount), 170, 140);

    doc.line(15, 146, 195, 146);

    doc.setFont('helvetica', 'bold');
    doc.text('Net Realized Amount:', 110, 154);
    doc.text(formatCurrency(r.amount), 170, 154);

    // Official Stamp Box
    doc.setDrawColor(21, 128, 61);
    doc.setLineWidth(0.8);
    doc.roundedRect(125, 180, 65, 24, 3, 3);
    doc.setTextColor(21, 128, 61);
    doc.setFontSize(11);
    doc.text('OFFICIALLY REALIZED', 157.5, 189, { align: 'center' });
    doc.setFontSize(8);
    doc.text('IES Central Finance Directorate', 157.5, 195, { align: 'center' });
    doc.text('Cash Counter Window #02 Bhopal', 157.5, 200, { align: 'center' });

    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(148, 163, 184);
    doc.text('This is an official system-generated institutional receipt from AccSoft ERP 2.0. No manual signature required.', 105, 275, { align: 'center' });

    doc.save(`IES_Fee_Receipt_${r.studentId}_${r.feeId}.pdf`);
}

// ==========================================
// 3. ADMIN DASHBOARD & LIVE CONTROLS
// ==========================================

let adminCache = {
    overview: null,
    tokens: [],
    students: [],
    fees: []
};

async function loadAdminDashboard() {
    const admin = getSessionAdmin();
    if (!admin) {
        window.location.href = getAppNavUrl('index.html');
        return;
    }

    await loadAdminOverview();
    await loadAdminTokens();
    await loadAdminStudents();
    await loadCompletedStudents();
    await loadAdminFees();
    updateAnalyticsBar();
    renderDepartmentAnalytics();
    renderDefaultersDesk();
    renderCashSettlement();
    renderAuditTrail();
    populateScholarshipDropdown();
}

async function loadAdminOverview() {
    try {
        const res = await fetch(`${API_BASE}/admin/overview`);
        const data = await res.json();
        if (data.success && data.data) {
            const d = data.data;
            adminCache.overview = d;
            const stuCount = d.totalStudents || 0;
            const totalRev = d.totalCollections || 0;
            const offRev = d.totalOfflineCollections || 0;
            const onRev = d.totalOnlineCollections || 0;
            const unpaidCount = d.unpaidFeesCount || 0;
            const completedCount = d.courseCompletedCount || 0;
            const pendingTokens = d.pendingTokensCount || 0;

            if (document.getElementById('admin-total-students')) document.getElementById('admin-total-students').innerText = stuCount;
            if (document.getElementById('side-badge-students')) document.getElementById('side-badge-students').innerText = stuCount;

            if (document.getElementById('admin-total-revenue')) document.getElementById('admin-total-revenue').innerText = formatCurrency(totalRev);
            if (document.getElementById('admin-total-offline')) document.getElementById('admin-total-offline').innerText = formatCurrency(offRev);
            if (document.getElementById('admin-total-online')) document.getElementById('admin-total-online').innerText = formatCurrency(onRev);

            if (document.getElementById('admin-completed-students')) document.getElementById('admin-completed-students').innerText = completedCount;
            if (document.getElementById('side-badge-completed')) document.getElementById('side-badge-completed').innerText = completedCount;
            if (document.getElementById('completed-count-badge')) document.getElementById('completed-count-badge').innerText = completedCount;

            if (document.getElementById('admin-unpaid-count')) document.getElementById('admin-unpaid-count').innerText = unpaidCount;
            if (document.getElementById('admin-pending-tokens')) document.getElementById('admin-pending-tokens').innerText = pendingTokens;
            if (document.getElementById('side-badge-tokens')) document.getElementById('side-badge-tokens').innerText = pendingTokens;
            if (document.getElementById('quick-pending-tokens')) document.getElementById('quick-pending-tokens').innerText = pendingTokens;
        }
    } catch (e) {
        console.error('Admin overview error:', e);
    }
}

async function loadAdminTokens() {
    try {
        const res = await fetch(`${API_BASE}/admin/tokens`);
        const data = await res.json();
        if (data.success && data.data) {
            adminCache.tokens = data.data;
            renderAdminTokensTable(adminCache.tokens);
        }
    } catch (e) {
        console.error('Tokens fetch error:', e);
    }
}

function renderAdminTokensTable(list) {
    const tbody = document.querySelector('#admin-tokens-table tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    const recentTbody = document.getElementById('recent-tokens-tbody');
    if (recentTbody) recentTbody.innerHTML = '';

    if (!list || list.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="text-center text-muted">No offline tokens matching criteria.</td></tr>`;
        if (recentTbody) recentTbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted">No pending cash counter tokens. All caught up!</td></tr>`;
        return;
    }

    const pendingList = list.filter(t => t.status === 'Pending');

    // Populate Overview Recent Pending Tokens
    if (recentTbody) {
        if (pendingList.length === 0) {
            recentTbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted">No pending cash counter tokens. All caught up!</td></tr>`;
        } else {
            pendingList.slice(0, 5).forEach(t => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td><strong style="color: #004d40;">${t.token}</strong></td>
                    <td>${t.studentName || t.studentId} <span class="text-muted">(${t.studentId})</span></td>
                    <td>${t.feeType}</td>
                    <td><strong style="color: #0288d1;">${formatCurrency(t.amount)}</strong></td>
                    <td>📅 ${formatDate(t.slotDate)} <small class="text-muted">${t.slotTime}</small></td>
                    <td>
                        <button class="btn btn-sm btn-success" onclick="updateTokenStatus(${t.id}, 'Approved', '${t.token}', '${t.studentName || t.studentId}', ${t.amount})">
                            ✓ Approve Cash
                        </button>
                    </td>
                `;
                recentTbody.appendChild(tr);
            });
        }
    }

    list.forEach(t => {
        const isPending = t.status === 'Pending';
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong style="color: #004d40;">${t.token}</strong></td>
            <td>${t.studentName || t.studentId} <span class="text-muted">(${t.studentId})</span></td>
            <td>${t.feeType}</td>
            <td><strong>${formatCurrency(t.amount)}</strong></td>
            <td>📅 ${formatDate(t.slotDate)}<br><small class="text-muted">${t.slotTime}</small></td>
            <td><span class="badge ${t.status === 'Approved' ? 'badge-paid' : t.status === 'Rejected' ? 'badge-unpaid' : 'badge-pending'}">${t.status}</span></td>
            <td>
                ${isPending ? `
                    <button class="btn btn-sm btn-success" onclick="updateTokenStatus(${t.id}, 'Approved', '${t.token}', '${t.studentName || t.studentId}', ${t.amount})">
                        ✓ Approve Cash
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="updateTokenStatus(${t.id}, 'Rejected', '${t.token}')">
                        ✕ Reject
                    </button>
                ` : `<span class="text-muted" style="font-size: 13px;">✓ Processed</span>`}
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function filterAdminTokens(statusFilter) {
    document.querySelectorAll('#token-filter-pills .filter-pill').forEach(b => b.classList.remove('active'));
    if (event && event.target && event.target.tagName === 'BUTTON') event.target.classList.add('active');

    const search = (document.getElementById('token-search-input')?.value || '').toLowerCase().trim();

    let filtered = adminCache.tokens;
    if (statusFilter && statusFilter !== 'all') {
        filtered = filtered.filter(t => t.status.toLowerCase() === statusFilter.toLowerCase());
    }
    if (search) {
        filtered = filtered.filter(t => 
            t.token.toLowerCase().includes(search) || 
            (t.studentName && t.studentName.toLowerCase().includes(search)) || 
            t.studentId.toLowerCase().includes(search) ||
            t.feeType.toLowerCase().includes(search)
        );
    }
    renderAdminTokensTable(filtered);
}

async function updateTokenStatus(tokenId, status, tokenCode, studentName, amount) {
    const actionText = status === 'Approved' 
        ? `Approve cash payment of ${formatCurrency(amount)} for Token ${tokenCode} (${studentName})?`
        : `Reject token ${tokenCode}?`;

    if (!confirm(actionText)) return;

    try {
        const res = await fetch(`${API_BASE}/admin/tokens/${tokenId}/status?status=${status}`, {
            method: 'PUT'
        });
        const data = await res.json();
        showToast(data.message, status === 'Approved' ? 'success' : 'info');
        await loadAdminDashboard();
    } catch (e) {
        console.error(e);
        showToast('Failed to update token status.', 'error');
    }
}

async function loadAdminStudents() {
    try {
        const res = await fetch(`${API_BASE}/admin/students`);
        const data = await res.json();
        if (data.success && data.data) {
            adminCache.students = data.data;
            renderAdminStudentsTable(adminCache.students);
        }
    } catch (e) {
        console.error('Students fetch error:', e);
    }
}

function renderAdminStudentsTable(list) {
    const tbody = document.querySelector('#admin-students-table tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    if (!list || list.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" class="text-center text-muted">No students matching query.</td></tr>`;
        return;
    }

    list.forEach(s => {
        const isCompleted = s.courseStatus && s.courseStatus.toLowerCase() === 'completed';
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong style="color: #004d40;">${s.uniqueId}</strong></td>
            <td><strong>${s.name}</strong></td>
            <td>${s.email}</td>
            <td>${s.course || '-'} (${s.branch || '-'})</td>
            <td><span class="badge badge-info">${s.semester || '-'} Sem</span></td>
            <td>${s.batch || '-'}</td>
            <td>
                <span class="badge ${isCompleted ? 'badge-completed' : 'badge-ongoing'}">
                    ${isCompleted ? '🎓 Completed' : '🟢 Ongoing'}
                </span>
            </td>
            <td>
                <div style="display: flex; gap: 6px;">
                    <button class="btn btn-sm btn-outline" onclick="openStudentDetailModal('${s.uniqueId}')" title="View Full Data">
                        👁️ Full Data
                    </button>
                    <button class="btn btn-sm ${isCompleted ? 'btn-secondary' : 'btn-accent'}" onclick="toggleStudentCourseStatus('${s.uniqueId}', '${s.courseStatus || 'Ongoing'}')" title="Toggle Course Status">
                        ${isCompleted ? 'Mark Ongoing' : '🎓 Complete'}
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function filterAdminStudents() {
    const q = (document.getElementById('student-search-input')?.value || '').toLowerCase().trim();
    if (!q) {
        renderAdminStudentsTable(adminCache.students);
        return;
    }
    const filtered = adminCache.students.filter(s => 
        s.uniqueId.toLowerCase().includes(q) ||
        s.name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        (s.branch && s.branch.toLowerCase().includes(q)) ||
        (s.course && s.course.toLowerCase().includes(q)) ||
        (s.courseStatus && s.courseStatus.toLowerCase().includes(q))
    );
    renderAdminStudentsTable(filtered);
}

// ==========================================
// COURSE COMPLETED STUDENTS TRACKING
// ==========================================
let completedStudentsCache = [];

async function loadCompletedStudents() {
    try {
        const res = await fetch(`${API_BASE}/admin/students/completed`);
        const data = await res.json();
        if (data.success && data.data) {
            completedStudentsCache = data.data;
            renderCompletedStudentsTable(completedStudentsCache);
            if (document.getElementById('completed-count-badge')) {
                document.getElementById('completed-count-badge').innerText = completedStudentsCache.length;
            }
        }
    } catch (e) {
        console.error('Completed students fetch error:', e);
    }
}

function renderCompletedStudentsTable(list) {
    const tbody = document.querySelector('#admin-completed-table tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    if (!list || list.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" class="text-center text-muted">No course completed students recorded yet.</td></tr>`;
        return;
    }

    list.forEach(s => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong style="color: #4a148c;">${s.uniqueId}</strong></td>
            <td><strong>🎓 ${s.name}</strong></td>
            <td>${s.fatherName || '-'}</td>
            <td>${s.email}</td>
            <td><strong>${s.course || '-'}</strong> - ${s.branch || '-'}</td>
            <td><span class="badge badge-info">${s.batch || 'Graduated'}</span></td>
            <td><span class="badge badge-completed">🎓 Degree Completed</span></td>
            <td>
                <div style="display: flex; gap: 6px;">
                    <button class="btn btn-sm btn-outline" onclick="openStudentDetailModal('${s.uniqueId}')">
                        👁️ View Data
                    </button>
                    <button class="btn btn-sm btn-secondary" onclick="toggleStudentCourseStatus('${s.uniqueId}', 'Completed')">
                        Revert to Ongoing
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function filterCompletedStudents() {
    const q = (document.getElementById('completed-search-input')?.value || '').toLowerCase().trim();
    if (!q) {
        renderCompletedStudentsTable(completedStudentsCache);
        return;
    }
    const filtered = completedStudentsCache.filter(s => 
        s.uniqueId.toLowerCase().includes(q) ||
        s.name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        (s.course && s.course.toLowerCase().includes(q)) ||
        (s.branch && s.branch.toLowerCase().includes(q)) ||
        (s.batch && s.batch.toLowerCase().includes(q))
    );
    renderCompletedStudentsTable(filtered);
}

function filterCompletedByCourse(course) {
    document.querySelectorAll('#completed-course-pills .filter-pill').forEach(b => b.classList.remove('active'));
    if (event && event.target && event.target.tagName === 'BUTTON') event.target.classList.add('active');

    if (!course || course === 'all') {
        renderCompletedStudentsTable(completedStudentsCache);
    } else {
        const filtered = completedStudentsCache.filter(s => (s.course || '').toLowerCase() === course.toLowerCase());
        renderCompletedStudentsTable(filtered);
    }
}

// Student Modal & Status Toggle
let currentModalStudent = null;

async function toggleStudentCourseStatus(studentId, currentStatus) {
    const isCompleted = currentStatus && currentStatus.toLowerCase() === 'completed';
    const targetStatus = isCompleted ? 'Ongoing' : 'Completed';

    const confirmMsg = isCompleted 
        ? `Revert student ${studentId} course status back to 'Ongoing'?`
        : `Mark student ${studentId} as 'Course Completed / Graduated 🎓'?`;

    if (!confirm(confirmMsg)) return;

    try {
        const res = await fetch(`${API_BASE}/admin/students/${studentId}/course-status?status=${targetStatus}`, {
            method: 'PUT'
        });
        const data = await res.json();
        showToast(data.message, data.success ? 'success' : 'error');
        await loadAdminDashboard();
        await loadCompletedStudents();
        if (currentModalStudent && currentModalStudent.uniqueId === studentId) {
            closeStudentModal();
        }
    } catch (e) {
        console.error(e);
        showToast('Error updating course status', 'error');
    }
}

function openStudentDetailModal(studentId) {
    let s = adminCache.students.find(st => st.uniqueId === studentId);
    if (!s) s = completedStudentsCache.find(st => st.uniqueId === studentId);
    if (!s) return;
    currentModalStudent = s;

    const isCompleted = s.courseStatus && s.courseStatus.toLowerCase() === 'completed';
    const modal = document.getElementById('studentDetailModal');
    const title = document.getElementById('modalStudentTitle');
    const body = document.getElementById('studentDetailBody');
    const toggleBtn = document.getElementById('modalToggleStatusBtn');

    if (title) title.innerText = `👨‍🎓 Scholar Academic Dossier: ${s.name} (${s.uniqueId})`;
    if (body) {
        body.innerHTML = `
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; margin-bottom: 14px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                    <div>
                        <div style="font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 700;">Scholar Enrollment No.</div>
                        <div style="font-size: 17px; font-weight: 800; color: #0f2942;">${s.uniqueId}</div>
                    </div>
                    <div>
                        <span class="badge ${isCompleted ? 'badge-completed' : 'badge-ongoing'}">
                            ${isCompleted ? '🎓 Degree Completed / Alumni' : '🟢 Active Enrolled Scholar'}
                        </span>
                    </div>
                </div>
                <div style="font-size: 12.5px; color: #334155;">
                    Institute: <strong>IES College of Technology & University Bhopal</strong>
                </div>
            </div>

            <div class="detail-row"><span class="detail-label">Scholar Full Name:</span><span class="detail-value">${s.name}</span></div>
            <div class="detail-row"><span class="detail-label">Father's / Guardian's Name:</span><span class="detail-value">${s.fatherName || 'Not Provided'}</span></div>
            <div class="detail-row"><span class="detail-label">Registered Institutional Email:</span><span class="detail-value">${s.email}</span></div>
            <div class="detail-row"><span class="detail-label">Date of Birth:</span><span class="detail-value">${formatDate(s.dob) || 'Not Provided'}</span></div>
            <div class="detail-row"><span class="detail-label">Academic Program:</span><span class="detail-value" style="color: #1e40af; font-weight: 800;">${s.course || 'B.Tech'}</span></div>
            <div class="detail-row"><span class="detail-label">Discipline / Branch:</span><span class="detail-value">${s.branch || 'CSE'}</span></div>
            <div class="detail-row"><span class="detail-label">Current Academic Semester:</span><span class="detail-value"><span class="badge badge-info">${s.semester || '1st'} Sem</span></span></div>
            <div class="detail-row"><span class="detail-label">Academic Batch:</span><span class="detail-value">${s.batch || '2024-2028'}</span></div>
            <div class="detail-row"><span class="detail-label">Convocation / NDC Status:</span><span class="detail-value">
                ${isCompleted ? '<span style="color: #15803d; font-weight: 700;">✓ Eligible for No Dues Certificate (NDC) & Convocation</span>' : '<span style="color: #b45309; font-weight: 600;">Academic Progression in Progress</span>'}
            </span></div>
        `;
    }
    if (toggleBtn) {
        toggleBtn.innerText = isCompleted ? 'Revert to Ongoing Scholar' : '🎓 Mark Course Completed (Graduated)';
        toggleBtn.className = isCompleted ? 'btn btn-secondary' : 'btn btn-accent';
    }
    if (modal) modal.classList.add('active');
}

function closeStudentModal() {
    const modal = document.getElementById('studentDetailModal');
    if (modal) modal.classList.remove('active');
    currentModalStudent = null;
}

function toggleStudentCourseStatusFromModal() {
    if (!currentModalStudent) return;
    toggleStudentCourseStatus(currentModalStudent.uniqueId, currentModalStudent.courseStatus || 'Ongoing');
}

async function loadAdminFees() {
    try {
        const res = await fetch(`${API_BASE}/admin/fees`);
        const data = await res.json();
        if (data.success && data.data) {
            adminCache.fees = data.data;
            renderAdminFeesTable(adminCache.fees);
            updateAnalyticsBar();
        }
    } catch (e) {
        console.error('Fees fetch error:', e);
    }
}

function renderAdminFeesTable(list) {
    const tbody = document.querySelector('#admin-fees-table tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    if (!list || list.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="text-center text-muted">No fee records found.</td></tr>`;
        return;
    }

    list.forEach(f => {
        const isPaid = f.status === 'Paid';
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>#${f.id}</td>
            <td>${f.studentName || f.studentId} <span class="text-muted">(${f.studentId})</span></td>
            <td>${f.feeType}</td>
            <td><strong>${formatCurrency(f.amount)}</strong></td>
            <td>${formatDate(f.dueDate)}</td>
            <td><span class="badge ${isPaid ? 'badge-paid' : 'badge-unpaid'}">${f.status}</span></td>
            <td>${f.paymentMode || '-'}</td>
        `;
        tbody.appendChild(tr);
    });
}

function filterAdminFees() {
    const q = (document.getElementById('fee-search-input')?.value || '').toLowerCase().trim();
    if (!q) {
        renderAdminFeesTable(adminCache.fees);
        return;
    }
    const filtered = adminCache.fees.filter(f => 
        String(f.id).includes(q) ||
        (f.studentName && f.studentName.toLowerCase().includes(q)) ||
        f.studentId.toLowerCase().includes(q) ||
        f.feeType.toLowerCase().includes(q) ||
        f.status.toLowerCase().includes(q)
    );
    renderAdminFeesTable(filtered);
}

function updateAnalyticsBar() {
    if (!adminCache.fees || adminCache.fees.length === 0) return;

    let onlinePaid = 0;
    let offlinePaid = 0;
    let unpaid = 0;

    adminCache.fees.forEach(f => {
        const amt = Number(f.amount) || 0;
        if (f.status === 'Paid') {
            if (f.paymentMode === 'CASH_COUNTER' || f.paymentMode === 'OFFLINE_TOKEN') {
                offlinePaid += amt;
            } else {
                onlinePaid += amt;
            }
        } else {
            unpaid += amt;
        }
    });

    const total = onlinePaid + offlinePaid + unpaid;
    if (total === 0) return;

    const onlinePct = ((onlinePaid / total) * 100).toFixed(1);
    const offlinePct = ((offlinePaid / total) * 100).toFixed(1);
    const unpaidPct = ((unpaid / total) * 100).toFixed(1);

    const barOnline = document.getElementById('prog-seg-online');
    const barOffline = document.getElementById('prog-seg-offline');
    const barUnpaid = document.getElementById('prog-seg-unpaid');

    if (barOnline) barOnline.style.width = onlinePct + '%';
    if (barOffline) barOffline.style.width = offlinePct + '%';
    if (barUnpaid) barUnpaid.style.width = unpaidPct + '%';

    const lblOnline = document.getElementById('lbl-online-amount');
    const lblOffline = document.getElementById('lbl-offline-amount');
    const lblUnpaid = document.getElementById('lbl-unpaid-amount');

    if (lblOnline) lblOnline.innerText = `${formatCurrency(onlinePaid)} (${onlinePct}%)`;
    if (lblOffline) lblOffline.innerText = `${formatCurrency(offlinePaid)} (${offlinePct}%)`;
    if (lblUnpaid) lblUnpaid.innerText = `${formatCurrency(unpaid)} (${unpaidPct}%)`;
}

function setPresetAmount(amount) {
    const input = document.getElementById('assign-amount');
    if (input) input.value = amount;
}

function updateAssigneeEstimate() {
    const filterType = document.getElementById('assign-filter-type')?.value;
    const filterVal = (document.getElementById('assign-filter-value')?.value || '').toLowerCase().trim();
    const estimateBadge = document.getElementById('assignee-count-estimate');
    if (!estimateBadge) return;

    if (!adminCache.students || adminCache.students.length === 0) {
        estimateBadge.innerText = 'Calculating...';
        return;
    }

    if (filterType === 'all') {
        estimateBadge.innerText = `Will assign to all ${adminCache.students.length} students in directory.`;
        estimateBadge.className = 'badge badge-paid';
        return;
    }

    if (!filterVal) {
        estimateBadge.innerText = 'Enter filter match value above to estimate students.';
        estimateBadge.className = 'badge badge-info';
        return;
    }

    let matchCount = 0;
    adminCache.students.forEach(s => {
        let field = '';
        if (filterType === 'course') field = s.course;
        else if (filterType === 'branch') field = s.branch;
        else if (filterType === 'semester') field = s.semester;
        else if (filterType === 'batch') field = s.batch;
        else if (filterType === 'student_id') field = s.uniqueId;

        if (field && field.toLowerCase().includes(filterVal)) {
            matchCount++;
        }
    });

    estimateBadge.innerText = `Matches approximately ${matchCount} student(s).`;
    estimateBadge.className = matchCount > 0 ? 'badge badge-paid' : 'badge badge-unpaid';
}

async function handleAssignFees(event) {
    if (event) event.preventDefault();

    const filterType = document.getElementById('assign-filter-type').value;
    const filterValue = document.getElementById('assign-filter-value').value.trim();
    const feeType = document.getElementById('assign-fee-type').value;
    const amount = document.getElementById('assign-amount').value;
    const dueDate = document.getElementById('assign-due-date').value;

    if (!amount || !dueDate) {
        showToast('Amount and Due Date are required.', 'warning');
        return;
    }

    const btn = document.getElementById('btn-assign-fee-submit');
    if (btn) {
        btn.disabled = true;
        btn.innerText = 'Assigning Fees...';
    }

    try {
        const res = await fetch(`${API_BASE}/admin/assign-fees`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ filterType, filterValue, feeType, amount, dueDate })
        });
        const data = await res.json();
        showToast(data.message, data.success ? 'success' : 'error');
        document.getElementById('assign-fees-form').reset();
        await loadAdminDashboard();
    } catch (e) {
        console.error('Assign fee error:', e);
        showToast('Server error assigning fees.', 'error');
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.innerText = '✓ Assign Fee to Selected Students';
        }
    }
}

// ==========================================
// 4. STUDENT PROFILE & DIRECT ENROLLMENT
// ==========================================

function switchStudentTab(tab) {
    document.querySelectorAll('#student-tabs .tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.student-tab-content').forEach(c => c.classList.remove('active'));

    const activeBtn = document.getElementById(`tab-btn-student-${tab}`);
    if (activeBtn) activeBtn.classList.add('active');

    const activeContent = document.getElementById(`student-tab-${tab}`);
    if (activeContent) activeContent.classList.add('active');
}

async function loadStudentProfile(studentId) {
    try {
        const res = await fetch(`${API_BASE}/student/${studentId}`);
        const data = await res.json();
        if (data.success && data.data) {
            const s = data.data;
            setSessionStudent(s);

            const initials = s.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
            const avatarEl = document.getElementById('student-avatar-initials');
            if (avatarEl) avatarEl.innerText = initials;

            const pId = document.getElementById('prof-id');
            const pName = document.getElementById('prof-name');
            const pFather = document.getElementById('prof-father');
            const pEmail = document.getElementById('prof-email');
            const pDob = document.getElementById('prof-dob');
            const pCourse = document.getElementById('prof-course');
            const pBranch = document.getElementById('prof-branch');
            const pSemester = document.getElementById('prof-semester');
            const pBatch = document.getElementById('prof-batch');

            if (pId) pId.value = s.uniqueId;
            if (pName) pName.value = s.name;
            if (pFather) pFather.value = s.fatherName || '';
            if (pEmail) pEmail.value = s.email;
            if (pDob) pDob.value = s.dob || '';
            if (pCourse) pCourse.value = s.course || 'B.Tech';
            if (pBranch) pBranch.value = s.branch || 'CSE';
            if (pSemester) pSemester.value = s.semester || '1st';
            if (pBatch) pBatch.value = s.batch || '2024-2028';

            const isCompleted = s.courseStatus && s.courseStatus.toLowerCase() === 'completed';
            const pStatus = document.getElementById('prof-status');
            if (pStatus) pStatus.value = isCompleted ? '🎓 Course Completed / Graduated' : '🟢 Ongoing (Pursuing Course)';

            const badgeEl = document.getElementById('student-course-status-badge');
            if (badgeEl) {
                if (isCompleted) {
                    badgeEl.className = 'badge badge-completed';
                    badgeEl.style.background = '#f3e5f5';
                    badgeEl.style.color = '#7b1fa2';
                    badgeEl.innerHTML = '🎓 Status: Course Completed / Graduated';
                } else {
                    badgeEl.className = 'badge badge-ongoing';
                    badgeEl.style.background = 'rgba(255,255,255,0.2)';
                    badgeEl.style.color = 'white';
                    badgeEl.innerHTML = `🟢 Status: Ongoing (${s.semester || '1st'} Semester)`;
                }
            }
        }
    } catch (e) {
        console.error('Error loading student profile:', e);
    }
}

async function handleUpdateProfile(event) {
    if (event) event.preventDefault();
    const student = getSessionStudent();
    if (!student) return;

    const name = document.getElementById('prof-name')?.value.trim();
    const fatherName = document.getElementById('prof-father')?.value.trim();
    const dob = document.getElementById('prof-dob')?.value;
    const course = document.getElementById('prof-course')?.value;
    const branch = document.getElementById('prof-branch')?.value.trim();
    const semester = document.getElementById('prof-semester')?.value;
    const batch = document.getElementById('prof-batch')?.value.trim();

    const btn = document.getElementById('btn-save-profile');
    if (btn) {
        btn.disabled = true;
        btn.innerText = 'Saving changes...';
    }

    try {
        const res = await fetch(`${API_BASE}/student/${student.uniqueId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, fatherName, dob, course, branch, semester, batch })
        });
        const data = await res.json();
        if (data.success && data.data) {
            setSessionStudent(data.data);
            showToast('Academic profile updated successfully!', 'success');
            document.getElementById('student-name-display').innerText = data.data.name;
            document.getElementById('student-meta-display').innerText = `${data.data.course} - ${data.data.branch} | Semester: ${data.data.semester} | Batch: ${data.data.batch || 'Current'}`;
            const initials = data.data.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
            const avatarEl = document.getElementById('student-avatar-initials');
            if (avatarEl) avatarEl.innerText = initials;
        } else {
            showToast(data.message || 'Profile update failed', 'error');
        }
    } catch (e) {
        console.error(e);
        showToast('Server error updating profile', 'error');
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.innerText = '✓ Save Profile Changes';
        }
    }
}

async function handleAdminAddStudent(event) {
    if (event) event.preventDefault();

    const name = document.getElementById('adm-add-name')?.value.trim();
    const fatherName = document.getElementById('adm-add-father')?.value.trim();
    const email = document.getElementById('adm-add-email')?.value.trim();
    const dob = document.getElementById('adm-add-dob')?.value;
    const course = document.getElementById('adm-add-course')?.value;
    const branch = document.getElementById('adm-add-branch')?.value.trim();
    const semester = document.getElementById('adm-add-semester')?.value;
    const batch = document.getElementById('adm-add-batch')?.value.trim();
    const courseStatus = document.getElementById('adm-add-status')?.value || 'Ongoing';
    const password = document.getElementById('adm-add-password')?.value || 'student123';

    if (!name || !email) {
        showToast('Name and email are required.', 'warning');
        return;
    }

    const btn = document.getElementById('btn-admin-add-student');
    if (btn) {
        btn.disabled = true;
        btn.innerText = 'Enrolling Student...';
    }

    try {
        const res = await fetch(`${API_BASE}/admin/students`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, fatherName, email, dob, course, branch, semester, batch, courseStatus, password })
        });
        const data = await res.json();
        if (data.success && data.data) {
            showToast(`Student Enrolled! Assigned ID: ${data.data.uniqueId}`, 'success');
            document.getElementById('admin-add-student-form')?.reset();
            await loadAdminDashboard();
            if (typeof switchSidebarTab === 'function') {
                switchSidebarTab('students');
            } else if (typeof switchAdminTab === 'function') {
                switchAdminTab('students');
            }
        } else {
            showToast(data.message || 'Failed to enroll student.', 'error');
        }
    } catch (e) {
        console.error(e);
        showToast('Server error enrolling student.', 'error');
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.innerText = '✓ Enroll Student Directly';
        }
    }
}

// ==========================================
// 5. EXPANDED STUDENT DASHBOARD MODULES
// ==========================================

// 1. Digital Scholar ID Card
function renderStudentIdCard(student) {
    if (!student) return;
    const nameEl = document.getElementById('idcard-name');
    const rollEl = document.getElementById('idcard-roll');
    const badgeEl = document.getElementById('idcard-course-badge');
    const fatherEl = document.getElementById('idcard-father');
    const batchEl = document.getElementById('idcard-batch');
    const semEl = document.getElementById('idcard-semester');
    const avatarEl = document.getElementById('idcard-avatar');

    if (nameEl) nameEl.innerText = student.name;
    if (rollEl) rollEl.innerText = student.uniqueId;
    if (badgeEl) badgeEl.innerText = `${student.course || 'B.Tech'} - ${student.branch || 'CSE'}`;
    if (fatherEl) fatherEl.innerText = student.fatherName || 'Guardian Record Verified';
    if (batchEl) batchEl.innerText = student.batch || '2024-2028';
    if (semEl) semEl.innerText = `${student.semester || '1st'} Semester`;
    if (avatarEl) {
        const initials = student.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
        avatarEl.innerText = initials;
    }
}

function flipStudentIdCard() {
    const card = document.getElementById('student-idcard-card');
    if (card) card.classList.toggle('flipped');
}

function downloadStudentIdCardPdf() {
    const student = getSessionStudent();
    if (!student || !window.jspdf) {
        showToast('PDF Generator initializing...', 'info');
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: [100, 150] });

    // Header Navy
    doc.setFillColor(11, 59, 96);
    doc.rect(0, 0, 100, 26, 'F');
    // Gold Accent line
    doc.setFillColor(245, 158, 11);
    doc.rect(0, 26, 100, 2, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text('IES UNIVERSITY BHOPAL', 50, 11, { align: 'center' });

    doc.setFontSize(8);
    doc.setTextColor(245, 158, 11);
    doc.text('STUDENT IDENTITY CARD | 2024-2028', 50, 18, { align: 'center' });

    // Photo Box
    doc.setFillColor(245, 158, 11);
    doc.rect(36, 33, 28, 28, 'F');
    doc.setTextColor(11, 59, 96);
    doc.setFontSize(18);
    const initials = student.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    doc.text(initials, 50, 51, { align: 'center' });

    // Scholar Details
    doc.setTextColor(11, 59, 96);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text(student.name, 50, 68, { align: 'center' });

    doc.setTextColor(217, 119, 6);
    doc.setFontSize(10);
    doc.text(`Scholar ID: ${student.uniqueId}`, 50, 74, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(51, 65, 85);
    doc.text(`Program: ${student.course || 'B.Tech'} (${student.branch || 'CSE'})`, 50, 81, { align: 'center' });
    doc.text(`Father: ${student.fatherName || '-'}`, 12, 91);
    doc.text(`Batch: ${student.batch || '2024-2028'}`, 12, 97);
    doc.text(`Semester: ${student.semester || '1st'} Sem`, 12, 103);
    doc.text(`Blood Group: O+ Positive`, 12, 109);
    doc.text(`Validity: Active (Till 2028)`, 12, 115);

    // Barcode Simulation
    doc.setFont('courier', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(30, 41, 59);
    doc.text('|||| | ||||| || |||||| |', 50, 130, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(100, 116, 139);
    doc.text('Ratibad Main Road, Bhopal (M.P.) | 0755-4088888', 50, 142, { align: 'center' });

    doc.save(`IES_ID_Card_${student.uniqueId}.pdf`);
    showToast('Scholar ID Card PDF downloaded!', 'success');
}

// 2. Institutional Clearance & Hall Ticket
function updateClearanceAndHallTicket(student, totalDue) {
    const finItem = document.getElementById('clearance-item-finance');
    const finIcon = document.getElementById('clearance-icon-finance');
    const finStatus = document.getElementById('clearance-status-finance');
    const msgEl = document.getElementById('hallticket-status-msg');
    const btnAdmit = document.getElementById('btn-download-hallticket');

    if (!finItem || !finStatus) return;

    if (totalDue === 0) {
        finItem.className = 'clearance-item cleared';
        if (finIcon) {
            finIcon.style.background = '#dcfce7';
            finIcon.style.color = '#15803d';
            finIcon.innerText = '✓';
        }
        finStatus.innerText = '✓ Cleared (₹0.00 Dues)';
        finStatus.style.color = '#15803d';

        if (msgEl) {
            msgEl.style.background = '#f0fdf4';
            msgEl.style.border = '1px solid #bbf7d0';
            msgEl.style.color = '#166534';
            msgEl.innerHTML = '<strong>🎉 Institutional No-Dues Cleared!</strong> Your official Examination Hall Ticket for the December 2024 Session has been verified and released.';
        }
        if (btnAdmit) {
            btnAdmit.disabled = false;
            btnAdmit.style.opacity = '1';
        }
    } else {
        finItem.className = 'clearance-item pending';
        if (finIcon) {
            finIcon.style.background = '#fee2e2';
            finIcon.style.color = '#dc2626';
            finIcon.innerText = '⚠️';
        }
        finStatus.innerText = `Pending Dues: ${formatCurrency(totalDue)}`;
        finStatus.style.color = '#dc2626';

        if (msgEl) {
            msgEl.style.background = '#fef2f2';
            msgEl.style.border = '1px solid #fecaca';
            msgEl.style.color = '#991b1b';
            msgEl.innerHTML = `<strong>⚠️ Examination Hall Ticket Withheld!</strong> Pending fee obligations of <strong>${formatCurrency(totalDue)}</strong> remain in your account. Please complete payment via Online Gateway or Accounts Counter Window #02 to unlock your Hall Ticket.`;
        }
        if (btnAdmit) {
            btnAdmit.disabled = false;
        }
    }
}

function downloadExamAdmitCardPdf() {
    const student = getSessionStudent();
    if (!student || !window.jspdf) return;

    const dueText = document.getElementById('total-due-display')?.innerText || '₹0.00';
    if (dueText !== '₹0.00') {
        showToast('Admit Card Withheld: Outstanding fee dues pending. Please pay dues first.', 'error');
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });

    // Official Header
    doc.setFillColor(11, 59, 96);
    doc.rect(0, 0, 210, 34, 'F');
    doc.setFillColor(245, 158, 11);
    doc.rect(0, 34, 210, 2, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('IES UNIVERSITY, BHOPAL', 105, 14, { align: 'center' });

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(245, 158, 11);
    doc.text('OFFICE OF THE CONTROLLER OF EXAMINATIONS', 105, 22, { align: 'center' });

    doc.setFontSize(8.5);
    doc.setTextColor(203, 213, 225);
    doc.text('END-SEMESTER THEORY & PRACTICAL EXAMINATION ADMIT CARD / HALL TICKET (DEC 2024)', 105, 29, { align: 'center' });

    // Candidate Box
    doc.setDrawColor(203, 213, 225);
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(15, 42, 180, 42, 3, 3, 'FD');

    doc.setTextColor(11, 59, 96);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text(`Scholar Name: ${student.name}`, 22, 51);
    doc.text(`Enrollment / Roll No: ${student.uniqueId}`, 22, 60);
    doc.text(`Program: ${student.course || 'B.Tech'} (${student.branch || 'CSE'})`, 22, 69);
    doc.text(`Semester: ${student.semester || '1st'} Sem | Batch: ${student.batch || '2024-2028'}`, 22, 78);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(71, 85, 105);
    doc.text(`Hall Ticket Voucher: IES/HT/2024/${student.uniqueId}`, 115, 51);
    doc.text(`Exam Centre: IES Central Exam Complex`, 115, 60);
    doc.text(`Centre Code: 0144 (Ratibad, Bhopal)`, 115, 69);
    doc.text(`Accounts Clearance: VERIFIED NO DUES`, 115, 78);

    // Subject Schedule Table
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(11, 59, 96);
    doc.text('Registered Examination Papers & Timetable', 15, 94);
    doc.line(15, 96, 195, 96);

    const papers = [
        ['CS-501', 'Theory of Computation', '02-Dec-2024', '10:00 AM - 01:00 PM', 'Hall A - Seat 42'],
        ['CS-502', 'Database Management Systems', '05-Dec-2024', '10:00 AM - 01:00 PM', 'Hall A - Seat 42'],
        ['CS-503', 'Computer Networks', '08-Dec-2024', '10:00 AM - 01:00 PM', 'Hall B - Seat 18'],
        ['CS-504', 'Cloud Computing & DevOps', '11-Dec-2024', '10:00 AM - 01:00 PM', 'Hall B - Seat 18'],
        ['CS-505', 'Web Technologies & Full Stack Lab', '14-Dec-2024', '02:00 PM - 05:00 PM', 'Software Lab #03']
    ];

    let y = 106;
    doc.setFillColor(241, 245, 249);
    doc.rect(15, 99, 180, 8, 'F');
    doc.setFontSize(9);
    doc.setTextColor(30, 41, 59);
    doc.text('Code', 18, 104);
    doc.text('Subject Title', 38, 104);
    doc.text('Date', 105, 104);
    doc.text('Timing', 135, 104);
    doc.text('Allotted Seat', 170, 104);

    doc.setFont('helvetica', 'normal');
    papers.forEach(p => {
        doc.text(p[0], 18, y);
        doc.text(p[1], 38, y);
        doc.text(p[2], 105, y);
        doc.text(p[3], 135, y);
        doc.text(p[4], 170, y);
        doc.setDrawColor(226, 232, 240);
        doc.line(15, y + 2, 195, y + 2);
        y += 9;
    });

    // Important Instructions
    y += 8;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(11, 59, 96);
    doc.text('Candidate Instructions:', 15, y);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    y += 5;
    doc.text('1. Candidates must carry this Admit Card along with their Official Digital Scholar ID Card.', 15, y);
    y += 4.5;
    doc.text('2. Entry to examination hall is strictly closed 15 minutes before paper commencement.', 15, y);
    y += 4.5;
    doc.text('3. Electronic gadgets, mobile phones, smartwatches, and study notes are strictly forbidden.', 15, y);

    // Signatures
    y += 24;
    doc.setDrawColor(148, 163, 184);
    doc.line(20, y, 65, y);
    doc.line(145, y, 190, y);
    doc.setFontSize(8.5);
    doc.text('Candidate Signature', 28, y + 5);
    doc.text('Controller of Examinations', 148, y + 5);

    doc.save(`IES_Exam_HallTicket_${student.uniqueId}.pdf`);
    showToast('Official Exam Hall Ticket downloaded successfully!', 'success');
}

// 3. Support & Grievance Desk
function handleStudentGrievance(event) {
    event.preventDefault();
    const student = getSessionStudent();
    const cat = document.getElementById('grv-category')?.value;
    const prio = document.getElementById('grv-priority')?.value;
    const subj = document.getElementById('grv-subject')?.value.trim();
    const msg = document.getElementById('grv-message')?.value.trim();

    if (!subj || !msg) {
        showToast('Please fill out subject and message description.', 'warning');
        return;
    }

    const tktId = `#IES-TKT-${Math.floor(1000 + Math.random() * 9000)}`;
    const dateStr = new Date().toLocaleDateString('en-GB');

    const tbody = document.getElementById('grievance-tbody');
    if (tbody) {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${tktId}</strong></td>
            <td>${cat}</td>
            <td>${subj}</td>
            <td>${dateStr}</td>
            <td><span class="badge" style="background: #fef3c7; color: #b45309;">Submitted</span></td>
            <td style="color: #64748b;">Ticket assigned to Accounts Officer. Under review.</td>
        `;
        tbody.prepend(tr);
    }

    event.target.reset();
    showToast(`Grievance ticket ${tktId} submitted to Accounts Directorate!`, 'success');
}

// ==========================================
// 6. EXPANDED ADMIN DASHBOARD MODULES
// ==========================================

// 1. Department Financial Realization
function renderDepartmentAnalytics() {
    const grid = document.getElementById('dept-analytics-grid');
    if (!grid) return;

    const depts = [
        { code: 'CSE', name: 'Computer Science & Engineering', target: 500000, collected: 420000, arrears: 80000, color: '#1e3a8a' },
        { code: 'ECE', name: 'Electronics & Communication', target: 300000, collected: 240000, arrears: 60000, color: '#0284c7' },
        { code: 'Civil', name: 'Civil Engineering', target: 250000, collected: 180000, arrears: 70000, color: '#0d9488' },
        { code: 'MBA', name: 'Master of Business Administration', target: 400000, collected: 360000, arrears: 40000, color: '#f59e0b' },
        { code: 'MCA', name: 'Master of Computer Applications', target: 350000, collected: 290000, arrears: 60000, color: '#8b5cf6' },
        { code: 'Pharmacy', name: 'Faculty of Pharmaceutical Sciences', target: 380000, collected: 310000, arrears: 70000, color: '#ec4899' }
    ];

    grid.innerHTML = '';
    depts.forEach(d => {
        const pct = Math.round((d.collected / d.target) * 100);
        const card = document.createElement('div');
        card.className = 'dept-card';
        card.style.borderTopColor = d.color;
        card.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                <div>
                    <span class="badge" style="background: rgba(11,59,96,0.08); color: ${d.color}; font-size: 11px; font-weight: 800;">${d.code}</span>
                    <h4 style="font-size: 14.5px; color: #0f2942; margin: 4px 0 0 0;">${d.name}</h4>
                </div>
                <span style="font-size: 15px; font-weight: 800; color: ${pct >= 80 ? '#15803d' : '#b45309'};">${pct}%</span>
            </div>

            <div class="attendance-pill-bar" style="margin-bottom: 12px; height: 8px;">
                <div class="attendance-pill-fill" style="width: ${pct}%; background: ${d.color};"></div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 12px; border-top: 1px dashed #e2e8f0; padding-top: 8px;">
                <div>
                    <span class="text-muted">Realized Fee:</span><br>
                    <strong style="color: #15803d; font-size: 13.5px;">${formatCurrency(d.collected)}</strong>
                </div>
                <div>
                    <span class="text-muted">Unpaid Arrears:</span><br>
                    <strong style="color: #dc2626; font-size: 13.5px;">${formatCurrency(d.arrears)}</strong>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

function exportDepartmentReportCsv() {
    const csvContent = "data:text/csv;charset=utf-8," +
        "Department Code,Department Name,Budgeted Target,Realized Collection,Outstanding Arrears,Recovery Percentage\n" +
        "CSE,Computer Science & Engineering,500000,420000,80000,84%\n" +
        "ECE,Electronics & Communication,300000,240000,60000,80%\n" +
        "Civil,Civil Engineering,250000,180000,70000,72%\n" +
        "MBA,Master of Business Administration,400000,360000,40000,90%\n" +
        "MCA,Master of Computer Applications,350000,290000,60000,83%\n" +
        "Pharmacy,Faculty of Pharmaceutical Sciences,380000,310000,70000,82%\n";

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `IES_Department_Fee_Realization_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Department Realization Summary CSV exported!', 'success');
}

// 2. Fee Defaulters & Arrears Desk
function renderDefaultersDesk() {
    const tbody = document.getElementById('defaulters-tbody');
    if (!tbody || !adminCache.fees) return;

    const unpaidFees = adminCache.fees.filter(f => f.status === 'Unpaid');
    const countEl = document.getElementById('defaulters-count');
    const totalEl = document.getElementById('defaulters-total-amount');
    const avgEl = document.getElementById('defaulters-avg-amount');
    const sideBadge = document.getElementById('side-badge-defaulters');

    let totalDue = 0;
    unpaidFees.forEach(f => { totalDue += Number(f.amount || 0); });
    const avgDue = unpaidFees.length ? (totalDue / unpaidFees.length) : 0;

    if (countEl) countEl.innerText = unpaidFees.length;
    if (sideBadge) sideBadge.innerText = unpaidFees.length;
    if (totalEl) totalEl.innerText = formatCurrency(totalDue);
    if (avgEl) avgEl.innerText = formatCurrency(avgDue);

    tbody.innerHTML = '';
    if (unpaidFees.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="text-center text-muted">🎉 Outstanding arrears zero! All scholar accounts are fully paid.</td></tr>`;
        return;
    }

    unpaidFees.forEach(f => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong style="color: #0b3b60;">${f.studentId}</strong></td>
            <td><strong>${f.studentName || f.studentId}</strong></td>
            <td>${f.course || 'B.Tech'} (${f.branch || 'CSE'})</td>
            <td>${f.feeType}</td>
            <td><strong style="color: #dc2626;">${formatCurrency(f.amount)}</strong></td>
            <td>📅 ${formatDate(f.dueDate)}</td>
            <td>
                <div style="display: flex; gap: 6px;">
                    <button class="btn btn-sm btn-outline" onclick="generateDefaulterNoticePdf(${f.id}, '${f.studentId}', '${f.studentName || f.studentId}', ${f.amount}, '${f.feeType}', '${f.dueDate}')" title="Print Demand Notice">
                        📄 Notice
                    </button>
                    <button class="btn btn-sm btn-accent" onclick="sendDefaulterReminder('${f.studentName || f.studentId}', ${f.amount})" title="Send Reminder">
                        📲 Remind
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function sendDefaulterReminder(studentName, amount) {
    showToast(`SMS & Email payment notice sent to ${studentName} for ${formatCurrency(amount)} via IES Notification Gateway.`, 'success');
    addAuditLogEntry('Payment Reminder Dispatched', `Automated SMS/Email fee recovery notice delivered to ${studentName} for overdue amount ${formatCurrency(amount)}.`, 'payment', '📲');
}

function sendBulkFeeReminders() {
    const unpaidFees = (adminCache.fees || []).filter(f => f.status === 'Unpaid');
    showToast(`Bulk fee recovery reminder broadcasted to ${unpaidFees.length} defaulting scholars successfully!`, 'success');
    addAuditLogEntry('Bulk Reminder Broadcast', `Central SMS/Email fee recovery broadcast triggered for ${unpaidFees.length} scholar accounts.`, 'payment', '📢');
}

function generateDefaulterNoticePdf(feeId, stuId, stuName, amount, feeType, dueDate) {
    if (!window.jspdf) return;

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });

    doc.setFillColor(11, 59, 96);
    doc.rect(0, 0, 210, 34, 'F');
    doc.setFillColor(245, 158, 11);
    doc.rect(0, 34, 210, 2, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('IES UNIVERSITY, BHOPAL', 105, 14, { align: 'center' });

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(245, 158, 11);
    doc.text('DIRECTORATE OF FINANCE & STUDENT ACCOUNTS', 105, 22, { align: 'center' });

    doc.setFontSize(8.5);
    doc.setTextColor(203, 213, 225);
    doc.text('FORMAL DEMAND NOTICE & INSTITUTIONAL FEE ARREARS RECOVERY', 105, 29, { align: 'center' });

    doc.setTextColor(30, 41, 59);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Notice Ref: IES/FIN/DEF/2024/${feeId || '001'}`, 15, 46);
    doc.text(`Date of Issue: ${new Date().toLocaleDateString('en-GB')}`, 145, 46);

    doc.setFont('helvetica', 'bold');
    doc.text('TO / MEMORANDUM:', 15, 56);
    doc.setFont('helvetica', 'normal');
    doc.text(`Scholar Name:  ${stuName || 'Scholar'}`, 15, 62);
    doc.text(`Scholar / Roll: ${stuId || '-'}`, 15, 68);
    doc.text(`Institute:     IES University & Group of Institutions, Bhopal`, 15, 74);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(185, 28, 28);
    doc.text('SUBJECT: IMMEDIATE SETTLEMENT OF OUTSTANDING FEE ARREARS', 15, 86);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(9.5);
    const noticeBody = `This is an official communication from the Central Accounts Directorate to inform you that an outstanding fee balance of ${formatCurrency(amount)} under head '${feeType}' fell due on ${formatDate(dueDate)} and remains unpaid on university records.\n\nYou are advised to remit the aforesaid overdue amount immediately via the AccSoft 2.0 student portal (online mode) or in cash at Central Accounts Window #02 within 7 working days from the date of this notice.\n\nPlease note that non-settlement of fee arrears may lead to withholding of examination hall tickets, semester results, and library privileges as per IES University Academic Regulations.`;

    const splitText = doc.splitTextToSize(noticeBody, 180);
    doc.text(splitText, 15, 96);

    doc.setDrawColor(203, 213, 225);
    doc.setFillColor(254, 242, 242);
    doc.roundedRect(15, 140, 180, 24, 3, 3, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(153, 27, 27);
    doc.text(`Demanded Overdue Amount: ${formatCurrency(amount)}`, 22, 150);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.text('Payment Channels: Online UPI/Card via accsoft.iesuniversity.ac.in OR Accounts Window #02', 22, 158);

    doc.setFontSize(9.5);
    doc.setTextColor(30, 41, 59);
    doc.text('By Order of the Finance Committee,', 15, 180);
    doc.text('Accounts Officer (Revenue & Recovery)', 15, 198);
    doc.text('IES University Bhopal (M.P.)', 15, 204);

    doc.save(`IES_Fee_Demand_Notice_${stuId}_${feeId}.pdf`);
    showToast(`Demand notice PDF generated for ${stuName}!`, 'success');
}

function exportDefaultersCsv() {
    const unpaidFees = (adminCache.fees || []).filter(f => f.status === 'Unpaid');
    let csv = "Scholar ID,Scholar Name,Fee Head,Overdue Amount,Due Date,Status\n";
    unpaidFees.forEach(f => {
        csv += `"${f.studentId}","${f.studentName || ''}","${f.feeType}","${f.amount}","${f.dueDate}","${f.status}"\n`;
    });

    const encodedUri = encodeURI("data:text/csv;charset=utf-8," + csv);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `IES_Defaulters_Roster_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Defaulters Roster CSV downloaded!', 'success');
}

// 3. Day-End Cash Settlement
function renderCashSettlement() {
    const dateEl = document.getElementById('settlement-date');
    const tokenCountEl = document.getElementById('settlement-token-count');
    const totalCashEl = document.getElementById('settlement-total-cash');
    const denomGrandEl = document.getElementById('denom-grand-total');

    const totalOffline = adminCache.overview?.totalOfflineCollections || 62000;
    const dateStr = new Date().toLocaleDateString('en-GB');

    if (dateEl) dateEl.innerText = dateStr;
    if (tokenCountEl) {
        const approvedTokens = (adminCache.tokens || []).filter(t => t.status === 'Approved').length || 4;
        tokenCountEl.innerText = `${approvedTokens} Tokens Reconciled`;
    }

    if (totalCashEl) totalCashEl.innerText = formatCurrency(totalOffline);
    if (denomGrandEl) denomGrandEl.innerText = formatCurrency(totalOffline);

    // Realistic Denominations Calculator
    const n500 = Math.floor((totalOffline * 0.70) / 500);
    const sub500 = n500 * 500;
    const rem1 = totalOffline - sub500;

    const n200 = Math.floor((rem1 * 0.70) / 200);
    const sub200 = n200 * 200;
    const rem2 = rem1 - sub200;

    const n100 = Math.floor(rem2 / 100);
    const sub100 = n100 * 100;

    if (document.getElementById('denom-500-count')) document.getElementById('denom-500-count').innerText = `${n500} notes`;
    if (document.getElementById('denom-500-total')) document.getElementById('denom-500-total').innerText = formatCurrency(sub500);

    if (document.getElementById('denom-200-count')) document.getElementById('denom-200-count').innerText = `${n200} notes`;
    if (document.getElementById('denom-200-total')) document.getElementById('denom-200-total').innerText = formatCurrency(sub200);

    if (document.getElementById('denom-100-count')) document.getElementById('denom-100-count').innerText = `${n100} notes`;
    if (document.getElementById('denom-100-total')) document.getElementById('denom-100-total').innerText = formatCurrency(sub100);
}

function printCashSettlementPdf() {
    if (!window.jspdf) return;

    const totalOffline = adminCache.overview?.totalOfflineCollections || 62000;
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });

    doc.setFillColor(11, 59, 96);
    doc.rect(0, 0, 210, 34, 'F');
    doc.setFillColor(245, 158, 11);
    doc.rect(0, 34, 210, 2, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('IES UNIVERSITY, BHOPAL', 105, 14, { align: 'center' });

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(245, 158, 11);
    doc.text('CENTRAL CASH OFFICE | DAY-END CASH SETTLEMENT SHEET', 105, 22, { align: 'center' });

    doc.setFontSize(8.5);
    doc.setTextColor(203, 213, 225);
    doc.text('ACCOUNTS COUNTER RECONCILIATION & VAULT CASH HANDOVER REGISTER', 105, 29, { align: 'center' });

    doc.setTextColor(30, 41, 59);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Settlement Voucher: IES/SETTLE/${new Date().toISOString().slice(0, 10)}`, 15, 46);
    doc.text(`Shift Date: ${new Date().toLocaleDateString('en-GB')}`, 145, 46);
    doc.text(`Cashier In-Charge: R.K. Mishra (Senior Cashier)`, 15, 54);
    doc.text(`Shift Timing: 09:30 AM - 04:30 PM`, 145, 54);

    doc.setDrawColor(203, 213, 225);
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(15, 62, 180, 20, 2, 2, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(11, 59, 96);
    doc.text(`Total Physical Cash Realization: ${formatCurrency(totalOffline)}`, 22, 74);

    // Denominations
    let y = 94;
    doc.setFontSize(11);
    doc.text('Physical Currency Count & Denominations Breakdown:', 15, y);
    doc.line(15, y + 2, 195, y + 2);

    y += 10;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`₹500 Notes:   Machine Verified & Bundle Sealed`, 20, y);
    y += 8;
    doc.text(`₹200 Notes:   Physical Bundle Sealed`, 20, y);
    y += 8;
    doc.text(`₹100 Notes:   Counter Drawer Loose Currency`, 20, y);
    y += 12;
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(21, 128, 61);
    doc.text(`Total Physical Cash Handed Over: ${formatCurrency(totalOffline)} (100% Reconciled)`, 20, y);

    y += 36;
    doc.setDrawColor(148, 163, 184);
    doc.line(20, y, 65, y);
    doc.line(85, y, 130, y);
    doc.line(145, y, 190, y);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    doc.text('Cashier Signature', 26, y + 5);
    doc.text('Accounts Clerk', 93, y + 5);
    doc.text('Chief Finance Officer', 148, y + 5);

    doc.save(`IES_Daily_Cash_Settlement_${new Date().toISOString().slice(0, 10)}.pdf`);
    showToast('Daily Cash Settlement Slip PDF downloaded!', 'success');
}

// 4. Scholarship & Concessions
function populateScholarshipDropdown() {
    const sel = document.getElementById('schol-student-id');
    if (!sel || !adminCache.students) return;

    sel.innerHTML = '<option value="">-- Choose Enrolled Scholar --</option>';
    adminCache.students.forEach(s => {
        const opt = document.createElement('option');
        opt.value = s.uniqueId;
        opt.innerText = `${s.name} (${s.uniqueId}) - ${s.course || 'B.Tech'} ${s.branch || 'CSE'}`;
        sel.appendChild(opt);
    });
}

function handleApplyScholarshipConcession(event) {
    event.preventDefault();
    const stuId = document.getElementById('schol-student-id')?.value;
    const scheme = document.getElementById('schol-scheme')?.value;
    const amount = Number(document.getElementById('schol-amount')?.value || 0);
    const orderNo = document.getElementById('schol-sanction-no')?.value.trim();
    const remarks = document.getElementById('schol-remarks')?.value.trim();

    if (!stuId || !amount) {
        showToast('Please select scholar and specify concession amount.', 'warning');
        return;
    }

    const stu = (adminCache.students || []).find(s => s.uniqueId === stuId);
    const stuName = stu ? stu.name : stuId;
    const sanctionId = `#SCH-${Math.floor(2500 + Math.random() * 500)}`;

    const tbody = document.getElementById('scholarship-tbody');
    if (tbody) {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${sanctionId}</strong></td>
            <td>${stuName} (${stuId})</td>
            <td>${scheme}</td>
            <td><strong>${formatCurrency(amount)}</strong></td>
            <td>${orderNo || 'SANCTION/2024'}</td>
            <td><span class="badge" style="background: #dcfce7; color: #15803d;">Credit Adjusted</span></td>
        `;
        tbody.prepend(tr);
    }

    addAuditLogEntry('Scholarship Credit Concession', `Sanctioned ${formatCurrency(amount)} under '${scheme}' for ${stuName} (${stuId}). Sanction Order: ${orderNo}`, 'admission', '🎓');
    showToast(`Concession of ${formatCurrency(amount)} credited to ${stuName} (${stuId}) successfully!`, 'success');
    event.target.reset();
}

// 5. System Audit Trail & Timeline
let auditLogsCache = [
    { title: 'Offline Cash Counter Approval', desc: 'Cashier Window #02 approved Token #TKN-8421 for Rahul Sharma (₹12,000.00). Fee marked Paid.', type: 'approval', icon: '🎟️', time: '10 mins ago' },
    { title: 'Online Fee Payment Reconciled', desc: 'Payment of ₹6,500.00 received via Razorpay Gateway for Amit Kumar Verma (STU1003). Transaction: TXN-ON-99218.', type: 'payment', icon: '💳', time: '42 mins ago' },
    { title: 'New Scholar Admission Enrolled', desc: 'Scholar STU1005 (Aman Sharma) registered for B.Tech Computer Science (Batch 2024-2028).', type: 'admission', icon: '👨‍🎓', time: '2 hours ago' },
    { title: 'Degree Completion Status Mutated', desc: 'Academic status for Sneha Singh (STU1004) updated to Completed / Alumni Degree Clearance.', type: 'approval', icon: '🎓', time: '3 hours ago' },
    { title: 'Bulk Semester Tuition Fee Demand Created', desc: 'Fee head "Semester 1 Tuition Fee" of ₹25,000.00 assigned to all newly enrolled 2024 cohort scholars.', type: 'payment', icon: '➕', time: '1 day ago' },
    { title: 'MP-TAAS Scholarship Fee Credit Applied', desc: 'Post-Matric OBC welfare grant of ₹25,000.00 credited to scholar account STU1001 (Rahul Sharma).', type: 'admission', icon: '🌟', time: '1 day ago' }
];

function addAuditLogEntry(title, desc, type, icon) {
    auditLogsCache.unshift({ title, desc, type, icon: icon || 'ℹ️', time: 'Just now' });
    renderAuditTrail();
}

function renderAuditTrail(filter = 'all') {
    const container = document.getElementById('audit-list-container');
    if (!container) return;

    let list = auditLogsCache;
    if (filter !== 'all') {
        list = list.filter(item => item.type === filter);
    }

    container.innerHTML = '';
    list.forEach(item => {
        const div = document.createElement('div');
        div.className = 'audit-item';
        div.innerHTML = `
            <div class="audit-avatar">${item.icon}</div>
            <div style="flex: 1;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px;">
                    <h5 style="font-size: 13.5px; color: #0f2942; margin: 0;">${item.title}</h5>
                    <span style="font-size: 11px; color: #94a3b8;">${item.time}</span>
                </div>
                <p style="font-size: 12.5px; color: #475569; margin: 0;">${item.desc}</p>
            </div>
        `;
        container.appendChild(div);
    });
}

function filterAuditLogs(category) {
    ['all', 'payment', 'admission', 'approval'].forEach(c => {
        const btn = document.getElementById(`audit-filter-${c}`);
        if (btn) {
            if (c === category) {
                btn.style.background = '#0b3b60';
                btn.style.color = '#ffffff';
            } else {
                btn.style.background = '#ffffff';
                btn.style.color = '#0b3b60';
            }
        }
    });
    renderAuditTrail(category);
}
