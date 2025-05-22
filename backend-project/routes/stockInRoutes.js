const express = require('express');
const router = express.Router();
const controller = require('../controllers/stockInController');

router.post('/', controller.createStockIn);
router.get('/', controller.getAllStockIn);
router.put('/:id', controller.updateStockIn);
router.delete('/:id', controller.deleteStockIn);


module.exports = router;
