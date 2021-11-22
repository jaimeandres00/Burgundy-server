const express = require('express');
const checkAuthMiddleware  = require('../middleware/checkAuth');
const checkRoleMiddleware  = require('../middleware/checkRole');
const serviceByIdMiddleware = require('../middleware/findServiceById');
const serviceController = require('../controllers/service.controller');

const router = express.Router();

// @route POST api/service/create
// @desc Create a service
// @access Private admin, service provider
router.post('/create', [checkAuthMiddleware.checkAuth, checkRoleMiddleware.isAdminOrServiceProvider], serviceController.createService);

// @route GET api/service/get/:serviceId
// @desc Get service information
// @access Public
router.get('/get/:serviceId', serviceByIdMiddleware, serviceController.getService);

// @route GET api/service/get/image/:serviceId
// @desc Get service image
// @access Public
router.get('/get/image/:serviceId', serviceByIdMiddleware, serviceController.getServiceImage);

// @route GET api/service/list
// @desc Get a list of services with filter
// option(order = asc or desc, sortBy any product like title, limit, number of returned product)
// @access Public
router.get('/list', serviceController.getServices);

// @route GET api/service/categories
// @desc Get a list of categories of services
// @access Public
router.get('/categories', serviceController.getCategories);

// @route GET api/service/search
// @desc Get a list of services by search query
// @access Public
router.get('/search', serviceController.searchServices);

// @route PUT api/service/update/:serviceId
// @desc Update service
// @access Private admin, service provider
router.put('/update/:serviceId', [checkAuthMiddleware.checkAuth, checkRoleMiddleware.isAdminOrServiceProvider], serviceByIdMiddleware, serviceController.updateService);

// @route DELETE api/service/delete/:serviceId
// @desc Delete single category
// @access Private admin, service provider
router.delete('/delete/:serviceId', [checkAuthMiddleware.checkAuth, checkRoleMiddleware.isAdminOrServiceProvider], serviceByIdMiddleware, serviceController.deleteService);

module.exports = router;