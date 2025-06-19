const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./unfreeze.db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      reference_number TEXT UNIQUE,
      user_id INTEGER,
      name TEXT,
      mobile TEXT,
      email TEXT,
      address TEXT,
      account_type TEXT,
      account_ownership TEXT,
      account_number TEXT,
      ncrp_ack_number TEXT,
      account_opening_year TEXT,
      business_description TEXT,
      transaction_reason TEXT,
      id_proof_type TEXT,
      document_paths TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);
});

module.exports = db;