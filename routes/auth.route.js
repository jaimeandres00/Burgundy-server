const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const gravatar = require('gravatar');

const User = require('../models/user.model.js');

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
    check('password', 'Ingresa una contraseña con 8 o más caracteres').isLength({
        min: 8
    })
], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    const { name, lastname, phone, gender, email, password } = req.body;
    const birthdate = new Date(req.body.birthdate);

    try {
        // Check if user already exist
        let user = await User.findOne({ email });

        // If user exist
        if (user) {
            return res.status(400).json({
                errors: [{
                    msg: 'El usuario que se intenta registrar ya existe',

                }]
            });
        }

        // If not exists
        // Get image from gravatar
        const avatar = gravatar.url(email, {
            s: '200', // Size
            r: 'pg', // Rate
            d: 'mm'
        });

        // Create user object
        user = new User({
            name, lastname, phone, birthdate, gender, avatar, email, password
        });

        // Encrypt password
        const salt = await bcrypt.genSalt(10); // Generate salt contains 10
        // Save password
        user.password = await bcrypt.hash(password, salt); // Use user password and salt to hash password
        // Saver user in database
        await user.save();

        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(
            payload, 
            process.env.JWT_SECRET, {
                expiresIn: 360000 // for development for production it will 3600
            }, (err, token) => {
                if (err) throw err
                res.json({token})
            }
        );

    } catch (error) {
        console.log(error.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;