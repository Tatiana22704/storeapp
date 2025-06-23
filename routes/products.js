const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const auth = require('basic-auth');

// Protect all product routes
const basicAuth = (req, res, next) => {
  const user = auth(req);
  const username = 'admin';
  const password = 'admin';

  if (user && user.name === username && user.pass === password) {
    return next();
  }

  res.set('WWW-Authenticate', 'Basic realm="Products Area"');
  res.status(401).send('Authentication required.');
};
router.use(basicAuth);

// Connect to store.db
const dbPath = path.resolve(__dirname, '../store.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Could not connect to database', err.message);
  } else {
    console.log('Connected to store.db');
  }
});

// CREATE
router.post('/add', (req, res) => {
  const { name, description, price, image_url, category } = req.body;
  const sql = `INSERT INTO products (name, description, price, image_url, category) VALUES (?, ?, ?, ?, ?)`;
  db.run(sql, [name, description, price, image_url, category], function(err) {
    if (err) return res.status(500).send(err.message);
    res.redirect('/products');
  });
});

// READ
router.get('/', (req, res) => {
  db.all('SELECT * FROM products', [], (err, rows) => {
    if (err) return res.status(500).send(err.message);
    res.render('products', { products: rows });
  });
});

// UPDATE
router.post('/edit/:id', (req, res) => {
  const { name, description, price, image_url, category } = req.body;
  const sql = `UPDATE products SET name = ?, description = ?, price = ?, image_url = ?, category = ? WHERE id = ?`;
  db.run(sql, [name, description, price, image_url, category, req.params.id], function(err) {
    if (err) return res.status(500).send(err.message);
    res.redirect('/products');
  });
});

// DELETE
router.post('/delete/:id', (req, res) => {
  db.run('DELETE FROM products WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(500).send(err.message);
    res.redirect('/products');
  });
});

module.exports = router;