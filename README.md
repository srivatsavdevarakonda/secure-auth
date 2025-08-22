# 🔐 Secure Auth Project: Password Analyzer & 2FA Demo

**Secure Auth Project** is a web-based demo of two essential security features: a **real-time Password Strength Analyzer** and a **Two-Factor Authentication (2FA) Demo** using Time-based One-Time Passwords (TOTP).

Built with a **Flask backend** and a **modern frontend (HTML, Tailwind CSS, JavaScript)**, this project showcases best practices in authentication security.

---

## 📌 Features

### 🛡️ Password Strength Analyzer

* ⚡ **Real-Time Feedback:** Colored strength bar & label (**Weak, Medium, Strong**) updates instantly.
* ✅ **Validation Checklist:** Checks length, case letters, numbers, and symbols.
* 🚨 **Common Password Detection:** Warns users if their password is insecure or widely used.
* 👁️ **Visibility Toggle:** Show/hide password with an eye icon.

### 🔑 Two-Factor Authentication (2FA) Demo

* 📲 **Easy Setup:** Generate a unique QR code for any username.
* 📷 **Authenticator App Compatible:** Works with Google Authenticator, Authy, Microsoft Authenticator, etc.
* ✍️ **Manual Entry Option:** Provides a secret key if QR scanning isn’t possible.
* 🔐 **OTP Verification:** Enter a 6-digit TOTP code for secure login verification.

---

## 🛠️ Tech Stack

* **Backend:** Python, Flask
* **Frontend:** HTML, Tailwind CSS, Vanilla JavaScript
* **Key Python Libraries:**

  * `pyotp` → Generate & verify TOTP secrets
  * `qrcode` → Create QR codes
  * `Pillow` → Image processing for QR

---

## 📂 Project Structure

```
secure-auth-project/
│
├── server.py            # Flask backend
├── requirements.txt     # Dependencies
│
├── templates/
│   └── index.html       # Main UI
│
└── static/
    └── script.js        # Frontend logic
```

---

## 🖥️ Local Installation

### 1. Prerequisites

* Python **3.6+**
* `pip` (Python package installer)

### 2. Setup

1. **Clone the repo**

   ```bash
   git clone https://github.com/your-username/secure-auth-project.git
   cd secure-auth-project
   ```

2. **Create & activate a virtual environment**

   ```bash
   # Windows
   python -m venv venv
   .\venv\Scripts\activate

   # macOS/Linux
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install dependencies**

   ```bash
   pip install -r requirements.txt
   ```

### 3. Run the App

```bash
python server.py
```

Navigate to 👉 **[secure-auth-project](https://secure-auth-wrdy.onrender.com)** in your browser.

---

## 💡 How to Use

### 🔐 Password Strength Analyzer

* Start typing a password → Strength bar, label, and checklist update live.

### 🔑 2FA Demo

1. **Setup:**

   * Enter a username → click **Setup**.
   * Scan the displayed QR code in your authenticator app.
   * (Or manually enter the secret key if needed).

2. **Verification:**

   * Open your app → get the 6-digit OTP (refreshes every 30s).
   * Enter username + OTP → click **Verify Login**.
   * See **success/failure** message.

---

## 👨‍💻 Author Info

**Developed by:** (SRIVATSAV D)
📧 [devarakondasrivatsav@gmail.com](mailto:devarakondasrivatsav@gmail.com)
🌐 [GitHub](https://github.com/srivatsavdevarakonda) | [LinkedIn](https://www.linkedin.com/in/d-srivatsav-2a7a90247/)

---

## 📝 License

Licensed under the **MIT License**.

---

## 🙌 Contributing

Contributions are welcome!

```bash
git fork
git clone [your-forked-repo]
git checkout -b feature-branch
# make changes & commit
git push origin feature-branch
```

Open a **Pull Request** 🚀

---

## 🔮 Future Improvements

* Add **password breach check** via HaveIBeenPwned API.
* Implement **email/SMS OTP** demo in addition to TOTP.
* Add **user accounts** with persistent sessions.
* Dark/light theme toggle.

---

## 💬 Final Note

> Strong passwords + 2FA = safer digital life 🔐✨

---
