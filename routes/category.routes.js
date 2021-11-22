const express = require('express');
const { check } = require('express-validator');
const checkAuthMiddleware  = require('../middleware/checkAuth');
const checkRoleMiddleware  = require('../middleware/checkRole');
const categoryByIdMiddleware = require('../middleware/findCategoryById');
const categoryController = require('../controllers/category.controller');

const router = express.Router();

// @route POST api/category/create
// @desc Create category
// @access Private admin
router.post('/create', [
    check('name', 'El nombre es requerido').trim().not().isEmpty()
], [checkAuthMiddleware.checkAuth, checkRoleMiddleware.isAdmin], categoryController.createCategory);

// @route GET api/category/list
// @desc Get all categories
// @access Public
router.get('/list', categoryController.getCategories);

// @route GET api/category/get/:categoryId
// @desc Get single category
// @access Public
router.get('/get/:categoryId', categoryByIdMiddleware, categoryController.getCategory);

// @route PUT api/category/update/:categoryId
// @desc Update category
// @access Private admin
router.put('/update/:categoryId', [checkAuthMiddleware.checkAuth, checkRoleMiddleware.isAdmin], categoryByIdMiddleware, categoryController.updateCategory);

// @route DELETE api/category/delete/:categoryId
// @desc Delete single category
// @access Private admin
router.delete('/delete/:categoryId', [checkAuthMiddleware.checkAuth, checkRoleMiddleware.isAdmin], categoryByIdMiddleware, categoryController.deleteCategory);

module.exports = router;
