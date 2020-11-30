const express = require('express');
const router = express.Router();
const CategoryController = require('./controller/categoryController');
const authVerify = require('../../middleware/authVerify');

router.post('/createOne', CategoryController.createCategory);
router.get('/fetchallcategories', CategoryController.fetchallCategories)
module.exports = router;
