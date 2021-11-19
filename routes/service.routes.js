const express = require('express');
const formidable = require('formidable');
const fs = require('fs');
const Service = require('../models/service.model');
const auth = require('../middleware/checkAuth');
const adminAuth = require('../middleware/checkAdmin');
const serviceById = require('../middleware/findServiceById');

const router = express.Router();

// @route POST api/service/create
// @desc Create a service
// @access Private admin
router.post('/create', auth, adminAuth, async (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, async (err, fields, files) => {
        if(err) {
            return res.status(400).json({
                error: 'No fue posible cargar la imagen'
            });
        }

        if(!files.image) {
            return res.status(400).json({
                error: 'La imagen es requerida'
            });
        }

        if(files.image.mimetype !== 'image/jpeg' && files.image.mimetype !== 'image/jpg' && files.image.mimetype !== 'image/png') {
            return res.status(400).json({
                error: 'Formato de imagen no permitido'
            });
        }

        // Check for all fields
        const { title, description, price, category, user} = fields;
        
        if(!title || !description || !price || !category || !user) {
            return res.status(400).json({
                error: 'Todos los campos son requeridos'
            });
        }

        let service = new Service(fields);
        // 1 MB = 1000000
        if(files.image.size > 1000000) {
            return res.status(400).json({
                error: 'Imagen con tamaño superior a 1MB'
            });
        }

        service.image.data = fs.readFileSync(files.image.filepath);
        service.image.contentType = files.image.mimetype;

        try {
            await service.save();
            res.json('Servicio creado satisfactoriamente');
        } catch (error) {
            console.log(error);
            res.status(500).send('Error del servidor');
        }
    });
});

// @route GET api/service/get/:serviceId
// @desc Get service information
// @access Public
router.get('/get/:serviceId', serviceById, (req, res) => {
    req.service.image = undefined;
    return res.json(req.service);
});

// @route GET api/service/get/image/:serviceId
// @desc Get service image
// @access Public
router.get('/get/image/:serviceId', serviceById, (req, res) => {
    if(req.service.image.data) {
        res.set('Content-Type', req.service.image.contentType);
        return res.send(req.service.image.data);
    }

    res.status(400).json({
        error: 'Falla al cargar la imagen del servicio'
    });
});

module.exports = router;