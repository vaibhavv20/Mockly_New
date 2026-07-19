// script.js
// Mockly Landing Page Interactions & Animations

document.addEventListener('DOMContentLoaded', () => {
    const nav = document.querySelector('.glass-nav');
    const heroVisual = document.querySelector('.main-panel');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    
    // Theme Toggle
    const themeToggleBtn = document.getElementById('themeToggle');
    const darkIcon = document.querySelector('.dark-icon');
    const lightIcon = document.querySelector('.light-icon');
    
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            document.documentElement.classList.toggle('light');
            document.documentElement.classList.toggle('dark');
            
            // Trigger animation
            themeToggleBtn.classList.remove('animating');
            void themeToggleBtn.offsetWidth; // Force reflow
            themeToggleBtn.classList.add('animating');
            
            setTimeout(() => {
                themeToggleBtn.classList.remove('animating');
            }, 500);

            if (document.documentElement.classList.contains('light')) {
                darkIcon.style.display = 'none';
                lightIcon.style.display = 'block';
            } else {
                darkIcon.style.display = 'block';
                lightIcon.style.display = 'none';
            }
        });
    }

    // Avatar Cycling Logic
    const avatar1 = document.getElementById('avatar-1');
    const avatar2 = document.getElementById('avatar-2');
    const avatar3 = document.getElementById('avatar-3');
    
    if (avatar1 && avatar2 && avatar3) {
        const avatars = [
            'assets/avatars/memoji_1.png', 
            'assets/avatars/memoji_2.png', 
            'assets/avatars/memoji_3.png', 
            'assets/avatars/memoji_10.png', 
            'assets/avatars/memoji_5.png'
        ];
        let currentAvatarIndex = 0;
        
        setInterval(() => {
            // Fade out
            [avatar1, avatar2, avatar3].forEach(img => img.style.opacity = '0');
            
            // Swap and Fade in
            setTimeout(() => {
                currentAvatarIndex = (currentAvatarIndex + 1) % avatars.length;
                avatar1.src = avatars[currentAvatarIndex];
                avatar2.src = avatars[(currentAvatarIndex + 1) % avatars.length];
                avatar3.src = avatars[(currentAvatarIndex + 2) % avatars.length];
                
                [avatar1, avatar2, avatar3].forEach(img => img.style.opacity = '1');
            }, 300); // Wait for fade out
        }, 4000); // Change every 4 seconds
    }

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // 3D Tilt Effect removed to keep card fixed

    // Floating orbs follow mouse slightly
    const orbs = document.querySelectorAll('.glow-orb');
    if (window.innerWidth > 768) {
        document.addEventListener('mousemove', (e) => {
            const x = e.clientX / window.innerWidth;
            const y = e.clientY / window.innerHeight;
            
            orbs.forEach((orb, index) => {
                const speed = (index + 1) * 20;
                orb.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
            });
        });
    }

    // Intersection Observer for scroll animations
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    
    const revealOptions = {
        threshold: 0.15, // Trigger when 15% of the element is visible
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Stop observing once revealed
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });

    // Number Counter Animation
    const counters = document.querySelectorAll('.counter');
    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseFloat(entry.target.getAttribute('data-target'));
                const suffix = entry.target.getAttribute('data-suffix');
                const duration = 2000;
                const increment = target / (duration / 16); // ~60fps
                let current = 0;
                
                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        if (target % 1 === 0) {
                            entry.target.innerText = Math.ceil(current).toLocaleString() + suffix;
                        } else {
                            entry.target.innerText = current.toFixed(1) + suffix;
                        }
                        requestAnimationFrame(updateCounter);
                    } else {
                        if (target % 1 === 0) {
                            entry.target.innerText = target.toLocaleString() + suffix;
                        } else {
                            entry.target.innerText = target.toFixed(1) + suffix;
                        }
                    }
                };
                updateCounter();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));

    // Horizontal Scroll for Live Cards
    const scrollContainer = document.getElementById('liveCardsScroll');
    const scrollLeftBtn = document.getElementById('scrollLeftBtn');
    const scrollRightBtn = document.getElementById('scrollRightBtn');

    if(scrollContainer && scrollLeftBtn && scrollRightBtn) {
        scrollLeftBtn.addEventListener('click', () => {
            scrollContainer.scrollBy({ left: -410, behavior: 'smooth' });
        });
        scrollRightBtn.addEventListener('click', () => {
            scrollContainer.scrollBy({ left: 410, behavior: 'smooth' });
        });
    }

    // Mobile Menu Toggle Logic
    const mobileNavOverlay = document.getElementById('mobileNavOverlay');
    const mobileNavDrawer = document.getElementById('mobileNavDrawer');
    const closeDrawerBtn = document.getElementById('closeDrawerBtn');

    if(mobileMenuBtn && mobileNavOverlay && mobileNavDrawer && closeDrawerBtn) {
        const toggleDrawer = () => {
            mobileNavOverlay.classList.toggle('open');
            mobileNavDrawer.classList.toggle('open');
            document.body.style.overflow = mobileNavDrawer.classList.contains('open') ? 'hidden' : '';
        };

        mobileMenuBtn.addEventListener('click', toggleDrawer);
        closeDrawerBtn.addEventListener('click', toggleDrawer);
        mobileNavOverlay.addEventListener('click', toggleDrawer);
        
        const drawerItems = document.querySelectorAll('.drawer-item');
        drawerItems.forEach(item => {
            item.addEventListener('click', toggleDrawer);
        });
    }

    // Bilingual Toggle Demo in Hero Visual
    const langToggles = document.querySelectorAll('.bilingual-toggle span');
    langToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            if(e.target.innerText !== '|') {
                langToggles.forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
            }
        });
    });

    // ==========================================================================
    // AUTH MODAL LOGIC
    // ==========================================================================
    const authModal = document.getElementById('auth-modal');
    const closeAuthBtn = document.getElementById('close-auth');
    const navLoginBtn = document.getElementById('nav-login-btn');
    const navSignupBtn = document.getElementById('nav-signup-btn');
    
    const loginView = document.getElementById('login-view');
    const signupView = document.getElementById('signup-view');
    const goToSignup = document.getElementById('go-to-signup');
    const goToLogin = document.getElementById('go-to-login');

    // Open Modal - Show Login
    if(navLoginBtn) {
        navLoginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            authModal.style.display = 'flex';
            // Trigger reflow
            void authModal.offsetWidth;
            authModal.classList.add('active');
            
            loginView.style.display = 'block';
            loginView.style.opacity = '1';
            loginView.style.transform = 'translateX(0)';
            loginView.classList.add('active');
            
            signupView.style.display = 'none';
            signupView.style.opacity = '0';
            signupView.classList.remove('active');
            
            if(otpView) { otpView.style.display = 'none'; otpView.classList.remove('active'); }
            if(forgotPasswordView) { forgotPasswordView.style.display = 'none'; forgotPasswordView.classList.remove('active'); }
            if(resetPasswordView) { resetPasswordView.style.display = 'none'; resetPasswordView.classList.remove('active'); }
            
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        });
    }

    // Open Modal - Show Signup
    if(navSignupBtn) {
        navSignupBtn.addEventListener('click', (e) => {
            e.preventDefault();
            authModal.style.display = 'flex';
            void authModal.offsetWidth;
            authModal.classList.add('active');
            
            signupView.style.display = 'block';
            signupView.style.opacity = '1';
            signupView.style.transform = 'translateX(0)';
            signupView.classList.add('active');
            
            loginView.style.display = 'none';
            loginView.style.opacity = '0';
            loginView.classList.remove('active');

            if(otpView) { otpView.style.display = 'none'; otpView.classList.remove('active'); }
            if(forgotPasswordView) { forgotPasswordView.style.display = 'none'; forgotPasswordView.classList.remove('active'); }
            if(resetPasswordView) { resetPasswordView.style.display = 'none'; resetPasswordView.classList.remove('active'); }
            
            document.body.style.overflow = 'hidden';
        });
    }

    // Close Modal
    const closeModal = () => {
        authModal.classList.remove('active');
        setTimeout(() => {
            authModal.style.display = 'none';
            document.body.style.overflow = 'auto'; // Restore scrolling
        }, 400); // Wait for transition
    };

    if(closeAuthBtn) {
        closeAuthBtn.addEventListener('click', closeModal);
    }

    // Close if clicked outside
    if(authModal) {
        authModal.addEventListener('click', (e) => {
            if(e.target === authModal) {
                closeModal();
            }
        });
    }

    // --- View Toggling (Login vs Sign Up) within Modal ---
    if (goToSignup && goToLogin) {
        goToSignup.addEventListener('click', (e) => {
            e.preventDefault();
            loginView.style.opacity = '0';
            loginView.style.transform = 'translateX(-20px)';
            
            setTimeout(() => {
                loginView.classList.remove('active');
                loginView.style.display = 'none';
                
                signupView.style.display = 'block';
                void signupView.offsetWidth;
                
                signupView.classList.add('active');
                signupView.style.opacity = '1';
                signupView.style.transform = 'translateX(0)';
            }, 300);
        });

        goToLogin.addEventListener('click', (e) => {
            e.preventDefault();
            signupView.style.opacity = '0';
            signupView.style.transform = 'translateX(20px)';
            
            setTimeout(() => {
                signupView.classList.remove('active');
                signupView.style.display = 'none';
                
                loginView.style.display = 'block';
                void loginView.offsetWidth;
                
                loginView.classList.add('active');
                loginView.style.opacity = '1';
                loginView.style.transform = 'translateX(0)';
            }, 300);
        });
    }

    // --- Password Visibility Toggle ---
    const toggleButtons = document.querySelectorAll('.password-toggle');
    toggleButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input'); // The input field
            const icon = this.querySelector('i');
            
            if (input && input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });

    // --- Password Strength Logic ---
    const signupPasswordInput = document.getElementById('signup-password');
    const strengthBarFill = document.querySelector('.password-strength .fill');
    
    if (signupPasswordInput && strengthBarFill) {
        // Initialize to 0 width
        strengthBarFill.style.width = '0%';
        
        signupPasswordInput.addEventListener('input', (e) => {
            const val = e.target.value;
            let strength = 0;
            
            if (val.length >= 6) strength += 1;
            if (val.length >= 8) strength += 1;
            if (/[A-Z]/.test(val)) strength += 1;
            if (/[0-9]/.test(val)) strength += 1;
            if (/[^A-Za-z0-9]/.test(val)) strength += 1;
            
            let percentage = 0;
            let color = '#ef4444'; // Red
            
            if (val.length === 0) {
                percentage = 0;
            } else if (strength <= 2) {
                percentage = 33;
                color = '#ef4444'; // Red
            } else if (strength === 3 || strength === 4) {
                percentage = 66;
                color = '#f59e0b'; // Yellow/Orange
            } else {
                percentage = 100;
                color = '#10b981'; // Green
            }
            
            strengthBarFill.style.width = percentage + '%';
            strengthBarFill.style.background = color;
        });
    }

    // --- Avatar Selection Logic ---
    const avatarOptions = document.querySelectorAll('.avatar-option');
    const selectedAvatarInput = document.getElementById('selected-avatar');
    
    if (avatarOptions.length > 0 && selectedAvatarInput) {
        avatarOptions.forEach(option => {
            option.addEventListener('click', () => {
                avatarOptions.forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
                selectedAvatarInput.value = option.getAttribute('data-avatar');
            });
        });
    }

    const adminOtpForm = document.getElementById('admin-otp-form');
    if (adminOtpForm) {
        adminOtpForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = adminOtpForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerText;
            submitBtn.innerText = 'Verifying...';
            submitBtn.disabled = true;

            const email = document.getElementById('admin-otp-email').value;
            const otp = document.getElementById('admin-otp-input').value;

            try {
                const res = await fetch(`${API_URL}/admin-verify`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, otp })
                });

                const data = await res.json();
                if (res.ok) {
                    localStorage.setItem('adminToken', data.token);
                    showToast('Admin verified! Redirecting to panel...', 'success');
                    setTimeout(() => {
                        window.location.href = 'admin.html';
                    }, 800);
                } else {
                    showToast(`Error: ${data.msg}`, 'error');
                }
            } catch (err) {
                showToast('Network error, try again.', 'error');
            }
            submitBtn.innerText = originalText;
            submitBtn.disabled = false;
        });
    }

    // --- Mock Grid Carousel Arrows ---
    const mockGrid = document.getElementById('mockGrid');
    const mockLeftBtn = document.getElementById('mockLeftBtn');
    const mockRightBtn = document.getElementById('mockRightBtn');

    if (mockGrid && mockLeftBtn && mockRightBtn) {
        mockLeftBtn.addEventListener('click', () => {
            // Scroll by width of one column + gap
            mockGrid.scrollBy({ left: -382, behavior: 'smooth' }); 
        });
        mockRightBtn.addEventListener('click', () => {
            mockGrid.scrollBy({ left: 382, behavior: 'smooth' });
        });
    }

    // --- API Integration: Auth Forms ---
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const otpForm = document.getElementById('otp-form');
    const forgotPasswordForm = document.getElementById('forgot-password-form');
    const resetPasswordForm = document.getElementById('reset-password-form');
    
    // View elements
    const otpView = document.getElementById('otp-view');
    const forgotPasswordView = document.getElementById('forgot-password-view');
    const resetPasswordView = document.getElementById('reset-password-view');
    
    // Links/Buttons
    const forgotLink = document.querySelector('.forgot-link');
    const backToSignup = document.getElementById('back-to-signup');
    const backToLogin = document.getElementById('back-to-login');
    const navLogoutBtn = document.getElementById('nav-logout-btn');

    const API_URL = 'http://localhost:5000/api/auth';
    
    let pendingEmailForOTP = '';

    // --- Custom Toast UI ---
    const showToast = (msg, type = 'info') => {
        const container = document.getElementById('toast-container');
        if (!container) return;
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        let icon = 'fa-info-circle';
        if (type === 'success') icon = 'fa-check-circle';
        if (type === 'error') icon = 'fa-exclamation-circle';
        
        toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${msg}</span>`;
        container.appendChild(toast);
        
        // Trigger reflow for transition
        void toast.offsetWidth;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 400); // wait for transition
        }, 3000);
    };

    // Helper: Switch active auth view
    const switchAuthView = (hideView, showView) => {
        hideView.style.opacity = '0';
        setTimeout(() => {
            hideView.classList.remove('active');
            hideView.style.display = 'none';
            
            showView.style.display = 'block';
            void showView.offsetWidth;
            
            showView.classList.add('active');
            showView.style.opacity = '1';
        }, 300);
    };

    // --- Mock Cards Action Buttons (Notify & Attempt) ---
    const notifyBtns = document.querySelectorAll('.notify-btn');
    notifyBtns.forEach(btn => {
        btn.addEventListener('click', async function(e) {
            e.preventDefault();
            
            const token = localStorage.getItem('token');
            if (!token) {
                showToast('Please log in to receive notifications.', 'error');
                const loginBtn = document.getElementById('nav-login-btn');
                if (loginBtn) loginBtn.click();
                return;
            }

            if (this.classList.contains('notified')) return;
            
            const testName = this.getAttribute('data-test-name') || 'Upcoming Mock Test';
            const originalHTML = this.innerHTML;
            this.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';
            
            try {
                const res = await fetch(`${API_URL}/notify`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-auth-token': token
                    },
                    body: JSON.stringify({ testName })
                });

                const data = await res.json();
                
                if (res.ok) {
                    this.classList.add('notified');
                    this.innerHTML = '<i class="fa-solid fa-bell fa-shake"></i> Notified';
                    this.style.background = 'rgba(16, 185, 129, 0.2)';
                    this.style.color = '#34d399';
                    this.style.borderColor = 'rgba(16, 185, 129, 0.5)';
                    showToast(data.msg || `Notification set for ${testName}!`, 'success');
                } else {
                    this.innerHTML = originalHTML;
                    showToast(data.msg || 'Error setting notification', 'error');
                }
            } catch (err) {
                console.error(err);
                this.innerHTML = originalHTML;
                showToast('Server error. Please try again later.', 'error');
            }
        });
    });

    const attemptBtns = document.querySelectorAll('.attempt-btn:not(.notify-btn)');
    attemptBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const token = localStorage.getItem('token');
            if (!token) {
                showToast('Please log in to attempt tests.', 'error');
                const loginBtn = document.getElementById('nav-login-btn');
                if (loginBtn) loginBtn.click();
                return;
            }
            
            if (!this.classList.contains('launching')) {
                this.classList.add('launching');
                const originalHTML = this.innerHTML;
                this.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Loading test...';
                
                // Simulate redirect to test platform
                setTimeout(() => {
                    showToast('Redirecting to the test platform...', 'success');
                    this.innerHTML = originalHTML;
                    this.classList.remove('launching');
                }, 1500);
            }
        });
    });


    // Forgot Password Flow Triggers
    if (forgotLink) {
        forgotLink.addEventListener('click', (e) => {
            e.preventDefault();
            switchAuthView(loginView, forgotPasswordView);
        });
    }
    if (backToLogin) {
        backToLogin.addEventListener('click', (e) => {
            e.preventDefault();
            switchAuthView(forgotPasswordView, loginView);
        });
    }
    if (backToSignup) {
        backToSignup.addEventListener('click', (e) => {
            e.preventDefault();
            switchAuthView(otpView, signupView);
        });
    }

    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = signupForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerText;
            submitBtn.innerText = 'Sending OTP...';
            submitBtn.disabled = true;

            const firstName = document.getElementById('signup-fname').value;
            const lastName = document.getElementById('signup-lname').value;
            const email = document.getElementById('signup-email').value;
            const mobile = document.getElementById('signup-mobile').value;
            const password = document.getElementById('signup-password').value;
            const avatar = document.getElementById('selected-avatar').value;

            try {
                const res = await fetch(`${API_URL}/signup`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ firstName, lastName, email, mobile, password, avatar })
                });

                const data = await res.json();
                if (res.ok) {
                    // Success - OTP sent
                    pendingEmailForOTP = email;
                    showToast(data.msg, 'success'); // "OTP sent to email..."
                    switchAuthView(signupView, otpView);
                } else {
                    showToast(`Error: ${data.msg}`, 'error');
                }
            } catch (err) {
                console.error(err);
                showToast('An error occurred during sign up. Please try again.', 'error');
            } finally {
                submitBtn.innerText = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    if (otpForm) {
        otpForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = otpForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerText;
            submitBtn.innerText = 'Verifying...';
            submitBtn.disabled = true;

            const otp = document.getElementById('otp-input').value;

            try {
                const res = await fetch(`${API_URL}/verify-email`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: pendingEmailForOTP, otp })
                });

                const data = await res.json();
                if (res.ok) {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));
                    showToast('Email verified successfully! Redirecting...', 'success');
                    setTimeout(() => {
                        if (data.user.isAdmin) {
                            fetch(`${API_URL}/admin-login`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ email: data.user.email })
                            }).then(() => {
                                switchAuthView(document.getElementById('otp-view'), document.getElementById('admin-otp-view'));
                                document.getElementById('admin-otp-email').value = data.user.email;
                                showToast('Admin OTP sent to your email.', 'info');
                            }).catch(() => { window.location.href = 'dashboard.html'; });
                        } else {
                            window.location.href = 'dashboard.html';
                        }
                    }, 800);
                } else {
                    showToast(`Error: ${data.msg}`, 'error');
                }
            } catch (err) {
                console.error(err);
                showToast('An error occurred during verification.', 'error');
            } finally {
                submitBtn.innerText = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = loginForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerText;
            submitBtn.innerText = 'Signing In...';
            submitBtn.disabled = true;

            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            try {
                const res = await fetch(`${API_URL}/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                const data = await res.json();
                if (res.ok) {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));
                    showToast(`Welcome back, ${data.user.firstName}! Redirecting...`, 'success');
                    setTimeout(() => {
                        if (data.user.isAdmin) {
                            fetch(`${API_URL}/admin-login`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ email: data.user.email })
                            }).then(() => {
                                switchAuthView(document.getElementById('login-view'), document.getElementById('admin-otp-view'));
                                document.getElementById('admin-otp-email').value = data.user.email;
                                showToast('Admin OTP sent to your email.', 'info');
                            }).catch(() => { window.location.href = 'dashboard.html'; });
                        } else {
                            window.location.href = 'dashboard.html';
                        }
                    }, 800);
                } else {
                    showToast(`Error: ${data.msg}`, 'error');
                }
            } catch (err) {
                console.error(err);
                showToast('An error occurred during login. Please try again.', 'error');
            } finally {
                submitBtn.innerText = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = forgotPasswordForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerText;
            submitBtn.innerText = 'Sending...';
            submitBtn.disabled = true;

            const email = document.getElementById('forgot-email').value;

            try {
                const res = await fetch(`${API_URL}/forgot-password`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email })
                });

                const data = await res.json();
                if (res.ok) {
                    pendingEmailForOTP = email;
                    showToast(data.msg, 'success');
                    switchAuthView(forgotPasswordView, resetPasswordView);
                } else {
                    showToast(`Error: ${data.msg}`, 'error');
                }
            } catch (err) {
                console.error(err);
                showToast('An error occurred.', 'error');
            } finally {
                submitBtn.innerText = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    if (resetPasswordForm) {
        resetPasswordForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = resetPasswordForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerText;
            submitBtn.innerText = 'Resetting...';
            submitBtn.disabled = true;

            const otp = document.getElementById('reset-otp').value;
            const newPassword = document.getElementById('reset-new-password').value;

            try {
                const res = await fetch(`${API_URL}/reset-password`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: pendingEmailForOTP, otp, newPassword })
                });

                const data = await res.json();
                if (res.ok) {
                    showToast(data.msg, 'success');
                    switchAuthView(resetPasswordView, loginView);
                } else {
                    showToast(`Error: ${data.msg}`, 'error');
                }
            } catch (err) {
                console.error(err);
                showToast('An error occurred.', 'error');
            } finally {
                submitBtn.innerText = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    // --- Logout & Nav UI Update ---
    const updateNavUI = () => {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');
        
        const loginBtn = document.getElementById('nav-login-btn');
        const signupBtn = document.getElementById('nav-signup-btn');
        const userMenu = document.getElementById('user-menu');
        const userGreeting = document.getElementById('user-greeting');
        const navAvatar = document.getElementById('nav-avatar');

        if (token && userStr) {
            const user = JSON.parse(userStr);
            if (loginBtn) loginBtn.style.display = 'none';
            if (signupBtn) signupBtn.style.display = 'none';
            if (userMenu) {
                userMenu.style.display = 'flex';
                userMenu.style.position = 'relative';
                userMenu.style.gap = '0';
                userMenu.style.cursor = 'pointer';

                let dropdown = document.getElementById('nav-dropdown-menu');
                if (!dropdown) {
                    const profileLink = userMenu.querySelector('a[href="dashboard.html"]');
                    if (profileLink) {
                        profileLink.style.padding = '6px 16px 6px 6px';
                        profileLink.style.borderRadius = '30px';
                        profileLink.style.background = 'rgba(255,255,255,0.05)';
                        profileLink.style.border = '1px solid var(--border-glass)';
                        profileLink.style.transition = 'all 0.3s';
                        profileLink.addEventListener('mouseenter', () => profileLink.style.background = 'rgba(255,255,255,0.1)');
                        profileLink.addEventListener('mouseleave', () => profileLink.style.background = 'rgba(255,255,255,0.05)');
                    }
                    dropdown = document.createElement('div');
                    dropdown.id = 'nav-dropdown-menu';
                    dropdown.style.position = 'absolute';
                    dropdown.style.top = '100%';
                    dropdown.style.right = '0';
                    dropdown.style.marginTop = '10px';
                    dropdown.style.background = 'var(--bg-deep, #0a0a0f)';
                    dropdown.style.border = '1px solid var(--border-glass)';
                    dropdown.style.borderRadius = '12px';
                    dropdown.style.padding = '8px';
                    dropdown.style.display = 'none';
                    dropdown.style.flexDirection = 'column';
                    dropdown.style.gap = '4px';
                    dropdown.style.minWidth = '160px';
                    dropdown.style.boxShadow = '0 10px 30px rgba(0,0,0,0.5)';
                    dropdown.style.zIndex = '100';
                    dropdown.style.backdropFilter = 'blur(20px)';
                    userMenu.appendChild(dropdown);
                    
                    let hoverTimeout;
                    userMenu.addEventListener('mouseenter', () => {
                        clearTimeout(hoverTimeout);
                        dropdown.style.display = 'flex';
                    });
                    userMenu.addEventListener('mouseleave', () => {
                        hoverTimeout = setTimeout(() => {
                            dropdown.style.display = 'none';
                        }, 200);
                    });
                    
                    const logoutBtn = document.getElementById('nav-logout-btn');
                    if (logoutBtn) {
                        logoutBtn.style.border = 'none';
                        logoutBtn.style.width = '100%';
                        logoutBtn.style.textAlign = 'left';
                        logoutBtn.style.padding = '10px 16px';
                        logoutBtn.style.justifyContent = 'flex-start';
                        logoutBtn.style.borderRadius = '8px';
                        logoutBtn.addEventListener('mouseenter', () => logoutBtn.style.background = 'rgba(255,59,48,0.1)');
                        logoutBtn.addEventListener('mouseleave', () => logoutBtn.style.background = 'transparent');
                        dropdown.appendChild(logoutBtn);
                    }
                }
                if (userGreeting) {
                    userGreeting.innerHTML = `Hi, ${user.firstName || 'User'}`;
                }
                if (navAvatar) {
                    navAvatar.src = `assets/avatars/memoji_${user.avatar || '1'}.png`;
                }
                let adminBtn = document.getElementById('nav-admin-btn');
                if (user.isAdmin) {
                    if (!adminBtn) {
                        adminBtn = document.createElement('a');
                        adminBtn.id = 'nav-admin-btn';
                        adminBtn.href = '#';
                        adminBtn.className = 'btn-ghost';
                        adminBtn.style.border = 'none';
                        adminBtn.style.width = '100%';
                        adminBtn.style.textAlign = 'left';
                        adminBtn.style.padding = '10px 16px';
                        adminBtn.style.justifyContent = 'flex-start';
                        adminBtn.style.borderRadius = '8px';
                        adminBtn.style.color = 'var(--primary-color)';
                        adminBtn.style.textDecoration = 'none';
                        adminBtn.addEventListener('mouseenter', () => adminBtn.style.background = 'rgba(99,102,241,0.1)');
                        adminBtn.addEventListener('mouseleave', () => adminBtn.style.background = 'transparent');
                        adminBtn.innerText = 'Admin Panel';
                        adminBtn.addEventListener('click', (e) => {
                            e.preventDefault();
                            if (localStorage.getItem('adminToken')) {
                                window.location.href = 'admin.html';
                            } else {
                                fetch(`${API_URL}/admin-login`, {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ email: user.email })
                                }).then(() => {
                                    const authModal = document.getElementById('auth-modal');
                                    if (authModal) {
                                        authModal.style.display = 'flex';
                                        void authModal.offsetWidth;
                                        authModal.classList.add('active');
                                        document.querySelectorAll('.auth-view').forEach(v => {
                                            v.style.display = 'none';
                                            v.style.opacity = '0';
                                            v.classList.remove('active');
                                        });
                                        const adminOtpView = document.getElementById('admin-otp-view');
                                        adminOtpView.style.display = 'block';
                                        void adminOtpView.offsetWidth;
                                        adminOtpView.classList.add('active');
                                        adminOtpView.style.opacity = '1';
                                        document.getElementById('admin-otp-email').value = user.email;
                                        showToast('Admin OTP sent to your email.', 'info');
                                    } else {
                                        // Fallback if auth modal doesn't exist on this page
                                        window.location.href = 'index.html';
                                    }
                                }).catch(() => { showToast('Error sending OTP', 'error'); });
                            }
                        });
                        const logoutBtn = document.getElementById('nav-logout-btn');
                        if (dropdown) {
                            if (logoutBtn) {
                                dropdown.insertBefore(adminBtn, logoutBtn);
                            } else {
                                dropdown.appendChild(adminBtn);
                            }
                        }
                    }
                } else {
                    if (adminBtn) adminBtn.remove();
                }
            }
        } else {
            if (loginBtn) loginBtn.style.display = 'inline-block';
            if (signupBtn) signupBtn.style.display = 'inline-block';
            if (userMenu) userMenu.style.display = 'none';
        }
    };

    if (navLogoutBtn) {
        navLogoutBtn.addEventListener('click', async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    await fetch(`${API_URL}/logout`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'x-auth-token': token
                        }
                    });
                } catch (err) {
                    console.error('Logout error:', err);
                }
            }
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('adminToken');
            updateNavUI();
            showToast('You have been logged out.', 'info');
        });
    }

    // Initialize UI on load
    updateNavUI();

    // === CURRENT AFFAIRS INTERACTIVITY ===

    // Category Filter Pills
    const caFilters = document.getElementById('ca-filters');
    if (caFilters) {
        const filterPills = caFilters.querySelectorAll('.ca-filter-pill');
        const caHero = document.querySelector('.ca-hero');
        const caTimelineCards = document.querySelectorAll('.ca-timeline-card');

        filterPills.forEach(pill => {
            pill.addEventListener('click', () => {
                // Update active pill
                filterPills.forEach(p => p.classList.remove('active'));
                pill.classList.add('active');

                const category = pill.getAttribute('data-category');

                // Filter hero card
                if (caHero) {
                    if (category === 'all' || caHero.getAttribute('data-category') === category) {
                        caHero.style.display = '';
                        caHero.style.opacity = '1';
                        caHero.style.transform = '';
                    } else {
                        caHero.style.display = 'none';
                    }
                }

                // Filter timeline cards
                caTimelineCards.forEach(card => {
                    const cardCat = card.getAttribute('data-category');
                    if (category === 'all' || cardCat === category) {
                        card.style.display = '';
                        card.style.opacity = '1';
                        card.style.animation = 'ca-slide-in 0.4s ease forwards';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    // Bookmark Toggle
    document.querySelectorAll('.ca-bookmark-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            btn.classList.toggle('bookmarked');
            const icon = btn.querySelector('i');
            if (btn.classList.contains('bookmarked')) {
                icon.classList.remove('fa-regular');
                icon.classList.add('fa-solid');
                showToast('Article bookmarked!', 'success');
            } else {
                icon.classList.remove('fa-solid');
                icon.classList.add('fa-regular');
                showToast('Bookmark removed.', 'info');
            }
        });
    });

});

// === QUIZ HANDLER (Global scope for onclick) ===
function handleQuiz(selectedBtn) {
    const container = selectedBtn.closest('.ca-quiz-options');
    const allOpts = container.querySelectorAll('.ca-quiz-opt');
    const feedbackEl = selectedBtn.closest('.ca-quiz-card').querySelector('.ca-quiz-feedback');
    const isCorrect = selectedBtn.getAttribute('data-correct') === 'true';

    // Disable all options
    allOpts.forEach(opt => {
        opt.classList.add('answered');
        if (opt.getAttribute('data-correct') === 'true') {
            opt.classList.add('correct');
        } else if (opt === selectedBtn && !isCorrect) {
            opt.classList.add('wrong');
        }
    });

    // Show feedback
    if (feedbackEl) {
        feedbackEl.style.display = 'block';
        if (isCorrect) {
            feedbackEl.className = 'ca-quiz-feedback correct-feedback';
            feedbackEl.innerHTML = '<i class="fa-solid fa-check-circle"></i> Correct! Well done. Keep up the streak!';
        } else {
            feedbackEl.className = 'ca-quiz-feedback wrong-feedback';
            const correctAnswer = container.querySelector('[data-correct="true"]').textContent;
            feedbackEl.innerHTML = `<i class="fa-solid fa-xmark"></i> Incorrect. The correct answer is <b>${correctAnswer}</b>.`;
        }
    }
}
// --- Hero Search Functionality ---
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('hero-search-input');
    const searchBtn = document.getElementById('hero-search-btn');
    const categoryTabs = document.querySelectorAll('#hero-category-tabs .tab-btn');
    
    let currentCategory = 'all';

    if (categoryTabs.length > 0) {
        categoryTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active styling from all
                categoryTabs.forEach(t => {
                    t.classList.remove('active');
                    t.style.background = 'transparent';
                    t.style.border = '1px solid var(--border-glass)';
                    t.style.color = 'var(--text-muted)';
                });
                // Add active styling to clicked
                tab.classList.add('active');
                tab.style.background = 'rgba(138, 43, 226, 0.2)';
                tab.style.border = '1px solid var(--primary-color)';
                tab.style.color = 'var(--text-main)';
                
                currentCategory = tab.getAttribute('data-category');
            });
        });
    }

    const performSearch = () => {
        const query = searchInput.value.trim();
        if (query) {
            // Redirect to exams page with search query and category
            window.location.href = "exams.html?q=" + encodeURIComponent(query) + "&category=" + currentCategory;
        } else if (currentCategory !== 'all') {
            window.location.href = "exams.html?category=" + currentCategory;
        } else {
            searchInput.focus();
        }
    };

    if (searchBtn) {
        searchBtn.addEventListener('click', performSearch);
    }
    
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
});

