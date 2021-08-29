'use strict';

const jwt = require('jsonwebtoken');
const config = require('config');

class LogoutManagement {
    async logout(req, res) {
        const refreshToken = req.body.token;
        if(!refreshToken) return res.status(401).send('User not authorized');
        try {
            const decoded = jwt.verify(refreshToken, config.get('jwtRefreshKey'));
            if(!global.refreshTokenCache[decoded.name]) {
                return res.status(401).json({errors: [{msg: 'User not authorized'}]});
            }
            delete global.refreshTokenCache[decoded.name];
            req.session.destroy((error) => {
                if(error)  {
                    console.log(error.message);
                    return res.status(500).send('Server Error');
                }
                return res.send('Logged Out');
            })
        } catch(exception) {
            console.log(exception.message);
            return res.status(500).send('Server Error');
        }
    }
}

module.exports = new LogoutManagement();