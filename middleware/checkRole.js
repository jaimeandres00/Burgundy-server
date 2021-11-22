const User =  require('../models/user.model');

async function isAdmin(req, res, next) {
    try {
        // Get user information by id
        const user = await User.findOne({
            _id: req.user.id
        });

        if (user.role !== 2) {
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

async function isServiceProvider(req, res, next) {
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

async function isAdminOrServiceProvider(req, res, next) {
    try {
        // Get user information by id
        const user = await User.findOne({
            _id: req.user.id
        });

        if (user.role !== 1 && user.role !== 2) {
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

module.exports = {
    isAdmin: isAdmin,
    isServiceProvider: isServiceProvider,
    isAdminOrServiceProvider: isAdminOrServiceProvider
};