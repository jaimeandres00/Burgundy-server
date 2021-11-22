const { validationResult } = require('express-validator');
const Category = require('../models/category.model');

// @route POST api/category/create
// @desc Create category
// @access Private admin
async function createCategory(req, res) {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            error: erros.array()[0].msg
        })
    }

    const { name } = req.body;
    try {
        let category = await Category.findOne({ name });

        if(category) {
            return res.status(403).json({
                error: 'La categoria ya existe'
            });
        }

        const newCategory = new Category({ name });
        category = await newCategory.save();
        res.json(category);

    } catch (error) {
        console.log(error);
        res.status(500).send('Error del servidor');
    }
};

// @route GET api/category/list
// @desc Get all categories
// @access Public
async function getCategories(req, res) {
    try {
        let data = await Category.find({});
        res.json(data);
    } catch (error) {
        console.log(error);
        res.status(500).send('Error del servidor');
    }
};

// @route GET api/category/get/:categoryId
// @desc Get a single category
// @access Public
async function getCategory(req, res) {
    res.json(req.category);
};

// @route PUT api/category/update/:categoryId
// @desc Update category
// @access Private admin
async function updateCategory(req, res) {
    let category = req.category;
    const { name } = req.body;
    if(name) category.name = name.trim();

    try {
        category = await category.save();
        res.json(category);

    } catch (error) {
        console.log(error.message);
        res.status(500).send('Error del servidor');
    }
};

// @route DELETE api/category/delete/:categoryId
// @desc Delete single category
// @access Private admin
async function deleteCategory(req, res) {
    let category = req.category;

    try {
        let deletedCategory = await category.remove();
        
        res.json({
            message: `Se elimino la categoria de ${ deletedCategory.name } satisfactoriamente`
        });

    } catch (error) {
        console.log(error.message);
        res.status(500).send('Error del servidor');
    }
};

module.exports = {
    createCategory: createCategory,
    getCategories: getCategories,
    getCategory: getCategory,
    updateCategory: updateCategory,
    deleteCategory: deleteCategory
};
