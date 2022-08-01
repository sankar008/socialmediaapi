const router = require('express').Router();

const { createCategory, getCategory, getCategoryById, updateCategory, deleteCategory } = require('./categories.controller');

router.post('/', createCategory);
router.get('/', getCategory);
router.get('/:id', getCategoryById);
router.patch('/', updateCategory);
router.delete('/:id', deleteCategory);

module.exports = router;