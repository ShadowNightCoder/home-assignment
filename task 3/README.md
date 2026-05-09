## 🚀 The Demonstration Guide

### 🔵 The "Legitimate User" Run (Normal Access)
This confirms the application handles valid credentials correctly as stored in the database.
1. Use **either** the Legacy or Secure system card.
2. **Username:** `admin`
3. **Password:** `superSecret123`
4. **Action:** Click the Login button.
5. **Expected Result:** Successful login, confirming standard authentication logic works.

### 🔴 The "Bad Run" (Vulnerable Login)
This demonstrates a successful SQL injection attack that bypasses the authentication logic entirely. You can attack either the password or the username field:

### 🔴 The "Bad Run" (Vulnerable Login)
This demonstrates a successful SQL injection attack that bypasses the authentication logic entirely. You can attack either the password or the username field:

**Option A: Attack the Password Field**
1. Go to the **Legacy System** card in the UI.
2. **Username:** *(Enter absolutely any text)*
3. **Password:** `' OR '1'='1`
4. **Action:** Click the Login button.
5. **Expected Result:** Successful login! Because the injected logic (`1=1`) makes the query true for every row in the database, the system simply logs you in as the first user it finds in the table, ignoring the username you entered.

**Option B: Attack the Username Field**
1. Go to the **Legacy System** card in the UI.
2. **Username:** `' OR '1'='1' --` *(Note the space after the dashes)*
3. **Password:** *(Leave blank or type anything)*
4. **Action:** Click the Login button.
5. **Expected Result:** Successful login without valid credentials! The `--` acts as a SQL comment, completely deleting the password requirement from the backend query.

### 🟢 The "Good Run" (Secure Login)
This demonstrates the effectiveness of the mitigation using parameterized queries/prepared statements.
1. Go to the **Secure System** card in the UI.
2. **Input:** Attempt either of the SQL injection attacks listed above.
3. **Action:** Click the Login button.
4. **Expected Result:** Login should fail, proving the attack was safely treated as literal text rather than executable SQL code.

## 🛠 Setup Instructions
Both components **must be running** for the application to function correctly:
* See `/frontend/README.md` for the Angular UI setup.
* See `/backend/README.md` for the Node.js/SQLite server setup.