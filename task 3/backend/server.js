const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();


const app = express();
app.use(cors()); // this let the front talk to this server
app.use(express.json()); //its let the server read what my front send

// login to my db
const db = new sqlite3.Database('./database.sqlite');


//this is the Vulnerable function
app.post('/api/login-vulnerable', (req, res) => {
    const { username, password } = req.body;

    //the "SQL Injection" hacking appends in this line
    // the user input is directly pasted into the SQL string.
    // The DB treats the input as executable code, not just text
    // This allows attackers to inject logic like ' OR '1'='1', forcing the query to always be true and bypassing the login
    const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;

    db.get(query, (err, row) => {
        if (err) {
            res.status(500).json({ success: false, message: 'שגיאת שרת' });
        } else if (row) {
            res.json({ success: true, message: 'התחברת בהצלחה (פגיע)!', user: row.username });
        } else {
            res.status(401).json({ success: false, message: 'שם משתמש או סיסמה שגויים' });
        }
    });
});


//my secure login function
app.post('/api/login-secure', (req, res) => {
    const { username, password } = req.body;

    // secure query the inputs are passed as parameters into the (?) 
    // the DB treats them as literal text, not executable SQL code 
    // this prevents SQL injection, as inputs like 'OR' are read as raw strings.
    const query = `SELECT * FROM users WHERE username = ? AND password = ?`;

    db.get(query, [username, password], (err, row) => {
        if (err) {
            res.status(500).json({ success: false, message: 'שגיאת שרת' });
        } else if (row) {
            res.json({ success: true, message: 'התחברת בהצלחה (מאובטח)!', user: row.username });
        } else {
            res.status(401).json({ success: false, message: 'שם משתמש או סיסמה שגויים' });
        }
    });
});

//runing the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});