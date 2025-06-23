const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('index', { title: 'Home Page' });
});

router.get('/logout', (req, res) => {
  res.set('WWW-Authenticate', 'Basic realm="Products Area"');
  res.status(401).redirect('/');
});

module.exports = router