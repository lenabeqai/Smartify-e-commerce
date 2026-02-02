const express = require('express');
const router = express.Router();
const categoryController = require('../Controllers/categoryController');
const auth = require('../middleware/auth');

router.post('/', categoryController.createCategory);
router.get('/', categoryController.getAllCategories);
router.put('/:id', categoryController.editCategory);
router.delete('/:id',  categoryController.deleteCategory);

module.exports = router;