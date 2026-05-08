## 🚀 The Demonstration Guide

### 🔵 The "Legitimate User" Run (Normal Access)
This confirms the application handles valid credentials correctly as stored in the database.
1. Use **either** the Legacy or Secure system card.
2. **Username:** `admin`
3. **Password:** `superSecret123`
4. **Action:** Click the Login button.
5. **Expected Result:** Successful login, confirming standard authentication logic works.

### 🔴 The "Bad Run" (Vulnerable Login)
This demonstrates a successful SQL injection attack that bypasses the login form.
1. Go to the **Legacy System** card in the UI.
2. **Input:** Enter `' OR '1'='1` in the Username field.
3. **Action:** Click the Login button.
4. **Expected Result:** Successful login without valid credentials.

### 🟢 The "Good Run" (Secure Login)
This demonstrates the effectiveness of the mitigation using measures like parameterized queries or prepared statements.
1. Go to the **Secure System** card in the UI.
2. **Input:** Attempt the same SQL injection attack by entering `' OR '1'='1` in the Username field.
3. **Action:** Click the Login button.
4. **Expected Result:** Login should fail, proving the attack was blocked.

## 🛠 Setup Instructions
Both components **must be running** for the application to function correctly:
* See `/frontend/README.md` for the Angular UI setup.
* See `/backend/README.md` for the Node.js/SQLite server setup.