const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const gravatar = require('gravatar');
const { validationResult } = require('express-validator');
const User = require('../models/user.model.js');

// @route POST api/user/register
// @desc Register user
// @access Public
async function signUp(req, res) {
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
                res.json({
                    id: user.id,
                    name: user.name,
                    lastname: user.lastname,
                    gender: user.gender,
                    email: user.email,
                    role: user.role,
                    authToken: token
                })
            }
        );

    } catch (error) {
        console.log(error.message);
        res.status(500).send('Error del servidor');
    }
};

// @route POST api/user/login
// @desc Login user
// @access Public
async function signIn(req, res) {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    // If everything is good
    // Get email and password from request body
    const { email, password } = req.body;

    try {
        // Find user
        let user = await User.findOne({
            email
        });

        // If user not found in database
        if(!user) {
            return res.status(400).json({
                errors: [{
                    msg: 'Correo electrónico o contraseña incorrecta'
                }]
            });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);

        // If password don't match
        if(!isMatch) {
            return res.status(400).json({
                errors: [{
                    msg: 'Correo electrónico o contraseña incorrecta'
                }]
            });
        }

        // Payload for jwt
        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET, {
                expiresIn: 360000
            }, (err, token) => {
                if(err) throw err;
                res.json({
                    id: user.id,
                    name: user.name,
                    lastname: user.lastname,
                    gender: user.gender,
                    email: user.email,
                    role: user.role,
                    authToken: token
                })
            }
        );

    } catch (error) {
        console.log(error.message);
        res.status(500).send('Error del servidor');
    }   
};

module.exports = {
    signUp: signUp,
    signIn: signIn
};