const User =  require('../models/user.model');

module.exports = async function (req, res, next) {
    try {
        // Get user information by id
        const user = await User.findOne({
            _id: req.user.id
        });

        if (user.role !== 1) {
            return res.status(403).json({
                error: 'Acceso no autorizado'
            });
        }

        next();

    } catch (error) {
        console.log(error);
        res.status(500).send('Error del servidor');
    }
};