document.addEventListener('DOMContentLoaded', () => {

    // --- Part 1: Password Strength Analyzer ---
    const passwordInput = document.getElementById('password-input');
    const strengthBar = document.getElementById('strength-bar');
    const strengthText = document.getElementById('strength-text');
    const commonPasswordWarning = document.getElementById('common-password-warning');
    const lengthCheck = document.getElementById('length-check');
    const caseCheck = document.getElementById('case-check');
    const numberCheck = document.getElementById('number-check');
    const symbolCheck = document.getElementById('symbol-check');
    const togglePassword = document.getElementById('toggle-password');
    const eyeIcon = document.getElementById('eye-icon');
    const eyeOffIcon = document.getElementById('eye-off-icon');

    const commonPasswords = new Set(['123456', 'password', '123456789', '12345', 'qwerty']);

    passwordInput.addEventListener('input', () => {
        const password = passwordInput.value;
        const result = checkPasswordStrength(password);
        updateStrengthUI(result);
    });

    togglePassword.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        eyeIcon.classList.toggle('hidden');
        eyeOffIcon.classList.toggle('hidden');
    });

    function checkPasswordStrength(password) {
        let score = 0;
        const checks = { length: false, hasUpper: false, hasLower: false, hasNumber: false, hasSymbol: false, isCommon: false };
        if (commonPasswords.has(password)) { checks.isCommon = true; }
        if (password.length >= 8) { score++; checks.length = true; }
        if (password.length >= 12) { score++; }
        if (/[A-Z]/.test(password)) { checks.hasUpper = true; }
        if (/[a-z]/.test(password)) { checks.hasLower = true; }
        if (checks.hasUpper && checks.hasLower) { score++; }
        if (/\d/.test(password)) { score++; checks.hasNumber = true; }
        if (/[^A-Za-z0-9]/.test(password)) { score++; checks.hasSymbol = true; }
        return { score, checks };
    }

    function updateStrengthUI({ score, checks }) {
        updateCheckUI(lengthCheck, checks.length);
        updateCheckUI(caseCheck, checks.hasUpper && checks.hasLower);
        updateCheckUI(numberCheck, checks.hasNumber);
        updateCheckUI(symbolCheck, checks.hasSymbol);

        if (checks.isCommon) {
            commonPasswordWarning.textContent = 'This password is too common!';
            commonPasswordWarning.classList.remove('hidden');
        } else {
            commonPasswordWarning.classList.add('hidden');
        }

        let strength = '', color = '', width = '0%';
        let finalScore = checks.isCommon ? 0 : score;

        switch (finalScore) {
            case 0: case 1: strength = 'Weak'; color = 'bg-red-500'; width = '25%'; break;
            case 2: strength = 'Medium'; color = 'bg-yellow-500'; width = '50%'; break;
            case 3: strength = 'Good'; color = 'bg-blue-500'; width = '75%'; break;
            case 4: case 5: strength = 'Strong'; color = 'bg-green-500'; width = '100%'; break;
        }
        if (passwordInput.value.length === 0) { strength = ''; width = '0%'; }
        strengthBar.style.width = width;
        strengthBar.className = `h-2.5 rounded-full ${color}`;
        strengthText.textContent = strength;
    }

    function updateCheckUI(element, isMet) {
        element.classList.toggle('text-green-600', isMet);
        element.classList.toggle('text-gray-500', !isMet);
        element.querySelector('svg').innerHTML = isMet ? `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>` : `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>`;
    }

    // --- Part 2: Two-Factor Authentication (2FA) Demo ---
    const setupBtn = document.getElementById('setup-btn');
    const verifyBtn = document.getElementById('verify-btn');
    const copySecretBtn = document.getElementById('copy-secret-btn');
    const usernameSetupInput = document.getElementById('username-setup');
    const usernameVerifyInput = document.getElementById('username-verify');
    const otpInputs = document.querySelectorAll('.otp-input');
    const qrSection = document.getElementById('qr-section');
    const qrCodeImg = document.getElementById('qr-code-img');
    const secretKeyText = document.getElementById('secret-key');
    const messageArea = document.getElementById('message-area');
    
    // Dynamically set the API URL based on the hostname
    const API_URL = window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost'
        ? 'http://127.0.0.1:5001'
        : window.location.origin;

    otpInputs.forEach((input, index) => {
        input.addEventListener('input', () => {
            if (input.value.length === 1 && index < otpInputs.length - 1) {
                otpInputs[index + 1].focus();
            }
        });
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && input.value.length === 0 && index > 0) {
                otpInputs[index - 1].focus();
            }
        });
    });

    function setButtonLoadingState(button, isLoading) {
        button.disabled = isLoading;
        button.classList.toggle('opacity-75', isLoading);
        button.classList.toggle('cursor-not-allowed', isLoading);
        button.querySelector('.btn-text').classList.toggle('hidden', isLoading);
        button.querySelector('.btn-spinner').classList.toggle('hidden', !isLoading);
    }

    setupBtn.addEventListener('click', async () => {
        const username = usernameSetupInput.value.trim();
        if (!username) { showMessage('Please enter a username for setup.', 'error'); return; }
        setButtonLoadingState(setupBtn, true);
        try {
            const response = await fetch(`${API_URL}/setup-2fa`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username }) });
            const data = await response.json();
            if (response.ok && data.status === 'success') {
                qrCodeImg.src = `data:image/png;base64,${data.qr_code}`;
                secretKeyText.textContent = data.secret;
                qrSection.classList.remove('hidden');
                usernameVerifyInput.value = username;
                showMessage('QR code generated! Scan it with your authenticator app.', 'success');
            } else {
                showMessage(data.message || 'Failed to setup 2FA.', 'error');
            }
        } catch (error) {
            console.error("Fetch Error:", error);
            showMessage('Could not connect to the server.', 'error');
        } finally {
            setButtonLoadingState(setupBtn, false);
        }
    });

    verifyBtn.addEventListener('click', async () => {
        const username = usernameVerifyInput.value.trim();
        let otp = '';
        otpInputs.forEach(input => { otp += input.value; });

        if (!username || otp.length < 6) { showMessage('Please enter username and a full 6-digit OTP.', 'error'); return; }
        setButtonLoadingState(verifyBtn, true);
        try {
            const response = await fetch(`${API_URL}/verify-2fa`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, otp }) });
            const data = await response.json();
            showMessage(data.message, data.status);
        } catch (error) {
            showMessage('Could not connect to the server.', 'error');
        } finally {
            setButtonLoadingState(verifyBtn, false);
        }
    });

    copySecretBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(secretKeyText.textContent).then(() => {
            showMessage('Secret key copied to clipboard!', 'success');
        }, () => {
            showMessage('Failed to copy key.', 'error');
        });
    });

    function showMessage(message, type) {
        messageArea.textContent = message;
        messageArea.className = 'mt-4 text-center font-medium p-3 rounded-lg transition-all';
        messageArea.classList.add(type === 'success' ? 'bg-green-100' : 'bg-red-100', type === 'success' ? 'text-green-800' : 'text-red-800');
    }
});
