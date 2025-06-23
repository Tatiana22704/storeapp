const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./store.db', (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      image_url TEXT,
      category TEXT
    )
  `, (err) => {
    if (err) console.error(err.message);
    else console.log('products table created.');
  });

});