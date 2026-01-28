/**
 * ============================================================================
 * Login System - CoffeeHouse
 * Handles user login, registration, checks, and session management
 * ============================================================================
 */

// ============================================================================
// CONFIGURATION
// ============================================================================

const AUTH_CONFIG = {
    STORAGE_KEYS: {
        USER: 'coffeehouse_user',
        REMEMBER: 'coffeehouse_remember',
        USERS: 'coffeehouse_users'
    },
    MIN_PASSWORD_LENGTH: 8,
    TOKEN_EXPIRY: 24 * 60 * 60 * 1000 // 24 hours
};

// ============================================================================
// HELPER FUNCTIONS - Notifications & Checks
// ============================================================================

/**
 * Sanitize user input to prevent XSS attacks
 * @param {string} input - The user input to sanitize
 * @returns {string} Sanitized input
 */
function sanitizeInput(input) {
    if (typeof input !== 'string') return '';

    return input.trim()
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '')
        .replace(/<[^>]*>/g, '')
        .replace(/["'<>]/g, '')
        .substring(0, 500);
}

/**
 * Show loading state on form submit button
 * @param {HTMLButtonElement} button - The button to show loading on
 * @param {string} loadingText - Text to display during loading
 */
function showLoadingState(button, loadingText = 'Processing...') {
    button.dataset.originalText = button.innerHTML;
    button.disabled = true;
    button.innerHTML = `<i class="fas fa-spinner fa-spin me-2"></i>${loadingText}`;
}

/**
 * Hide loading state and restore button
 * @param {HTMLButtonElement} button - The button to restore
 */
function hideLoadingState(button) {
    button.disabled = false;
    button.innerHTML = button.dataset.originalText || 'Submit';
    delete button.dataset.originalText;
}

/**
 * Display a toast notification message with accessibility
 * Automatically hides after 3 seconds
 * @param {string} message - The message to display
 * @param {string} type - The notification type: 'success', 'error', 'warning', or 'info'
 */
function showToast(message, type = 'success') {
    // Remove existing toast
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) {
        existingToast.remove();
    }

    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${type}`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'polite');

    const icon = type === 'success' ? 'fa-check-circle' :
        type === 'error' ? 'fa-exclamation-circle' :
            type === 'warning' ? 'fa-exclamation-triangle' : 'fa-info-circle';

    toast.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="fas ${icon} me-2" aria-hidden="true"></i>
            <span>${sanitizeInput(message)}</span>
        </div>
    `;

    // Add styles
    Object.assign(toast.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: type === 'success' ? 'var(--success-color)' :
            type === 'error' ? 'var(--danger-color)' :
                type === 'warning' ? 'var(--warning-color)' : 'var(--info-color)',
        color: 'white',
        padding: '1rem 1.5rem',
        borderRadius: '10px',
        boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
        zIndex: '9999',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        maxWidth: '350px',
        fontSize: '14px'
    });

    document.body.appendChild(toast);

    // Animate in
    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
    }, 100);

    // Remove after delay
    setTimeout(() => {
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

/**
 * Validate email format using regex pattern
 * @param {string} email - The email address to validate
 * @returns {boolean} True if valid email format, false otherwise
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Evaluate password strength based on criteria
 * Checks length, uppercase, lowercase, numbers, and special characters
 * @param {string} password - The password to evaluate
 * @returns {number} Strength score (0-6)
 */
function checkPasswordStrength(password) {
    let strength = 0;

    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    return strength;
}

/**
 * Setup password visibility toggle
 * @param {string} buttonId - ID of the toggle button
 * @param {string} inputId - ID of the password input
 * @param {string} iconId - ID of the icon element
 */
function setupPasswordToggle(buttonId, inputId, iconId) {
    const toggleBtn = document.getElementById(buttonId);
    const passwordInput = document.getElementById(inputId);
    const icon = document.getElementById(iconId);

    if (toggleBtn && passwordInput && icon) {
        toggleBtn.addEventListener('click', () => {
            const isPassword = passwordInput.type === 'password';
            passwordInput.type = isPassword ? 'text' : 'password';
            icon.className = isPassword ? 'fas fa-eye-slash' : 'fas fa-eye';

            // Update aria-label
            toggleBtn.setAttribute('aria-label',
                isPassword ? 'Hide password' : 'Show password'
            );
        });

        // Keyboard support
        toggleBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleBtn.click();
            }
        });
    }
}

