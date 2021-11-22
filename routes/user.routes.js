const express = require('express');
const { check } = require('express-validator');
const checkAuthMiddleware  = require('../middleware/checkAuth');
const checkRoleMiddleware = require('../middleware/checkRole');
const userByIdMiddleware = require('../middleware/findUserById');
const userController = require('../controllers/user.controller');

const router = express.Router();

// @route POST api/user/register
// @desc Register service provider
// @access Private admin
router.post('/create', [
    // validation
    check('name', 'El nombre es requerido').not().isEmpty(),
    check('lastname', 'Los apellidos son requeridos').not().isEmpty(),
    check('phone', 'El número de teléfono celular es requerido').not().isEmpty(),
    check('birthdate', 'La fecha de nacimiento es requerida').not().isEmpty(),
    check('gender', 'El género es requerido').not().isEmpty(),
    check('email', 'Ingresa un correo electrónico valido').isEmail(),
    check('password', 'Ingresa una contraseña con 8 o más caracteres').isLength({ min: 8 }),
    check('role', 'El rol del usuario es requerido').not().isEmpty()
], [checkAuthMiddleware.checkAuth, checkRoleMiddleware.isAdmin], userController.createUser);

// @route POST api/user/profile
// @desc User information
// @access Private
router.get('/profile', checkAuthMiddleware.checkAuth, userController.getUser);

// @route GET api/user/list
// @desc Get a list of users with filter
// @access Private admin
router.get('/list', [checkAuthMiddleware.checkAuth , checkRoleMiddleware.isAdmin], userController.getUsers);

// @route PUT api/user/update/:userId
// @desc Update user information
// @access Private admin
router.put('/update/:userId', [checkAuthMiddleware.checkAuth, checkRoleMiddleware.isAdmin], userByIdMiddleware, userController.updateUser);

// @route DELETE api/user/delete/:userId
// @desc Delete user account
// @access Private admin
router.delete('/delete/:userId', [checkAuthMiddleware.checkAuth, checkRoleMiddleware.isAdmin], userByIdMiddleware, userController.deleteUser);

module.exports = router;