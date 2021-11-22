const jwt = require('jsonwebtoken');

function checkAuth(req, res, next) {
    // Get token from header
    const token = req.header('x-auth-token');

    // Check if no token
    if(!token) {
        return res.status(401).json({
            msg: 'Autorización denegada'
        });
    }

    // Verify token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Set user id in req.user
        req.user = decoded.user,
        next();
    } catch (error) {
        req.status(401).json({
            msg: 'Token invalido'
        });
    }
};

module.exports = {
    checkAuth: checkAuth
};