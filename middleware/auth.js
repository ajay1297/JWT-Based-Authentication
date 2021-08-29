'use strict';

const config = require('config');
const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    try {
        const bearerToken = req.headers['authorization'];
        if(!bearerToken) {
            return res.status(401).json({msg: 'No token, Authorization denied'});
        }
        const bearer = bearerToken.split(" ");
        const token = bearer[1];

        if(!token) {
            return res.status(401).json({msg: 'No token, Authorization denied'});
        }
        try {
            const decoded = jwt.verify(token, config.get('jwtSecretKey'));
            req.session.user = decoded.name;
            next();
        } catch(exception) {
            res.status(401).json({msg: 'Token is not valid'});
        }
    } catch(exception) {
        console.log(exception.message);
        res.status(500).send('Server Error');
    }
}