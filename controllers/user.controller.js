const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const gravatar = require('gravatar');
const { validationResult } = require('express-validator');
const User = require('../models/user.model.js');

// @route POST api/user/register
// @desc Register user
// @access Private admin
async function createUser(req, res) {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    const { name, lastname, phone, gender, email, password, role } = req.body;
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
            name, lastname, phone, birthdate, gender, avatar, email, password, role
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
        res.status(500).send('Error del servidor');
    }
};

// @route POST api/user/profile
// @desc User information
// @access Private
async function getUser(req, res) {
    try {
        // Get user information by id
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);

    } catch (error) {
        console.log(error.message);
        res.status(500).send('Error del servidor');
    }
};

module.exports = {
    createUser: createUser,
    getUser: getUser
};