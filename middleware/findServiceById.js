const mongoose = require('mongoose');
const Service = require('../models/service.model');

module.exports = async function (req, res, next) {
    const { serviceId } = req.params;

    if(!mongoose.Types.ObjectId.isValid(serviceId)) {
        return res.status(403).json({
            error: 'Servicio no encontrado'
        });
    }

    try {
        let service = await Service.findById(serviceId).populate('category');

        if(!service) {
            return res.status(403).json({
                error: 'Servicio no encontrado'
            });
        }

        req.service = service;

    } catch (error) {
        console.log(error);
        res.send('Error del servidor');
    }

    next();
};