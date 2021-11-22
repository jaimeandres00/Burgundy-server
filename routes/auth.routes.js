const express = require('express');
const { check } = require('express-validator');
const authController = require('../controllers/auth.controller');

const router = express.Router();

// @route POST api/user/register
// @desc Register user
// @access Public
router.post('/register', [
    // validation
    check('name', 'El nombre es requerido').not().isEmpty(),
    check('lastname', 'Los apellidos son requeridos').not().isEmpty(),
    check('phone', 'El número de teléfono celular es requerido').not().isEmpty(),
    check('birthdate', 'La fecha de nacimiento es requerida').not().isEmpty(),
    check('gender', 'El género es requerido').not().isEmpty(),
    check('email', 'Ingresa un correo electrónico valido').isEmail(),
    check('password', 'Ingresa una contraseña con 8 o más caracteres').isLength({ min: 8 })
], authController.signUp);

// @route POST api/user/login
// @desc Login user
// @access Public
router.post('/login', [
    // Validation for email and password
    check('email', 'Ingresa un correo electrónico valido').isEmail(),
    check('password', 'Ingresa la contraseña asociada a tu cuenta').exists()
], authController.signIn);

module.exports = router;