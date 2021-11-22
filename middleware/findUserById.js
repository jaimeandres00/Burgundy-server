const mongoose = require('mongoose');
const User = require('../models/user.model');

module.exports = async function (req, res, next) {
    const { userId } = req.params;

    if(!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(403).json({
            error: 'Usuario no encontrado'
        });
    }

    try {
        let user = await User.findById(userId).select('-password');

        if(!user) {
            return res.status(403).json({
                error: 'Usuario no encontrado'
            });
        }

        req.user = user;

    } catch (error) {
        console.log(error);
        res.send('Error del servidor');
    }

    next();
};