/**
 * ShortUUID Web Application
 * JavaScript implementation for the ShortUUID online converter
 */

// Include the ShortUUID library here or load it via script tag
// For this example, we'll assume it's loaded globally

class ShortUUIDApp {
    constructor() {
        this.shortuuid = '';
        this.uuid = '';
        this.legacy = false;
        this.state = false; // For disabling inputs during processing
        this.invalidShortUuid = false;
        this.invalidUuid = false;

        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupEventListeners();
                this.generateInitialUUID();
            });
        } else {
            this.setupEventListeners();
            this.generateInitialUUID();
        }
    }

    generateInitialUUID() {
        // Generate random UUID on page load if fields are empty
        if (!this.shortuuidInput.value && !this.uuidInput.value) {
            this.generateRandomUUID();
        }
    }

    setupEventListeners() {
        // Get DOM elements
        this.shortuuidInput = document.getElementById('shortuuid');
        this.uuidInput = document.getElementById('longuuid');
        this.legacyCheckbox = document.getElementById('legacy-checkbox');
        this.shortuuidGroup = this.shortuuidInput.closest('.form-group');
        this.uuidGroup = this.uuidInput.closest('.form-group');

        // Get button elements
        this.generateShortUuidBtn = document.getElementById('generate-shortuuid');
        this.generateUuidBtn = document.getElementById('generate-uuid');
        this.clearAllBtn = document.getElementById('clear-all');
        this.copyShortUuidBtn = document.getElementById('copy-shortuuid');
        this.copyUuidBtn = document.getElementById('copy-uuid');

        // Get message elements
        this.errorMessage = document.getElementById('error-message');
        this.errorText = document.getElementById('error-text');
        this.infoMessage = document.getElementById('info-message');
        this.infoText = document.getElementById('info-text');

        // Load legacy preference from localStorage
        this.loadLegacyPreference();

        // Add event listeners for inputs
        this.shortuuidInput.addEventListener('input', (e) => this.onShortUUIDInput(e));
        this.shortuuidInput.addEventListener('change', (e) => this.convertShortUUID(e));
        this.shortuuidInput.addEventListener('keyup', (e) => this.onShortUUIDKeyUp(e));
        this.uuidInput.addEventListener('input', (e) => this.onUUIDInput(e));
        this.uuidInput.addEventListener('change', (e) => this.convertUUID(e));
        this.uuidInput.addEventListener('keyup', (e) => this.onUUIDKeyUp(e));
        this.legacyCheckbox.addEventListener('change', (e) => this.changeLegacy(e));

        // Add event listeners for buttons
        if (this.generateShortUuidBtn) {
            this.generateShortUuidBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.generateRandomShortUUID();
            });
        }

        if (this.generateUuidBtn) {
            this.generateUuidBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.generateRandomUUID();
            });
        }

        if (this.clearAllBtn) {
            this.clearAllBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.clear();
            });
        }

        // Add copy button event listeners
        if (this.copyShortUuidBtn) {
            this.copyShortUuidBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (this.shortuuid) {
                    this.copyToClipboard(this.shortuuid, 'ShortUUID');
                }
            });
        }

        if (this.copyUuidBtn) {
            this.copyUuidBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (this.uuid) {
                    this.copyToClipboard(this.uuid, 'UUID');
                }
            });
        }

        // Initialize with any existing values
        this.shortuuid = this.shortuuidInput.value;
        this.uuid = this.uuidInput.value;
        this.legacy = this.legacyCheckbox.checked;

        // Convert any initial values
        if (this.shortuuid) {
            this.convertShortUUID();
        } else if (this.uuid) {
            this.convertUUID();
        }
    }

    loadLegacyPreference() {
        try {
            const savedLegacy = localStorage.getItem('shortuuid-legacy-mode');
            if (savedLegacy !== null) {
                const isLegacy = savedLegacy === 'true';
                this.legacyCheckbox.checked = isLegacy;
                this.legacy = isLegacy;
            }
        } catch (error) {
            // localStorage might not be available (private browsing, etc.)
            console.warn('Could not load legacy preference from localStorage:', error);
        }
    }

    saveLegacyPreference() {
        try {
            localStorage.setItem('shortuuid-legacy-mode', this.legacy.toString());
        } catch (error) {
            // localStorage might not be available (private browsing, etc.)
            console.warn('Could not save legacy preference to localStorage:', error);
        }
    }

    // Handle ShortUUID input events
    onShortUUIDInput(event) {
        const value = event.target.value;

        // If user starts typing or clears the field, regenerate if it becomes empty
        if (value.length === 0) {
            // Field was cleared, generate new random UUID
            this.generateRandomUUID();
            return;
        }

        // Convert as user types
        this.convertShortUUID(event);
    }

    onShortUUIDKeyUp(event) {
        // Additional handling for key events if needed
        const value = event.target.value;
        if (value.length === 0 && (event.key === 'Backspace' || event.key === 'Delete')) {
            // User deleted everything, generate new UUID
            this.generateRandomUUID();
        }
    }

    // Handle UUID input events
    onUUIDInput(event) {
        const value = event.target.value;

        // If user starts typing or clears the field, regenerate if it becomes empty
        if (value.length === 0) {
            // Field was cleared, generate new random ShortUUID
            this.generateRandomShortUUID();
            return;
        }

        // Convert as user types
        this.convertUUID(event);
    }

    onUUIDKeyUp(event) {
        // Additional handling for key events if needed
        const value = event.target.value;
        if (value.length === 0 && (event.key === 'Backspace' || event.key === 'Delete')) {
            // User deleted everything, generate new ShortUUID
            this.generateRandomShortUUID();
        }
    }

    setDisabled(disabled) {
        this.state = disabled;
        this.shortuuidInput.disabled = disabled;
        this.uuidInput.disabled = disabled;
        this.legacyCheckbox.disabled = disabled;

        // Disable buttons during processing
        if (this.generateShortUuidBtn) this.generateShortUuidBtn.disabled = disabled;
        if (this.generateUuidBtn) this.generateUuidBtn.disabled = disabled;
        if (this.clearAllBtn) this.clearAllBtn.disabled = disabled;
    }

    setError(field, hasError) {
        const group = field === 'shortuuid' ? this.shortuuidGroup : this.uuidGroup;
        const input = field === 'shortuuid' ? this.shortuuidInput : this.uuidInput;

        if (hasError) {
            group.classList.add('has-error');
            input.style.backgroundColor = '#ffebee'; // Light red background
            input.style.borderColor = '#f44336'; // Red border
        } else {
            group.classList.remove('has-error');
            input.style.backgroundColor = ''; // Reset background
            input.style.borderColor = ''; // Reset border
        }
    }

    showMessage(type, message) {
        this.hideMessages();

        if (type === 'error' && this.errorMessage) {
            this.errorText.textContent = message;
            this.errorMessage.style.display = 'block';
        } else if (type === 'info' && this.infoMessage) {
            this.infoText.textContent = message;
            this.infoMessage.style.display = 'block';
        }
    }

    hideMessages() {
        if (this.errorMessage) this.errorMessage.style.display = 'none';
        if (this.infoMessage) this.infoMessage.style.display = 'none';
    }

    validateUUID(uuid) {
        // Simple hex validation - just check if it's 32 hex characters with or without dashes
        if (!uuid) return false;

        // Remove dashes and check length and hex characters
        const clean = uuid.replace(/-/g, '');

        // Must be exactly 32 hex characters
        if (clean.length !== 32) return false;

        // Must contain only hex characters (0-9, a-f, A-F)
        return /^[0-9a-f]{32}$/i.test(clean);
    }

    validateShortUUID(shortUuid) {
        if (!shortUuid) return false;

        // Check if all characters are in the default alphabet
        const alphabet = '23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
        return shortUuid.split('').every(char => alphabet.includes(char));
    }

    normalizeUUID(uuid) {
        // Remove dashes and convert to lowercase
        const clean = uuid.replace(/-/g, '').toLowerCase();

        // Add dashes back in proper positions
        if (clean.length === 32) {
            return [
                clean.substring(0, 8),
                clean.substring(8, 12),
                clean.substring(12, 16),
                clean.substring(16, 20),
                clean.substring(20, 32)
            ].join('-');
        }

        return uuid;
    }

    convertShortUUID(event) {
        const value = event ? event.target.value : this.shortuuidInput.value;
        this.shortuuid = value;

        // Clear previous errors
        this.invalidShortUuid = false;
        this.setError('shortuuid', false);
        this.hideMessages();

        if (!value.trim()) {
            // Don't clear UUID field when ShortUUID is empty - let the input handler deal with it
            return;
        }

        try {
            this.setDisabled(true);

            // Validate short UUID format
            if (!this.validateShortUUID(value)) {
                throw new Error('Invalid ShortUUID format - contains invalid characters');
            }

            // Use our ShortUUID library
            let decodedUuid;

            if (typeof shortuuid !== 'undefined') {
                // Global shortuuid object (browser)
                decodedUuid = shortuuid.decode(value, this.legacy);
            } else if (typeof window.shortuuid !== 'undefined') {
                // Window shortuuid object
                decodedUuid = window.shortuuid.decode(value, this.legacy);
            } else {
                throw new Error('ShortUUID library not loaded');
            }

            this.uuid = decodedUuid;
            this.uuidInput.value = decodedUuid;

            // Clear UUID errors if conversion successful
            this.invalidUuid = false;
            this.setError('uuid', false);

        } catch (error) {
            console.error('Error converting ShortUUID:', error);
            this.invalidShortUuid = true;
            this.setError('shortuuid', true);
            this.showMessage('error', `Invalid ShortUUID: ${error.message}`);

            // Clear UUID field on error
            this.uuid = '';
            this.uuidInput.value = '';
        } finally {
            this.setDisabled(false);
        }
    }

    convertUUID(event) {
        const value = event ? event.target.value : this.uuidInput.value;
        this.uuid = value;

        // Clear previous errors
        this.invalidUuid = false;
        this.setError('uuid', false);
        this.hideMessages();

        if (!value.trim()) {
            // Don't clear ShortUUID field when UUID is empty - let the input handler deal with it
            return;
        }

        try {
            this.setDisabled(true);

            // Validate UUID format
            if (!this.validateUUID(value)) {
                throw new Error('Must be 32 hexadecimal characters (with or without dashes)');
            }

            // Normalize UUID format
            const normalizedUuid = this.normalizeUUID(value);

            // Use our ShortUUID library
            let encodedShortUuid;

            if (typeof shortuuid !== 'undefined') {
                // Global shortuuid object (browser)
                if (this.legacy) {
                    encodedShortUuid = shortuuid.legacyEncode(normalizedUuid);
                } else {
                    encodedShortUuid = shortuuid.encode(normalizedUuid);
                }
            } else if (typeof window.shortuuid !== 'undefined') {
                // Window shortuuid object
                if (this.legacy) {
                    encodedShortUuid = window.shortuuid.legacyEncode(normalizedUuid);
                } else {
                    encodedShortUuid = window.shortuuid.encode(normalizedUuid);
                }
            } else {
                throw new Error('ShortUUID library not loaded');
            }

            this.shortuuid = encodedShortUuid;
            this.shortuuidInput.value = encodedShortUuid;

            // Update UUID field with normalized format
            if (normalizedUuid !== value) {
                this.uuid = normalizedUuid;
                this.uuidInput.value = normalizedUuid;
            }

            // Clear ShortUUID errors if conversion successful
            this.invalidShortUuid = false;
            this.setError('shortuuid', false);

        } catch (error) {
            console.error('Error converting UUID:', error);
            this.invalidUuid = true;
            this.setError('uuid', true);
            this.showMessage('error', `Invalid UUID: ${error.message}`);

            // Clear ShortUUID field on error
            this.shortuuid = '';
            this.shortuuidInput.value = '';
        } finally {
            this.setDisabled(false);
        }
    }

    changeLegacy(event) {
        this.legacy = event ? event.target.checked : this.legacyCheckbox.checked;
        this.hideMessages();

        // Save preference to localStorage
        this.saveLegacyPreference();

        if (this.legacy) {
            this.showMessage('info', 'Legacy mode enabled. This will decode/encode UUIDs using the format from versions < 1.0.0.');
        }

        // Re-convert current value if any
        if (this.shortuuid && !this.invalidShortUuid) {
            this.convertShortUUID();
        } else if (this.uuid && !this.invalidUuid) {
            this.convertUUID();
        }
    }

    // Utility methods for external access
    generateRandomShortUUID() {
        try {
            this.hideMessages();

            let randomShortUuid;

            if (typeof shortuuid !== 'undefined') {
                randomShortUuid = shortuuid.uuid();
            } else if (typeof window.shortuuid !== 'undefined') {
                randomShortUuid = window.shortuuid.uuid();
            } else {
                throw new Error('ShortUUID library not loaded');
            }

            // Clear any errors first
            this.invalidShortUuid = false;
            this.invalidUuid = false;
            this.setError('shortuuid', false);
            this.setError('uuid', false);

            this.shortuuid = randomShortUuid;
            this.shortuuidInput.value = randomShortUuid;
            this.convertShortUUID();

            return randomShortUuid;
        } catch (error) {
            console.error('Error generating random ShortUUID:', error);
            this.showMessage('error', `Failed to generate ShortUUID: ${error.message}`);
            return null;
        }
    }

    generateRandomUUID() {
        try {
            this.hideMessages();

            // Generate a random UUID v4
            const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                const r = Math.random() * 16 | 0;
                const v = c === 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });

            // Clear any errors first
            this.invalidShortUuid = false;
            this.invalidUuid = false;
            this.setError('shortuuid', false);
            this.setError('uuid', false);

            this.uuid = uuid;
            this.uuidInput.value = uuid;
            this.convertUUID();

            return uuid;
        } catch (error) {
            console.error('Error generating random UUID:', error);
            this.showMessage('error', `Failed to generate UUID: ${error.message}`);
            return null;
        }
    }

    clear() {
        this.shortuuid = '';
        this.uuid = '';
        this.shortuuidInput.value = '';
        this.uuidInput.value = '';
        this.invalidShortUuid = false;
        this.invalidUuid = false;
        this.setError('shortuuid', false);
        this.setError('uuid', false);
        this.hideMessages();

        this.showMessage('info', 'All fields cleared');

        // Auto-hide info message after 2 seconds
        setTimeout(() => {
            this.hideMessages();
        }, 2000);
    }

    // Additional utility methods
    copyToClipboard(text, fieldName) {
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text).then(() => {
                this.showMessage('info', `${fieldName} copied to clipboard`);
                setTimeout(() => this.hideMessages(), 2000);
            }).catch(err => {
                console.error('Failed to copy to clipboard:', err);
                this.fallbackCopyToClipboard(text, fieldName);
            });
        } else {
            this.fallbackCopyToClipboard(text, fieldName);
        }
    }

    fallbackCopyToClipboard(text, fieldName) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            document.execCommand('copy');
            this.showMessage('info', `${fieldName} copied to clipboard`);
            setTimeout(() => this.hideMessages(), 2000);
        } catch (err) {
            console.error('Fallback copy failed:', err);
            this.showMessage('error', 'Failed to copy to clipboard');
        }

        document.body.removeChild(textArea);
    }

    // Method to get current state
    getState() {
        return {
            shortuuid: this.shortuuid,
            uuid: this.uuid,
            legacy: this.legacy,
            isValid: !this.invalidShortUuid && !this.invalidUuid
        };
    }

    // Method to set state
    setState(state) {
        if (state.shortuuid !== undefined) {
            this.shortuuidInput.value = state.shortuuid;
            this.convertShortUUID();
        }

        if (state.uuid !== undefined) {
            this.uuidInput.value = state.uuid;
            this.convertUUID();
        }

        if (state.legacy !== undefined) {
            this.legacyCheckbox.checked = state.legacy;
            this.changeLegacy();
        }
    }
}

// Global app instance
let shortUUIDApp;

// Initialize the app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        shortUUIDApp = new ShortUUIDApp();

        // Make app globally accessible for debugging
        window.shortUUIDApp = shortUUIDApp;
    });
} else {
    shortUUIDApp = new ShortUUIDApp();
    window.shortUUIDApp = shortUUIDApp;
}

// Export for use in other contexts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ShortUUIDApp;
}