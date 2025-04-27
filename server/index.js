// Express.js backend for authentication with SQLite and session support
const express = require('express');
const session = require('express-session');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const cors = require('cors');
const app = express();
const db = new sqlite3.Database('./users.db');

app.use(cors({ origin: ["http://localhost:3000", "http://localhost:5173"], credentials: true }));
app.use(express.json());
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 86400000,
    sameSite: "lax",
    path: "/"
  }
}));

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT
  )`);
});

app.post('/api/signup', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing fields' });
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) return res.status(500).json({ error: 'Server error' });
    db.run('INSERT INTO users (email, password) VALUES (?, ?)', [email, hash], function (err) {
      if (err) return res.status(400).json({ error: 'User exists' });
      req.session.userId = this.lastID;
      res.json({ success: true });
    });
  });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
    if (err || !user) return res.status(400).json({ error: 'Invalid credentials' });
    bcrypt.compare(password, user.password, (err, result) => {
      if (result) {
        req.session.userId = user.id;
        res.json({ success: true });
      } else {
        res.status(400).json({ error: 'Invalid credentials' });
      }
    });
  });
});

app.get('/api/session', (req, res) => {
  if (req.session.userId) {
    db.get('SELECT email FROM users WHERE id = ?', [req.session.userId], (err, user) => {
      if (user) res.json({ loggedIn: true, email: user.email });
      else res.json({ loggedIn: false });
    });
  } else {
    res.json({ loggedIn: false });
  }
});

app.post('/api/logout', (req, res) => {
  req.session.destroy(() => {
    // Use the same path as the session cookie
    res.clearCookie('connect.sid', { path: '/' });
    res.json({ success: true });
  });
});

app.listen(3001, () => console.log('Auth server running on port 3001'));