// --- Fetch and Render Live Free Mock Tests ---
document.addEventListener('DOMContentLoaded', async () => {
    const mockGrid = document.getElementById('mockGrid');
    if (!mockGrid) return;

    try {
        // Fetch all free mock tests, and filter out 'Live Test Series' below
        const response = await fetch('http://localhost:5000/api/papers?isFree=true');
        const data = await response.json();
        
        if (data.success && data.papers) {
            // Filter out tests that are marked as Live Test Series (since they appear in the Hero slider)
            const gridPapers = data.papers.filter(p => p.paperType !== 'Live Test Series');
            
            if (gridPapers.length > 0) {
                mockGrid.innerHTML = ''; // Clear empty state
                gridPapers.forEach(paper => {
                    const card = document.createElement('div');
                    card.className = 'mock-card glass-card hover-lift';
                
                // Determine badge tags
                const examTag = paper.examName || paper.category || 'SSC';

                // Check if test is upcoming
                const isUpcoming = paper.startTime && new Date(paper.startTime) > new Date();

                const diffLabel = paper.difficulty || 'MODERATE';
                let activeBars = 3;
                if (diffLabel === 'EASY') activeBars = 2;
                else if (diffLabel === 'HARD') activeBars = 5;

                let diffBarsHTML = '';
                for (let i = 0; i < 5; i++) {
                    if (i < activeBars) diffBarsHTML += '<div class="diff-bar active"></div>';
                    else diffBarsHTML += '<div class="diff-bar"></div>';
                }
                
                let totalQuestions = 0;
                if (paper.sections && paper.sections.length > 0) {
                    totalQuestions = paper.sections.reduce((acc, sec) => acc + (sec.questions ? sec.questions.length : 0), 0);
                }
                const qsCount = totalQuestions > 0 ? totalQuestions : (paper.qs || 100);

            let notifiedTests = JSON.parse(localStorage.getItem('notifiedTests') || '[]');
            const isNotified = notifiedTests.includes(paper._id);

            const cardHTML = `
                <div class="mock-card-header">
                    <span class="exam-badge bg-blue-light text-blue">${examTag}</span>
                    ${paper.isFree ? '<span class="free-badge">Free</span>' : ''}
                </div>
                
                <h3 class="mock-title">${paper.title}</h3>
                <div class="mock-subtitle">${paper.verifiedTag || 'TCS PATTERN VERIFIED'}</div>
                
                <div class="mock-stats">
                    <div class="mock-stat"><i class="fa-solid fa-list-ol text-purple"></i> ${qsCount} Qs</div>
                    <div class="mock-stat"><i class="fa-regular fa-clock text-orange"></i> ${paper.duration || 60} Mins</div>
                    <div class="mock-stat"><i class="fa-solid fa-language text-green"></i> Eng / Hindi</div>
                </div>
                
                <div class="difficulty-row" style="margin-bottom: 20px;">
                    <span class="diff-label">Difficulty:</span>
                    <div class="diff-bars">
                        ${diffBarsHTML}
                    </div>
                    <span class="diff-text">${diffLabel}</span>
                </div>
                
                <div class="mock-enrolled" style="margin-bottom: 20px;">
                    <div class="avatar-group-small">
                        <img src="assets/avatars/memoji_1.png" class="avatar-sm">
                        <img src="assets/avatars/memoji_2.png" class="avatar-sm">
                        <img src="assets/avatars/memoji_3.png" class="avatar-sm">
                    </div>
                    <span class="text-muted text-sm">${((paper.enrolledCount || Math.floor(Math.random() * 50000 + 10000)) / 1000).toFixed(1)}k registered</span>
                </div>
                
                <div class="mock-card-footer" style="margin-top: auto;">
                    <button class="${!isUpcoming ? 'btn-primary w-100 attempt-btn' : (isNotified ? 'btn-dark w-100 notified' : 'btn-dark w-100')}" data-id="${paper._id}" ${isUpcoming ? `onclick="window.showNotifyToast('${paper._id}', '${paper.title.replace(/'/g, "\\'")}', this)"` : ''} ${isNotified ? 'style="background: rgba(16, 185, 129, 0.2); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.5);"' : ''}>
                        ${!isUpcoming ? 'Attempt Free Now <i class="fa-solid fa-arrow-right" style="margin-left: 5px;"></i>' : (isNotified ? '<i class="fa-solid fa-bell fa-shake"></i> Notified' : '<i class="fa-regular fa-bell"></i> Notify Me')}
                    </button>
                </div>
            `;
                    card.innerHTML = cardHTML;
                    mockGrid.appendChild(card);
                });

                // Attach event listeners for Auth Guard
                document.querySelectorAll('.attempt-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const testId = e.currentTarget.getAttribute('data-id');
                        if (!testId || testId === 'null' || testId === 'undefined') return;
                        const token = localStorage.getItem('token');
                        if (token) {
                            window.location.href = `tcs-exam.html?id=${testId}`;
                        } else {
                            e.preventDefault();
                            if (typeof openLoginModal === 'function') {
                                openLoginModal();
                            } else {
                                window.location.href = 'login.html';
                            }
                        }
                    });
                });
            
            } else {
                mockGrid.innerHTML = '<p style="color: var(--text-muted); padding: 20px;">No free mock tests are available at the moment. Please check back later.</p>';
            }
        }
    } catch (error) {
        console.error('Error fetching mock tests:', error);
        mockGrid.innerHTML = '<p style="color: var(--text-muted); padding: 20px; text-align: center; width: 100%;">Failed to load tests. Ensure backend is running.</p>';
    }
});
window.showNotifyToast = async function(testId, testName, btnElement) {
    const token = localStorage.getItem('token');
    if (!token) {
        if(typeof showToast === 'function') showToast('Please log in to receive notifications.', 'error');
        else alert('Please log in to receive notifications.');
        const loginBtn = document.getElementById('nav-login-btn');
        if (loginBtn) loginBtn.click();
        return;
    }
    
    if (btnElement && btnElement.classList.contains('notified')) return;
    
    const originalHTML = btnElement ? btnElement.innerHTML : '';
    if(btnElement) btnElement.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';
    
    try {
        const res = await fetch('http://localhost:5000/api/auth/notify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token
            },
            body: JSON.stringify({ testId, testName })
        });
        const data = await res.json();
        
        if (res.ok) {
            // Save to localStorage
            let notifiedTests = JSON.parse(localStorage.getItem('notifiedTests') || '[]');
            if(!notifiedTests.includes(testId)) {
                notifiedTests.push(testId);
                localStorage.setItem('notifiedTests', JSON.stringify(notifiedTests));
            }
            
            if(btnElement) {
                btnElement.classList.add('notified');
                btnElement.innerHTML = '<i class="fa-solid fa-bell fa-shake"></i> Notified';
                btnElement.style.background = 'rgba(16, 185, 129, 0.2)';
                btnElement.style.color = '#34d399';
                btnElement.style.borderColor = 'rgba(16, 185, 129, 0.5)';
                btnElement.style.pointerEvents = 'none';
            }
            if(typeof showToast === 'function') showToast(data.msg || `Notification set for ${testName}!`, 'success');
            else alert(data.msg || `Notification set for ${testName}!`);
        } else {
            if(btnElement) btnElement.innerHTML = originalHTML;
            if(typeof showToast === 'function') showToast(data.msg || 'Error setting notification', 'error');
            else alert(data.msg || 'Error setting notification');
        }
    } catch(err) {
        console.error(err);
        if(btnElement) btnElement.innerHTML = originalHTML;
        if(typeof showToast === 'function') showToast('Server error. Please try again later.', 'error');
        else alert('Server error.');
    }
};
