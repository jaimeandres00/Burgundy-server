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

// @route GET api/user/list
// @desc Get a list of users with filter
// option(order = asc or desc, sortBy any user like name, limit, number of returned user)
// @access Public
async function getUsers(req, res) {
    let order = req.query.order ? req.query.order : 'asc';
    let sortBy = req.query.sortBy ? req.query.sortBy : '_id';
    let limit = req.query.limit ? parseInt(req.query.limit) : 6;

    try {
        let users = await User.find({})
        .select('-password').sort([
            [sortBy, order]
        ]).limit(limit).exec();

        res.json(users);

    } catch(error) {
        console.log(error);
        res.status(500).send('Consulta invalida');
    }
};

// @route GET api/user/search
// @desc Get a list of users by search query
// @access Private admin
async function searchUsers(req, res) {
    const query = {};

    if(req.query.search) {
        query.name = {
            $regex: req.query.search,
            $options: 'i'
        }

        // Assign name
        if(req.query.category && req.query.category != 'All') {
            query.category = req.query.category;
        }        
    }

    try {
        let users = await User.find(query).select('-password');
        res.json(users);
    } catch (error) {
        console.log(error);
        res.status(500).send('Error al obtener los servicios');
    }
};

// @route PUT api/user/update/:userId
// @desc Update user information
// @access Private admin
async function updateUser(req, res) {
    let user = req.user;
    const { name, lastname, phone, gender, password, role } = req.body;
    if(name) user.name = name.trim();
    if(lastname) user.lastname = lastname.trim();
    if(phone) user.phone = phone.trim();
    if(gender) user.gender = gender;
    if(role) user.role = role;

    if(password) {
        // Encrypt password
        const salt = await bcrypt.genSalt(10); // Generate salt contains 10
        // Save password
        user.password = await bcrypt.hash(password, salt); // Use user password and salt to hash password      
    }

    try {
        user = await user.save();
        res.json(user);

    } catch (error) {
        console.log(error.message);
        res.status(500).send('Error del servidor');
    }
};

// @route DELETE api/user/delete/:userId
// @desc Delete user account
// @access Private admin
async function deleteUser(req, res) {
    let user = req.user;

    try {
        let deletedUser = await user.remove();

        res.json({
            message: `Se elimino el usuario ${ deletedUser.name } satisfactoriamente`
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Error del servidor');        
    }
};

module.exports = {
    createUser: createUser,
    getUsers: getUsers,
    getUser: getUser,
    searchUsers: searchUsers,
    updateUser: updateUser,
    deleteUser: deleteUser
};