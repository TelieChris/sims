const db = require('../models/db');

// Create spare part
exports.createSparePart = (req, res) => {
  const { name, category, quantity, unit_price, total_price } = req.body;
  const sql = 'INSERT INTO spare_part (name, category, quantity, unit_price, total_price) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [name, category, quantity, unit_price, total_price], (err, result) => {
    if (err) return res.status(500).send(err);
    res.send({ message: 'Spare part added successfully' });
  });
};

// Get all spare parts
exports.getAllSpareParts = (req, res) => {
  db.query('SELECT * FROM spare_part', (err, rows) => {
    if (err) return res.status(500).send(err);
    res.send(rows);
  });
};

// Update spare part
exports.updateSparePart = (req, res) => {
  const { id } = req.params;
  const { name, category, quantity, unit_price, total_price } = req.body;
  const sql = `
    UPDATE spare_part 
    SET name = ?, category = ?, quantity = ?, unit_price = ?, total_price = ?
    WHERE spare_part_id = ?
  `;
  db.query(sql, [name, category, quantity, unit_price, total_price, id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.send({ message: 'Spare part updated successfully' });
  });
};

// Delete spare part
exports.deleteSparePart = (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM spare_part WHERE spare_part_id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.send({ message: 'Spare part deleted successfully' });
  });
};
