const db = require('../models/db');

// Create stock in
exports.createStockIn = (req, res) => {
  const { spare_part_id, stockin_quantity, stockin_date } = req.body;
  const sql = 'INSERT INTO stock_in (spare_part_id, stockin_quantity, stockin_date) VALUES (?, ?, ?)';
  db.query(sql, [spare_part_id, stockin_quantity, stockin_date], (err, result) => {
    if (err) return res.status(500).send(err);

    // Update spare_part quantity
    db.query(
      'UPDATE spare_part SET quantity = quantity + ? WHERE spare_part_id = ?',
      [stockin_quantity, spare_part_id]
    );

    res.send({ message: 'Stock-in recorded' });
  });
};

exports.getAllStockIn = (req, res) => {
  const sql = `
    SELECT si.stock_in_id, si.spare_part_id, sp.name, si.stockin_quantity, si.stockin_date 
    FROM stock_in si 
    JOIN spare_part sp ON si.spare_part_id = sp.spare_part_id
    ORDER BY si.stockin_date DESC
  `;
  db.query(sql, (err, rows) => {
    if (err) throw err;
    res.send(rows);
  });
};

exports.updateStockIn = (req, res) => {
  const { id } = req.params;
  const { spare_part_id, stockin_quantity, stockin_date } = req.body;
  const sql = 'UPDATE stock_in SET spare_part_id = ?, stockin_quantity = ?, stockin_date = ? WHERE stock_in_id = ?';
  db.query(sql, [spare_part_id, stockin_quantity, stockin_date, id], (err) => {
    if (err) return res.status(500).send(err);
    res.send({ message: 'Stock-in updated successfully' });
  });
};
exports.deleteStockIn = (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM stock_in WHERE stock_in_id = ?';
  db.query(sql, [id], (err) => {
    if (err) return res.status(500).send(err);
    res.send({ message: 'Stock-in deleted successfully' });
  });
};


