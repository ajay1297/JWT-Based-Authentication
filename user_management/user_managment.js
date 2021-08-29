'use strict';

/**
 * User Management Functions
 */

const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const UserModel = require('../database/models/user_models');

class UserManagement {
    /**
     * Registers/Signup a User
     * @param {*} req 
     * @param {*} res 
     */
    async register(req, res) {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json(errors);
        }
        try {
            let {name, password, contact, address, country, gender} = req.body;
            let user = await UserModel.findOne({name});
            if(user && name.toLowerCase() == user.name.toLowerCase()) {
                console.log(user);
                return res.status(400).json({errors: [{msg: 'User already exists'}]});
            }
            user = new UserModel({name, password, contact, address, country, gender});
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
            await user.save();
            return res.send('User Registered');
        }
        catch(exception) {
            console.log(exception.message);
            return res.status(500).send('Server Error');
        }
    }

    /**
     * Search users based on name or contact number
     * @param {*} req 
     * @param {*} res 
     * @returns Users
     */
    async searchUsers(req, res) {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json(errors);
        }
        try {
            let searchParameter = {};
            if(req.body.contact) {
                searchParameter.contact = req.body.contact;
            } else {
                searchParameter.name = req.body.name;
            }
            let user = await UserModel.find(searchParameter).select('-password');
            if(user) {
                return res.json(user);
            } else {
                return res.send('No Data Found');
            }

        } catch(exception) {
            console.log(exception.message);
            return res.status(500).send('Server Error');
        }
    }
}

module.exports = new UserManagement();