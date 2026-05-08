const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('./database.sqlite');

// Vulnerable Login
app.post('/api/login-vulnerable', (req, res) => {
    // only taking username to allow the logic bypass from the home signing example
    const { username } = req.body;

    // the user input is directly pasted into the SQL string
    // the DB treats the input as executable code, not just text
    // this allows attackers to inject logic like ' OR '1'='1', forcing the query to always be true and bypassing the login even without a password
    const query = `SELECT * FROM users WHERE username = '${username}'`;

    db.get(query, (err, row) => {
        if (err) {
            res.status(500).json({ success: false, message: 'Server Error' });
        } else if (row) {
            res.json({ success: true, message: 'Login Successful (Vulnerable)!', user: row.username });
        } else {
            res.status(401).json({ success: false, message: 'Invalid Username or Password' });
        }
    });
});

// Secure Login
app.post('/api/login-secure', (req, res) => {
    const { username, password } = req.body;

// secure query the inputs are passed as parameters into the (?) 
// the DB treats them as literal text, not executable SQL code 
// this prevents SQL injection, as inputs like 'OR' are read as raw strings
    const query = `SELECT * FROM users WHERE username = ? AND password = ?`;

    db.get(query, [username, password], (err, row) => {
        if (err) {
            res.status(500).json({ success: false, message: 'Server Error' });
        } else if (row) {
            res.json({ success: true, message: 'Login Successful (Secure)!', user: row.username });
        } else {
            res.status(401).json({ success: false, message: 'Invalid Username or Password' });
        }
    });
});

// run server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});