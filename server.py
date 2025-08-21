# server.py
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import pyotp
import qrcode
import io
import base64

app = Flask(__name__, template_folder='templates', static_folder='static')
CORS(app)

user_secrets = {}

@app.route('/')
def index():
    """Serve the main HTML file."""
    return render_template('index.html')

@app.route('/setup-2fa', methods=['POST'])
def setup_2fa():
    """Sets up 2FA for a user."""
    data = request.get_json()
    username = data.get('username')

    if not username:
        return jsonify({"status": "error", "message": "Username is required"}), 400

    secret = pyotp.random_base32()
    user_secrets[username] = secret
    totp = pyotp.TOTP(secret)
    provisioning_uri = totp.provisioning_uri(name=username, issuer_name="SecureAuthDemo")

    qr = qrcode.QRCode(version=1, error_correction=qrcode.constants.ERROR_CORRECT_L, box_size=10, border=4)
    qr.add_data(provisioning_uri)
    qr.make(fit=True)
    img = qr.make_image(fill_color="black", back_color="white")

    buffered = io.BytesIO()
    img.save(buffered, format="PNG")
    img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")

    return jsonify({
        "status": "success",
        "secret": secret,
        "qr_code": img_str
    })

@app.route('/verify-2fa', methods=['POST'])
def verify_2fa():
    """Verifies a user's OTP."""
    data = request.get_json()
    username = data.get('username')
    otp = data.get('otp')

    if not username or not otp:
        return jsonify({"status": "error", "message": "Username and OTP are required"}), 400

    secret = user_secrets.get(username)
    if not secret:
        return jsonify({"status": "error", "message": "User not found or 2FA not set up"}), 404

    totp = pyotp.TOTP(secret)
    if totp.verify(otp):
        return jsonify({"status": "success", "message": "2FA verification successful!"})
    else:
        return jsonify({"status": "error", "message": "Invalid OTP. Please try again."})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)