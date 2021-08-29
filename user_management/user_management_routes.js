'use strict';

/**
 * User Management Route API's
 */
const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();
const UserManagement = require('./user_managment');
const {check, oneOf} = require('express-validator');

router.post('/register', [
    check('name', 'Name is required').not().isEmpty(),
    check('password', 'Please enter password with 6 or more characters').isLength({min: 6}),
    check('contact', 'Contact is required').not().isEmpty(),
    check('gender', 'Gender is required').not().isEmpty(),
    check('country', 'Country is required').not().isEmpty(),
    check('address', 'Address is required').not().isEmpty()
], 
UserManagement.register);

router.post('/search', [
    oneOf([
        check('name', 'Name is required').not().isEmpty(),
        check('contact', 'Contact is required').not().isEmpty()
    ])
],
UserManagement.searchUsers);



module.exports = router;