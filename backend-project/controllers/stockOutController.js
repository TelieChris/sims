const db = require('../models/db');

// Create stock out
exports.createStockOut = (req, res) => {
  const { spare_part_id, stockout_quantity, stockout_unit_price, stockout_total_price, stockout_date } = req.body;

  const sql = 'INSERT INTO stock_out (spare_part_id, stockout_quantity, stockout_unit_price, stockout_total_price, stockout_date) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [spare_part_id, stockout_quantity, stockout_unit_price, stockout_total_price, stockout_date], (err, result) => {
    if (err) return res.status(500).send(err);

    // Update spare_part quantity
    db.query(
      'UPDATE spare_part SET quantity = quantity - ? WHERE spare_part_id = ?',
      [stockout_quantity, spare_part_id]
    );

    res.send({ message: 'Stock-out recorded' });
  });
};

// Delete stock out
exports.deleteStockOut = (req, res) => {
  const id = req.params.id;
  const sql = 'DELETE FROM stock_out WHERE stock_out_id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.send({ message: 'Stock-out deleted' });
  });
};

// Update stock out
exports.updateStockOut = (req, res) => {
  const id = req.params.id;
  const { stockout_quantity, stockout_unit_price, stockout_total_price, stockout_date } = req.body;
  const sql = 'UPDATE stock_out SET stockout_quantity=?, stockout_unit_price=?, stockout_total_price=?, stockout_date=? WHERE stock_out_id=?';
  db.query(sql, [stockout_quantity, stockout_unit_price, stockout_total_price, stockout_date, id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.send({ message: 'Stock-out updated' });
  });
};

// Get all stock-outs (with spare part name)
exports.getAllStockOuts = (req, res) => {
  const sql = `
    SELECT 
      s.stock_out_id,
      s.spare_part_id,
      sp.name AS spare_part_name,
      s.stockout_quantity,
      s.stockout_unit_price,
      s.stockout_total_price,
      s.stockout_date
    FROM stock_out s
    JOIN spare_part sp ON s.spare_part_id = sp.spare_part_id
  `;

  db.query(sql, (err, rows) => {
    if (err) return res.status(500).send(err);
    res.send(rows);
  });
};

