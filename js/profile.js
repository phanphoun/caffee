/**
 * ============================================================================
 * CoffeeHouse E-Commerce Website - User Profile Module
 * Handles user profile display and updates
 * ============================================================================
 */

// ============================================================================
// PROFILE MODAL FUNCTIONS
// ============================================================================

/**
 * Open the user profile modal
 * Loads current user data into form fields with error handling
 */
function openProfileModal() {
    const modal = document.getElementById('profileModal');
    if (!modal) {
        console.warn('Profile modal not found');
        return;
    }

    // Load current user data using secure storage
    let currentUser = null;
    if (typeof window.currentUser !== 'undefined' && window.currentUser) {
        currentUser = window.currentUser;
    } else {
        currentUser = safeStorageGet('coffeehouse_user', {});
    }

    // Populate form fields with sanitized user data
    const profileNameInput = document.getElementById('profileName');
    const profileUsernameInput = document.getElementById('profileUsername');
    const profileEmailInput = document.getElementById('profileEmail');
    const profilePhoneInput = document.getElementById('profilePhone');
    const profileBioInput = document.getElementById('profileBio');

    if (profileNameInput) profileNameInput.value = sanitizeInput(currentUser.name || '');
    if (profileUsernameInput) profileUsernameInput.value = sanitizeInput(currentUser.username || '');
    if (profileEmailInput) profileEmailInput.value = sanitizeInput(currentUser.email || '');
    if (profilePhoneInput) profilePhoneInput.value = sanitizeInput(currentUser.phone || '');
    if (profileBioInput) profileBioInput.value = sanitizeInput(currentUser.bio || '');

    // Show modal
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Prevent body scrolling
}

/**
 * Close the user profile modal
 */
function closeProfileModal() {
    const modal = document.getElementById('profileModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Restore body scrolling
    }
}

/**
 * Save user profile changes
 * Validates form data, sanitizes inputs, and updates localStorage securely
 */
function saveProfileChanges(event) {
    event.preventDefault();

    // Get and sanitize form values
    const name = sanitizeInput(document.getElementById('profileName').value);
    const username = sanitizeInput(document.getElementById('profileUsername').value);
    const email = sanitizeInput(document.getElementById('profileEmail').value);
    const phone = sanitizeInput(document.getElementById('profilePhone').value);
    const bio = sanitizeInput(document.getElementById('profileBio').value);

    // Enhanced validation
    if (!name || name.length < 2) {
        if (typeof showToast !== 'undefined') {
            showToast('Please enter a valid name (at least 2 characters)', 'error');
        }
        return;
    }

    if (!username || username.length < 3) {
        if (typeof showToast !== 'undefined') {
            showToast('Please enter a valid username (at least 3 characters)', 'error');
        }
        return;
    }

    // Username validation: alphanumeric and underscores only
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        if (typeof showToast !== 'undefined') {
            showToast('Username can only contain letters, numbers, and underscores', 'error');
        }
        return;
    }

    if (!email || !isValidEmail(email)) {
        if (typeof showToast !== 'undefined') {
            showToast('Please enter a valid email address', 'error');
        }
        return;
    }

    if (phone && !isValidPhone(phone)) {
        if (typeof showToast !== 'undefined') {
            showToast('Please enter a valid phone number', 'error');
        }
        return;
    }

    // Bio length validation
    if (bio.length > 500) {
        if (typeof showToast !== 'undefined') {
            showToast('Bio must be less than 500 characters', 'error');
        }
        return;
    }

    // Load current user data using secure storage
    let currentUser = null;
    if (typeof window.currentUser !== 'undefined' && window.currentUser) {
        currentUser = window.currentUser;
    } else {
        currentUser = safeStorageGet('coffeehouse_user', {});
    }

    const updatedUser = {
        ...currentUser,
        name,
        username,
        email,
        phone,
        bio,
        updatedAt: new Date().toISOString()
    };

    // Save to localStorage using secure storage
    if (safeStorageSet('coffeehouse_user', updatedUser)) {
        // Update global currentUser variable
        if (typeof window.currentUser !== 'undefined') {
            window.currentUser = updatedUser;
        }

        // Update UI - account name in navbar
        const accountName = document.getElementById('accountName');
        if (accountName) {
            accountName.textContent = name;
        }

        // Show success message
        if (typeof showToast !== 'undefined') {
            showToast('Profile updated successfully!', 'success');
        }

        // Close modal after short delay
        setTimeout(() => {
            closeProfileModal();
        }, 500);
    } else {
        if (typeof showToast !== 'undefined') {
            showToast('Failed to save profile. Please try again.', 'error');
        }
    }
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email format
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validate phone number format
 * Accepts formats like: (555) 123-4567, 555-123-4567, 5551234567, +1 555 123 4567
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if valid phone format
 */
function isValidPhone(phone) {
    const phoneRegex = /^[\d\s\-\(\)\+]+$|^$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

/**
 * Reset profile form to current user data using secure storage
 */
function resetProfileForm() {
    let currentUser = null;
    if (typeof window.currentUser !== 'undefined' && window.currentUser) {
        currentUser = window.currentUser;
    } else {
        currentUser = safeStorageGet('coffeehouse_user', {});
    }

    const profileNameInput = document.getElementById('profileName');
    const profileUsernameInput = document.getElementById('profileUsername');
    const profileEmailInput = document.getElementById('profileEmail');
    const profilePhoneInput = document.getElementById('profilePhone');
    const profileBioInput = document.getElementById('profileBio');

    if (profileNameInput) profileNameInput.value = sanitizeInput(currentUser.name || '');
    if (profileUsernameInput) profileUsernameInput.value = sanitizeInput(currentUser.username || '');
    if (profileEmailInput) profileEmailInput.value = sanitizeInput(currentUser.email || '');
    if (profilePhoneInput) profilePhoneInput.value = sanitizeInput(currentUser.phone || '');
    if (profileBioInput) profileBioInput.value = sanitizeInput(currentUser.bio || '');
}

// ============================================================================
// EXPOSE FUNCTIONS GLOBALLY
// ============================================================================

// Expose profile functions globally for easy access
if (typeof window.CoffeeHouse === 'undefined') {
    window.CoffeeHouse = {};
}

window.CoffeeHouse.openProfileModal = openProfileModal;
window.CoffeeHouse.closeProfileModal = closeProfileModal;
window.CoffeeHouse.saveProfileChanges = saveProfileChanges;

// ============================================================================
// EVENT LISTENER SETUP
// ============================================================================

document.addEventListener('DOMContentLoaded', function () {
    // Profile button click handler - works with loginBtn (Profile link)
    const profileBtn = document.getElementById('loginBtn');
    if (profileBtn) {
        profileBtn.addEventListener('click', function (e) {
            e.preventDefault();
            openProfileModal();
        });
    }

    // Profile form submit
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', saveProfileChanges);
    }

    // Close modal button
    const closeModalBtn = document.getElementById('closeProfileModalBtn');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeProfileModal);
    }

    // Cancel button
    const cancelBtn = document.getElementById('cancelProfileBtn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function () {
            resetProfileForm();
            closeProfileModal();
        });
    }

    // Close on outside click
    const modal = document.getElementById('profileModal');
    if (modal) {
        modal.addEventListener('click', function (e) {
            if (e.target === modal) {
                closeProfileModal();
            }
        });
    }

    // Keyboard shortcut - Press Escape to close
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            const modal = document.getElementById('profileModal');
            if (modal && modal.style.display === 'flex') {
                closeProfileModal();
            }
        }
    });
});
