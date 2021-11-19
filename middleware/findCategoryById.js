const mongoose = require('mongoose');
const Category = require('../models/category.model');

module.exports = async function (req, res, next) {
    const { categoryId } = req.params;

    if(!mongoose.Types.ObjectId.isValid(categoryId)) {
        return res.status(403).json({
            error: 'Category not founded'
        });
    }

    try {
        let category = await Category.findById(categoryId);

        if(!category) {
            return res.status(403).json({
                error: 'Categoria no encontrada'
            });
        }

        req.category = category;
        next();

    } catch (error) {
        console.log(error);
        res.status(500).send('Error del servidor');
    }
};