/**
 * Setup live check feedback
 */
function setupRealtimeValidation() {
    // Email check
    const emailInput = document.getElementById('email');
    if (emailInput) {
        emailInput.addEventListener('blur', () => {
            const email = sanitizeInput(emailInput.value.trim());
            if (email && !isValidEmail(email)) {
                showFieldError(emailInput, 'Please enter a valid email address');
            } else {
                clearFieldError(emailInput);
            }
        });
    }

    // Name check
    const nameInput = document.getElementById('fullName');
    if (nameInput) {
        nameInput.addEventListener('blur', () => {
            const name = sanitizeInput(nameInput.value.trim());
            if (name && name.length < 2) {
                showFieldError(nameInput, 'Name must be at least 2 characters');
            } else {
                clearFieldError(nameInput);
            }
        });
    }

    // Clear checks on input
    document.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', () => {
            clearFieldError(input);
        });
    });
}

/**
 * Clear field error state
 * @param {HTMLInputElement} field - The input field to clear error from
 */
function clearFieldError(field) {
    field.classList.remove('is-invalid');
    const errorDiv = field.parentNode.querySelector('.invalid-feedback');
    if (errorDiv) {
        errorDiv.remove();
    }
}

/**
 * Update password strength indicator with accessibility
 * Shows strength bar with visual feedback based on password quality
 * @param {string} password - The password to evaluate
 */
function updatePasswordStrength(password) {
    const strengthBar = document.getElementById('passwordStrength');
    if (!strengthBar) return;

    const strength = checkPasswordStrength(password);

    // Remove all strength classes
    strengthBar.classList.remove('strength-weak', 'strength-medium', 'strength-strong');

    if (password.length === 0) {
        strengthBar.style.display = 'none';
        strengthBar.setAttribute('aria-valuenow', '0');
    } else {
        strengthBar.style.display = 'block';
        strengthBar.setAttribute('aria-valuenow', strength.toString());

        if (strength <= 2) {
            strengthBar.classList.add('strength-weak');
            strengthBar.setAttribute('aria-label', 'Weak password');
        } else if (strength <= 4) {
            strengthBar.classList.add('strength-medium');
            strengthBar.setAttribute('aria-label', 'Medium password strength');
        } else {
            strengthBar.classList.add('strength-strong');
            strengthBar.setAttribute('aria-label', 'Strong password');
        }
    }
}

/**
 * Store user data in localStorage with optional "remember me" feature
 * @param {Object} userData - The user object to store
 * @param {boolean} remember - Whether to save email/name for next login
 */
function storeUser(userData, remember = false) {
    const user = {
        ...userData,
        loginTime: new Date().toISOString(),
        token: generateToken()
    };

    localStorage.setItem(AUTH_CONFIG.STORAGE_KEYS.USER, JSON.stringify(user));

    if (remember) {
        localStorage.setItem(AUTH_CONFIG.STORAGE_KEYS.REMEMBER, JSON.stringify({
            email: userData.email,
            name: userData.name
        }));
    }
}

/**
 * Generate a simple login token
 * @returns {string} Random token string
 */
function generateToken() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

/**
 * Retrieve stored user data from localStorage
 * @returns {Object|null} User object if exists, null otherwise
 */
function getStoredUser() {
    try {
        const userData = localStorage.getItem(AUTH_CONFIG.STORAGE_KEYS.USER);
        return userData ? JSON.parse(userData) : null;
    } catch (error) {
        console.error('Error parsing user data:', error);
        return null;
    }
}

/**
 * Check if user session is still valid
 * Verifies token expiry time
 * @returns {boolean} True if user is logged in and token valid
 */
function isLoggedIn() {
    const user = getStoredUser();
    if (!user) return false;

    // Check if token is still good (simple check)
    const loginTime = new Date(user.loginTime);
    const now = new Date();
    const diff = now - loginTime;

    return diff < AUTH_CONFIG.TOKEN_EXPIRY;
}

/**
 * Log out the current user
 * Clears all user data from localStorage
 */
