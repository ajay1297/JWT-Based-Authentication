'use strict';

const express = require('express');
const {check} = require('express-validator');
const router = express.Router();
const LoginManagement = require('./login_managment');
const auth = require('../middleware/auth');

router.post('/',[
    check('name', 'Name is required').not().isEmpty(),
    check('password', 'Password is required').not().isEmpty()
],
LoginManagement.login);


router.post('/refreshToken', LoginManagement.generateToken);

router.post('/verifyAuthtoken', auth, (req, res) => {
    const name = req.session.user;
    res.send(`Welcome to the Home Page Mr. ${name}.`);
});


module.exports = router;