const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, './')));

// Database setup
const db = new sqlite3.Database('./game.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database.');
        db.run(`CREATE TABLE IF NOT EXISTS rankings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            score INTEGER NOT NULL,
            theme TEXT,
            difficulty TEXT,
            date DATETIME DEFAULT CURRENT_TIMESTAMP
        )`, (err) => {
            if (err) console.error('Error creating table:', err.message);
        });
    }
});

// API Endpoints
app.post('/api/score', (req, res) => {
    const { name, score, theme, difficulty } = req.body;
    if (!name || score === undefined) {
        return res.status(400).json({ error: 'Name and score are required.' });
    }

    const query = `INSERT INTO rankings (name, score, theme, difficulty) VALUES (?, ?, ?, ?)`;
    db.run(query, [name, score, theme, difficulty], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Score saved!', id: this.lastID });
    });
});

app.get('/api/ranking', (req, res) => {
    const query = `SELECT name, score, theme, difficulty, date FROM rankings ORDER BY score DESC LIMIT 10`;
    db.all(query, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