function logout() {
    localStorage.removeItem(AUTH_CONFIG.STORAGE_KEYS.USER);
    showToast('Logged out successfully', 'success');

    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

/**
 * Redirect if already logged in
 */
function redirectIfLoggedIn() {
    if (isLoggedIn()) {
        window.location.href = 'index.html';
    }
}

// =============================================================================
// LOGIN FEATURES
// =============================================================================

/**
 * Handle login form submission with enhanced security and UX
 */
function handleLogin(event) {
    event.preventDefault();

    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const rememberInput = document.getElementById('remember');
    const submitBtn = event.target.querySelector('button[type="submit"]');

    // Get and sanitize form values
    const email = sanitizeInput(emailInput.value.trim());
    const password = passwordInput.value; // Don't sanitize password
    const remember = rememberInput.checked;

    // Clear previous validation states
    clearValidationStates();

    // Checks with live feedback
    let isValid = true;

    if (!email) {
        showFieldError(emailInput, 'Email is required');
        isValid = false;
    } else if (!isValidEmail(email)) {
        showFieldError(emailInput, 'Please enter a valid email address');
        isValid = false;
    }

    if (!password) {
        showFieldError(passwordInput, 'Password is required');
        isValid = false;
    }

    if (!isValid) {
        return;
    }

    // Show loading state
    showLoadingState(submitBtn, 'Signing in...');

    // Simulate login with delay for better UX
    setTimeout(() => {
        try {
            // Simulate login (in real app, this would be an API call)
            const users = getUsersFromStorage();
            const user = users.find(u => u.email === email && u.password === password);

            if (user) {
                // Successful login
                storeUser({
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role || 'customer'
                }, remember);

                showToast('Login successful! Redirecting...', 'success');

                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);

            } else {
                // Failed login
                showToast('Invalid email or password', 'error');
                showFieldError(passwordInput, 'Incorrect password');
                hideLoadingState(submitBtn);
            }
        } catch (error) {
            console.error('Login error:', error);
            showToast('Login failed. Please try again.', 'error');
            hideLoadingState(submitBtn);
        }
    }, 1000); // Simulate network delay
}

/**
 * Show field error with visual feedback
 * @param {HTMLInputElement} field - The input field to show error on
 * @param {string} message - Error message to display
 */
function showFieldError(field, message) {
    field.classList.add('is-invalid');

    // Remove existing error message
    const existingError = field.parentNode.querySelector('.invalid-feedback');
    if (existingError) {
        existingError.remove();
    }

    // Add error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'invalid-feedback';
    errorDiv.textContent = message;
    field.parentNode.appendChild(errorDiv);

    // Focus on the field
    field.focus();
}

/**
 * Clear all check states
 */
function clearValidationStates() {
    document.querySelectorAll('.is-invalid').forEach(field => {
        field.classList.remove('is-invalid');
    });
    document.querySelectorAll('.invalid-feedback').forEach(error => {
        error.remove();
    });
}

// =============================================================================
// REGISTRATION FUNCTIONALITY
// =============================================================================

/**
 * Handle registration form submission with enhanced validation
 */
