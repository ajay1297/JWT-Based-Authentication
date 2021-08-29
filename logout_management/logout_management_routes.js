'use strict';

const express = require('express');
const router = express.Router();
const LoginManagement = require('./logout_management');

router.post('/', LoginManagement.logout);

module.exports = router;