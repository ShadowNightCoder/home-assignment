const sqlite3 = require('sqlite3').verbose();

// This sets up the local database, creates the users table, and inserts the dummy user
const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.error('Connected to the SQLite database.');
        
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            password TEXT
        )`, (err) => {
            if (err) {
                console.error('Error creating table', err.message);
            } else {
                console.log('Table "users" ready.');
                
                const insert = 'INSERT OR IGNORE INTO users (username, password) VALUES (?, ?)';
                db.run(insert, ['admin', 'superSecret123'], (err) => {
                    if (err) {
                        console.error('Error inserting user', err.message);
                    } else {
                        console.log('Dummy user "admin" created successfully!');
                    }
                });
            }
        });
    }
});

db.close();