function handleRegister(event) {
    event.preventDefault();

    const fullNameInput = document.getElementById('fullName');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const termsInput = document.getElementById('terms');
    const submitBtn = event.target.querySelector('button[type="submit"]');

    // Get and sanitize form values
    const fullName = sanitizeInput(fullNameInput.value.trim());
    const email = sanitizeInput(emailInput.value.trim());
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    const termsAccepted = termsInput.checked;

    // Clear previous validation states
    clearValidationStates();

    // Enhanced validation with real-time feedback
    let isValid = true;

    if (!fullName || fullName.length < 2) {
        showFieldError(fullNameInput, 'Please enter your full name (at least 2 characters)');
        isValid = false;
    }

    if (!email) {
        showFieldError(emailInput, 'Email is required');
        isValid = false;
    } else if (!isValidEmail(email)) {
        showFieldError(emailInput, 'Please enter a valid email address');
        isValid = false;
    }

    if (!password) {
        showFieldError(passwordInput, 'Password is required');
        isValid = false;
    } else if (password.length < AUTH_CONFIG.MIN_PASSWORD_LENGTH) {
        showFieldError(passwordInput, `Password must be at least ${AUTH_CONFIG.MIN_PASSWORD_LENGTH} characters long`);
        isValid = false;
    } else if (checkPasswordStrength(password) <= 2) {
        showFieldError(passwordInput, 'Password is too weak. Include uppercase, numbers, and special characters.');
        isValid = false;
    }

    if (!confirmPassword) {
        showFieldError(confirmPasswordInput, 'Please confirm your password');
        isValid = false;
    } else if (password !== confirmPassword) {
        showFieldError(confirmPasswordInput, 'Passwords do not match');
        isValid = false;
    }

    if (!termsAccepted) {
        showFieldError(termsInput, 'Please accept the terms and conditions');
        isValid = false;
    }

    if (!isValid) {
        return;
    }

    // Show loading state
    showLoadingState(submitBtn, 'Creating account...');

    // Simulate registration with delay for better UX
    setTimeout(() => {
        try {
            // Check if user already exists
            const users = getUsersFromStorage();
            if (users.some(u => u.email === email)) {
                showToast('An account with this email already exists', 'error');
                showFieldError(emailInput, 'Email already registered');
                hideLoadingState(submitBtn);
                return;
            }

            // Create new user
            const newUser = {
                id: Date.now().toString(),
                name: fullName,
                email: email,
                password: password, // In real app, this should be hashed
                role: 'customer',
                createdAt: new Date().toISOString()
            };

            // Save user
            users.push(newUser);
            localStorage.setItem(AUTH_CONFIG.STORAGE_KEYS.USERS, JSON.stringify(users));

            // Auto-login after registration
            storeUser({
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            });

            showToast('Registration successful! Redirecting...', 'success');

            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);

        } catch (error) {
            console.error('Registration error:', error);
            showToast('Registration failed. Please try again.', 'error');
            hideLoadingState(submitBtn);
        }
    }, 1000); // Simulate network delay
}

/**
 * Get users from localStorage with error handling
 */
function getUsersFromStorage() {
    try {
        const users = localStorage.getItem(AUTH_CONFIG.STORAGE_KEYS.USERS);
        return users ? JSON.parse(users) : [];
    } catch (error) {
        console.error('Error parsing users:', error);
        return [];
    }
}

// =============================================================================
// INITIALIZATION
// =============================================================================

/**
 * Initialize login page
 */
function initializeLoginPage() {
    console.log('🔐 Login Page Initializing...');

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Load remembered user if any
    const rememberedUser = localStorage.getItem(AUTH_CONFIG.STORAGE_KEYS.REMEMBER);
    if (rememberedUser) {
        try {
            const user = JSON.parse(rememberedUser);
            document.getElementById('email').value = user.email;
            document.getElementById('remember').checked = true;
        } catch (error) {
            console.error('Error loading remembered user:', error);
        }
    }

    // Setup password visibility toggle
    setupPasswordToggle('togglePassword', 'password', 'passwordIcon');

    // Setup real-time validation
    setupRealtimeValidation();

    console.log('✅ Login Page Ready!');
}

/**
 * Initialize registration page
 */
function initializeRegisterPage() {
    console.log('👤 Registration Page Initializing...');

    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    // Password strength indicator
    const passwordInput = document.getElementById('password');
    if (passwordInput) {
        passwordInput.addEventListener('input', (e) => {
            updatePasswordStrength(e.target.value);
        });
    }

    // Setup password visibility toggles
    setupPasswordToggle('togglePassword', 'password', 'passwordIcon');
    setupPasswordToggle('toggleConfirmPassword', 'confirmPassword', 'confirmPasswordIcon');

    // Confirm password validation
    const confirmPasswordInput = document.getElementById('confirmPassword');
    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener('input', (e) => {
            const password = passwordInput.value;
            if (e.target.value && e.target.value !== password) {
                e.target.setCustomValidity('Passwords do not match');
            } else {
                e.target.setCustomValidity('');
            }
        });
    }

    // Setup real-time validation
    setupRealtimeValidation();

    console.log('✅ Registration Page Ready!');
}

// =============================================================================
// START APPLICATION
// =============================================================================

// Determine which page we're on and initialize accordingly
document.addEventListener('DOMContentLoaded', () => {
    const isLoginPage = window.location.pathname.includes('login.html');
    const isRegisterPage = window.location.pathname.includes('register.html');

    if (isLoginPage) {
        redirectIfLoggedIn();
        initializeLoginPage();
    } else if (isRegisterPage) {
        redirectIfLoggedIn();
        initializeRegisterPage();
    }
});

// Export functions for global access
window.CoffeeHouseAuth = {
    isLoggedIn,
    logout,
    showToast,
    sanitizeInput
};
