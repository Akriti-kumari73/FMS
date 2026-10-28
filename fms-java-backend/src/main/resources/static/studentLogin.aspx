<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AccSoft 2.0 Login - IES University Bhopal</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body class="accsoft-page-body">

    <!-- Institutional Top Information Strip -->
    <div class="ies-top-strip">
        <div class="strip-left">
            <span class="strip-tag">🏛️ IES UNIVERSITY BHOPAL</span>
            <span>UGC Recognized | AICTE Approved | MP PURC | IGBC Gold Certified Green Campus</span>
        </div>
        <div class="strip-right">
            <span>📅 Academic Session: <strong>2024-2025</strong></span>
            <span>📍 Ratibad Main Road, Bhopal</span>
            <span>📞 Helpdesk: 0755-4088888</span>
        </div>
    </div>

    <!-- Official IES University AccSoft 2.0 Header Bar -->
    <header class="navbar" style="background: #0b3b60; border-bottom: 3px solid #f59e0b; padding: 12px 28px;">
        <div class="navbar-left">
            <a href="studentLogin.aspx" class="brand" style="display: flex; align-items: center; gap: 12px; text-decoration: none;">
                <div style="width: 44px; height: 44px; background: #ffffff; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.25); border: 2px solid #f59e0b;">
                    🏛️
                </div>
                <div>
                    <div style="font-size: 17px; font-weight: 800; color: #ffffff; letter-spacing: -0.3px; line-height: 1.1;">
                        IES UNIVERSITY & GROUP OF INSTITUTIONS
                    </div>
                    <div style="font-size: 11.5px; color: #f59e0b; font-weight: 600; letter-spacing: 0.3px;">
                        AccSoft 2.0 Web Campus ERP | Student & Parent Access Portal
                    </div>
                </div>
            </a>
        </div>
        <div class="nav-links">
            <button class="active" id="tab-btn-login-view" onclick="switchAuthView('login')" style="border-radius: 4px; padding: 6px 14px; font-size: 13px;">
                🔑 AccSoft Login
            </button>
            <button id="tab-btn-reg-view" onclick="switchAuthView('register')" style="border-radius: 4px; padding: 6px 14px; font-size: 13px;">
                📝 SignUp (New User)
            </button>
        </div>
    </header>

    <!-- Main Content Area -->
    <main style="flex: 1; display: flex; align-items: center; justify-content: center; padding: 24px 16px;">
        <div class="accsoft-wrapper">

            <!-- ========================================== -->
            <!-- 1. ACCSOFT 2.0 LOGIN CARD (EXACT AS ASPX)  -->
            <!-- ========================================== -->
            <div id="auth-login-card" class="accsoft-card">
                
                <!-- AccSoft Header Bar -->
                <div class="accsoft-card-topbar">
                    <h3>
                        <span>🔐</span>
                        <span>AccSoft 2.0 Login</span>
                    </h3>
                    <span style="font-size: 11px; background: rgba(245, 158, 11, 0.25); color: #fef08a; padding: 2px 8px; border-radius: 3px; font-weight: 700;">
                        WEB CAMPUS
                    </span>
                </div>

                <!-- Role Selector Tabs (Parent/Student vs Staff/Admin) -->
                <div class="accsoft-role-tabs">
                    <button type="button" class="accsoft-role-tab active" id="role-btn-student" onclick="selectLoginRole('student')">
                        🎓 Parent / Student
                    </button>
                    <button type="button" class="accsoft-role-tab" id="role-btn-admin" onclick="selectLoginRole('admin')">
                        🛡️ Staff / Admin
                    </button>
                </div>
                <input type="hidden" id="login-selected-role" value="student">

                <!-- Login Form Body -->
                <div class="accsoft-form-body">
                    <form onsubmit="handleUnifiedLogin(event)">
                        
                        <!-- User Name Input -->
                        <div style="margin-bottom: 16px;">
                            <div class="accsoft-field-label">
                                <label id="login-id-label" for="login-identifier">User Name / Scholar ID *</label>
                                <span class="accsoft-required">Required!</span>
                            </div>
                            <div style="position: relative;">
                                <input 
                                    type="text" 
                                    id="login-identifier" 
                                    class="accsoft-input" 
                                    required 
                                    autocomplete="username" 
                                    placeholder="Enter Scholar Number / Enrollment ID"
                                    value="STU1001"
                                >
                            </div>
                        </div>

                        <!-- Password Input -->
                        <div style="margin-bottom: 18px;">
                            <div class="accsoft-field-label">
                                <label for="login-password">Password *</label>
                                <span class="accsoft-required">Required!</span>
                            </div>
                            <div class="password-wrapper">
                                <input 
                                    type="password" 
                                    id="login-password" 
                                    class="accsoft-input" 
                                    required 
                                    autocomplete="current-password" 
                                    placeholder="Enter your password"
                                    value="rahul123"
                                >
                                <button type="button" class="password-toggle-btn" onclick="togglePassword('login-password', this)" aria-label="Show password" style="right: 10px;">
                                    👁️
                                </button>
                            </div>
                        </div>

                        <!-- 1-Click Evaluation Quick Chips -->
                        <div style="background: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 4px; padding: 10px 12px; margin-bottom: 18px;">
                            <div style="font-size: 11px; font-weight: 700; color: #64748b; margin-bottom: 6px;">⚡ Quick Test Credentials:</div>
                            <div style="display: flex; gap: 6px; flex-wrap: wrap;">
                                <button type="button" class="chip-btn" onclick="quickFillLogin('STU1001', 'rahul123', 'student')" style="padding: 3px 8px; font-size: 11px; background: #ffffff; border: 1px solid #94a3b8; color: #0b3b60; border-radius: 3px;">
                                    👤 Scholar (STU1001)
                                </button>
                                <button type="button" class="chip-btn" onclick="quickFillLogin('admin', 'admin123', 'admin')" style="padding: 3px 8px; font-size: 11px; background: #ffffff; border: 1px solid #94a3b8; color: #0b3b60; border-radius: 3px;">
                                    🛡️ Admin (admin)
                                </button>
                                <button type="button" class="chip-btn" onclick="quickFillLogin('newstudent@ies.com', 'testpass123', 'student')" style="padding: 3px 8px; font-size: 11px; background: #ffffff; border: 1px solid #94a3b8; color: #0b3b60; border-radius: 3px;">
                                    ✨ Test Unregistered
                                </button>
                            </div>
                        </div>

                        <!-- Primary Sign In Button -->
                        <button type="submit" class="accsoft-login-btn" id="btn-login-submit">
                            Sign In / Logging In...
                        </button>

                        <!-- Action Links Row -->
                        <div class="accsoft-action-links">
                            <a href="#" onclick="showToast('For password assistance, please contact IES University IT Helpdesk: 0755-4088888', 'info')">
                                🔑 Forgot Password?
                            </a>
                            <a href="#" onclick="switchAuthView('register')" style="color: #0b3b60; font-weight: 700;">
                                📝 SignUp (New User) →
                            </a>
                        </div>
                    </form>
                </div>
            </div>

            <!-- ========================================== -->
            <!-- 2. REGISTRATION CARD: SIGNUP (NEW USER)    -->
            <!-- ========================================== -->
            <div id="auth-register-card" class="accsoft-card hidden">
                
                <!-- AccSoft Header Bar -->
                <div class="accsoft-card-topbar">
                    <h3>
                        <span>📝</span>
                        <span>AccSoft 2.0 - Student SignUp</span>
                    </h3>
                    <span style="font-size: 11px; background: rgba(245, 158, 11, 0.25); color: #fef08a; padding: 2px 8px; border-radius: 3px; font-weight: 700;">
                        NEW SCHOLAR
                    </span>
                </div>

                <div class="accsoft-form-body">
                    <p class="text-muted" style="font-size: 12.5px; margin-bottom: 16px;">
                        First-time registration for IES University & Group of Institutions students. Fill in your details to activate your AccSoft account.
                    </p>

                    <form onsubmit="handleStudentRegister(event)">
                        
                        <div class="form-group" style="margin-bottom: 14px;">
                            <label for="reg-institute" style="font-size: 12.5px; font-weight: 600; color: #1e293b;">Select Institution *</label>
                            <select id="reg-institute" class="accsoft-input">
                                <option value="IES University, Bhopal" selected>I.E.S. University, Bhopal</option>
                                <option value="IES College of Technology (ICET)">IES College of Technology (ICET)</option>
                                <option value="IES Institute of Technology & Management">IES Institute of Technology & Management</option>
                                <option value="IES Institute of Pharmacy">IES Institute of Pharmacy</option>
                            </select>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label for="reg-name" style="font-size: 12.5px; font-weight: 600; color: #1e293b;">Scholar Full Name *</label>
                                <input type="text" id="reg-name" class="accsoft-input" required placeholder="e.g. Rohit Kumar" autocomplete="name">
                            </div>
                            <div class="form-group">
                                <label for="reg-father" style="font-size: 12.5px; font-weight: 600; color: #1e293b;">Father's / Guardian Name</label>
                                <input type="text" id="reg-father" class="accsoft-input" placeholder="e.g. Mr. Satish Kumar">
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label for="reg-email" style="font-size: 12.5px; font-weight: 600; color: #1e293b;">Email Address *</label>
                                <input type="email" id="reg-email" class="accsoft-input" required placeholder="rohit@example.com" autocomplete="email">
                            </div>
                            <div class="form-group">
                                <label for="reg-dob" style="font-size: 12.5px; font-weight: 600; color: #1e293b;">Date of Birth</label>
                                <input type="date" id="reg-dob" class="accsoft-input" value="2004-06-15">
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label for="reg-course" style="font-size: 12.5px; font-weight: 600; color: #1e293b;">Degree Program</label>
                                <select id="reg-course" class="accsoft-input">
                                    <option value="B.Tech" selected>B.Tech</option>
                                    <option value="Diploma">Diploma (Polytechnic)</option>
                                    <option value="BCA">BCA</option>
                                    <option value="MCA">MCA</option>
                                    <option value="BBA">BBA</option>
                                    <option value="MBA">MBA</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="reg-branch" style="font-size: 12.5px; font-weight: 600; color: #1e293b;">Branch / Specialization</label>
                                <input type="text" id="reg-branch" class="accsoft-input" placeholder="e.g. CSE" value="CSE">
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label for="reg-semester" style="font-size: 12.5px; font-weight: 600; color: #1e293b;">Admission Semester</label>
                                <select id="reg-semester" class="accsoft-input">
                                    <option value="1st" selected>1st Semester</option>
                                    <option value="2nd">2nd Semester</option>
                                    <option value="3rd">3rd Semester (Lateral)</option>
                                    <option value="4th">4th Semester</option>
                                    <option value="5th">5th Semester</option>
                                    <option value="6th">6th Semester</option>
                                    <option value="7th">7th Semester</option>
                                    <option value="8th">8th Semester</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="reg-batch" style="font-size: 12.5px; font-weight: 600; color: #1e293b;">Academic Batch</label>
                                <input type="text" id="reg-batch" class="accsoft-input" placeholder="e.g. 2024-2028" value="2024-2028">
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label for="reg-password" style="font-size: 12.5px; font-weight: 600; color: #1e293b;">Create Password *</label>
                                <div class="password-wrapper">
                                    <input 
                                        type="password" 
                                        id="reg-password" 
                                        class="accsoft-input"
                                        required 
                                        autocomplete="new-password" 
                                        placeholder="Min. 6 chars" 
                                        oninput="checkPasswordStrength(this.value); checkPasswordMatch();"
                                    >
                                    <button type="button" class="password-toggle-btn" onclick="togglePassword('reg-password', this)" aria-label="Show password" style="right: 10px;">
                                        👁️
                                    </button>
                                </div>
                                <div class="password-strength-bar">
                                    <div class="strength-fill" id="password-strength-fill"></div>
                                </div>
                            </div>

                            <div class="form-group">
                                <label for="reg-confirm-password" style="font-size: 12.5px; font-weight: 600; color: #1e293b;">Confirm Password *</label>
                                <div class="password-wrapper">
                                    <input 
                                        type="password" 
                                        id="reg-confirm-password" 
                                        class="accsoft-input"
                                        required 
                                        placeholder="Re-type password"
                                        oninput="checkPasswordMatch()"
                                    >
                                    <button type="button" class="password-toggle-btn" onclick="togglePassword('reg-confirm-password', this)" aria-label="Show password" style="right: 10px;">
                                        👁️
                                    </button>
                                </div>
                                <div id="password-match-msg" style="font-size: 11px; font-weight: 700; margin-top: 4px;"></div>
                            </div>
                        </div>

                        <button type="submit" class="accsoft-login-btn" id="btn-student-register" style="margin-top: 14px;">
                            ✓ Complete SignUp & Activate Portal
                        </button>

                        <div class="accsoft-action-links" style="justify-content: center;">
                            <a href="#" onclick="switchAuthView('login')">
                                ← Back to AccSoft 2.0 Login
                            </a>
                        </div>
                    </form>
                </div>
            </div>

        </div>
    </main>

    <!-- Official AccSoft 2.0 Footer (Exact as IES Website) -->
    <footer class="accsoft-footer">
        <div>
            <strong>AccSoft 2.0</strong> - A Product For Educational Institute By <strong>Emperor Solutions Pvt. Ltd.</strong>
        </div>
        <div style="margin-top: 4px; font-size: 11px; color: #94a3b8;">
            Updated On : 2024-2025 | IES University Bhopal, Madhya Pradesh | All Rights Reserved
        </div>
    </footer>

    <!-- Scripts -->
    <script src="js/app.js"></script>
</body>
</html>