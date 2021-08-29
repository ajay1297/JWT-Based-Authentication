'use strict';

/**
 * Login Management Functions
 */

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('config');
const { validationResult } = require('express-validator');
const UserModel = require('../database/models/user_models');

class LoginManagement {
    /**
     * Login Function 
     * @param {*} req 
     * @param {*} res 
     * @returns Access Token & Refresh Token
     */
    async login(req, res) {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json(errors);
        }
        const {name, password} = req.body;
        try{
            const user = await UserModel.findOne({name});
            if(!user) {
                return res.status(400).json({errors: [{msg: 'User is not registered'}]});
            }
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
            }
            const accessToken = jwt.sign({name}, config.get('jwtSecretKey'), {expiresIn: '20s'});
            const refreshToken = jwt.sign({name}, config.get('jwtRefreshKey'), {expiresIn: '10d'});
            global.refreshTokenCache[name] = refreshToken;
            console.log(JSON.stringify(global.refreshTokenCache));
            req.session.user = name;
            return res.json({accessToken, refreshToken});
        }
        catch(exception) {
            console.log(exception.message);
            return res.status(500).send('Server Error');
        }
    }

    /**
     * Generates new Access token using Refresh token
     * @param {*} req 
     * @param {*} res 
     * @returns Access Token
     */
    async generateToken(req, res) {
        const refreshToken = req.body.token;
        if(!refreshToken) {
            return res.status(401).json({errors: [{msg: 'User not authorized'}]});
        }
        try {
            const decoded = jwt.verify(refreshToken, config.get('jwtRefreshKey'));
            console.log(JSON.stringify(global.refreshTokenCache));
            if(!global.refreshTokenCache[decoded.name] || global.refreshTokenCache[decoded.name] != refreshToken) {
                return res.status(401).json({errors: [{msg: 'User not authorized'}]});
            }
            const accessToken = jwt.sign({name: decoded.name}, config.get('jwtSecretKey'), {expiresIn: '20s'});
            return res.json({ accessToken });
        } catch(exception) {
            console.log(exception.message);
            return res.status(401).json({errors: [{msg: 'User not authorized'}]});
        }
    }
}

module.exports = new LoginManagement();