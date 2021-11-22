const formidable = require('formidable');
const fs = require('fs');
const Service = require('../models/service.model');

// @route POST api/service/create
// @desc Create a service
// @access Private admin, service provider
async function createService(req, res) {
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
};

// @route GET api/service/get/:serviceId
// @desc Get service information
// @access Public
function getService(req, res) {
    req.service.image = undefined;
    return res.json(req.service);
};

// @route GET api/service/get/image/:serviceId
// @desc Get service image
// @access Public
function getServiceImage(req, res) {
    if(req.service.image.data) {
        res.set('Content-Type', req.service.image.contentType);
        return res.send(req.service.image.data);
    }

    res.status(400).json({
        error: 'Falla al cargar la imagen del servicio'
    });
};

// @route GET api/service/list
// @desc Get a list of services with filter
// option(order = asc or desc, sortBy any service like title, limit, number of returned service)
// @access Public
async function getServices(req, res) {
    let order = req.query.order ? req.query.order : 'asc';
    let sortBy = req.query.sortBy ? req.query.sortBy : '_id';
    let limit = req.query.limit ? parseInt(req.query.limit) : 6;

    try {
        let services = await Service.find({})
        .select('-image').populate('category').sort([
            [sortBy, order]
        ]).limit(limit).exec();

        res.json(services);

    } catch(error) {
        console.log(error);
        res.status(500).send('Consulta invalida');
    }
};

// @route GET api/service/categories
// @desc Get a list of categories of services
// @access Public
async function getCategories(req, res) {
    try {
        let categories = await Service.distinct('category');
        if(!categories) {
            return res.status(400).json({
                error: 'Categorias no encontradas'
            });
        }

        res.json(categories);

    } catch (error) {
        console.log(error);
        res.status(500).send('Error del servidor');
    }
};

// @route GET api/service/search
// @desc Get a list of services by search query
// @access Public
async function searchServices(req, res) {
    const query = {};

    if(req.query.search) {
        query.title = {
            $regex: req.query.search,
            $options: 'i'
        }

        // Assign category
        if(req.query.category && req.query.category != 'All') {
            query.category = req.query.category;
        }
    }

    try {
        let services = await Service.find(query).select('-image');
        res.json(services);
    } catch (error) {
        console.log(error);
        res.status(500).send('Error al obtener los servicios');
    }
};

// @route PUT api/service/update/:serviceId
// @desc Update service
// @access Private admin, service provider
async function updateService(req, res) {
    let service = req.service;
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, async (err, fields, files) => {
        if(err) {
            return res.status(400).json({
                error: 'No fue posible cargar la imagen'
            });
        }
        
        if(files.image) {
            if(files.image.mimetype !== 'image/jpeg' && files.image.mimetype !== 'image/jpg' && files.image.mimetype !== 'image/png') {
                return res.status(400).json({
                    error: 'Formato de imagen no permitido'
                });
            }

            if(files.image.size > 1000000) {
                return res.status(400).json({
                    error: 'Imagen con tamaño superior a 1MB'
                });
            }

            service.image.data = fs.readFileSync(files.image.filepath);
            service.image.contentType = files.image.mimetype;
        }
        
        // Check for all fields
        const { title, description, price, category } = fields;

        if(title) service.title = title.trim();
        if(description) service.description = description.trim();
        if(price) service.price = price.trim();
        if(category) service.category = category.trim();
       
        try {
            service = await service.save();
            res.json(service);
        } catch (error) {
            console.log(error);
            res.status(500).send('Error del servidor');
        }        
    });
};

// @route DELETE api/service/delete/:serviceId
// @desc Delete service
// @access Private admin, service provider
async function deleteService(req, res) {
    let service = req.service;

    try {
        let deletedService = await service.remove();

        res.json({
            message: `Se elimino el servicio ${ deletedService.title } satisfactoriamente`
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Error del servidor');        
    }
};

module.exports = {
    createService: createService,
    getService: getService,
    getServiceImage: getServiceImage,
    getServices: getServices,
    getCategories: getCategories,
    searchServices: searchServices,
    updateService: updateService,
    deleteService: deleteService
};