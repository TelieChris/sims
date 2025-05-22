const express = require('express');
const router = express.Router();
const controller = require('../controllers/sparePartController');

router.post('/', controller.createSparePart);
router.get('/', controller.getAllSpareParts);
router.put('/:id', controller.updateSparePart);
router.delete('/:id', controller.deleteSparePart);


module.exports = router;
