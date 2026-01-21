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
 * Loads current user data into form fields
 */
function openProfileModal() {
    const modal = document.getElementById('profileModal');
    if (!modal) {
        console.warn('Profile modal not found');
        return;
    }

    // Load current user data from localStorage
    let currentUser = null;
    if (typeof window.currentUser !== 'undefined' && window.currentUser) {
        currentUser = window.currentUser;
    } else {
        currentUser = JSON.parse(localStorage.getItem('coffeehouse_user')) || {};
    }

    // Populate form fields with user data
    const profileNameInput = document.getElementById('profileName');
    const profileUsernameInput = document.getElementById('profileUsername');
    const profileEmailInput = document.getElementById('profileEmail');
    const profilePhoneInput = document.getElementById('profilePhone');
    const profileBioInput = document.getElementById('profileBio');

    if (profileNameInput) profileNameInput.value = currentUser.name || '';
    if (profileUsernameInput) profileUsernameInput.value = currentUser.username || '';
    if (profileEmailInput) profileEmailInput.value = currentUser.email || '';
    if (profilePhoneInput) profilePhoneInput.value = currentUser.phone || '';
    if (profileBioInput) profileBioInput.value = currentUser.bio || '';

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
 * Validates form data and updates localStorage
 */
function saveProfileChanges(event) {
    event.preventDefault();

    // Get form values
    const name = document.getElementById('profileName').value.trim();
    const username = document.getElementById('profileUsername').value.trim();
    const email = document.getElementById('profileEmail').value.trim();
    const phone = document.getElementById('profilePhone').value.trim();
    const bio = document.getElementById('profileBio').value.trim();

    // Validation
    if (!name) {
        if (typeof showToast !== 'undefined') {
            showToast('Please enter your name', 'error');
        }
        return;
    }

    if (!username) {
        if (typeof showToast !== 'undefined') {
            showToast('Please enter a username', 'error');
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

    // Create updated user object
    let currentUser = null;
    if (typeof window.currentUser !== 'undefined' && window.currentUser) {
        currentUser = window.currentUser;
    } else {
        currentUser = JSON.parse(localStorage.getItem('coffeehouse_user')) || {};
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

    // Save to localStorage
    localStorage.setItem('coffeehouse_user', JSON.stringify(updatedUser));

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
 * Reset profile form to current user data
 */
function resetProfileForm() {
    let currentUser = null;
    if (typeof window.currentUser !== 'undefined' && window.currentUser) {
        currentUser = window.currentUser;
    } else {
        currentUser = JSON.parse(localStorage.getItem('coffeehouse_user')) || {};
    }

    const profileNameInput = document.getElementById('profileName');
    const profileUsernameInput = document.getElementById('profileUsername');
    const profileEmailInput = document.getElementById('profileEmail');
    const profilePhoneInput = document.getElementById('profilePhone');
    const profileBioInput = document.getElementById('profileBio');

    if (profileNameInput) profileNameInput.value = currentUser.name || '';
    if (profileUsernameInput) profileUsernameInput.value = currentUser.username || '';
    if (profileEmailInput) profileEmailInput.value = currentUser.email || '';
    if (profilePhoneInput) profilePhoneInput.value = currentUser.phone || '';
    if (profileBioInput) profileBioInput.value = currentUser.bio || '';
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
