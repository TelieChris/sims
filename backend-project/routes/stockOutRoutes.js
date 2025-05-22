const express = require('express');
const router = express.Router();
const controller = require('../controllers/stockOutController');

router.post('/', controller.createStockOut);
router.get('/', controller.getAllStockOuts);
router.delete('/:id', controller.deleteStockOut);
router.put('/:id', controller.updateStockOut);
  

module.exports = router;
