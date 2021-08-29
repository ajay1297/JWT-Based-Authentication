'use strict';

const express = require('express');
const { v4: uuidv4 } = require('uuid');
const connectDB = require('./database/mongoose_db');
const session = require('express-session');
const MongoDBSession = require('connect-mongodb-session')(session);
const config = require('config');
const UserManagment = require('./user_management/user_management_routes');
const LoginManagement = require('./login_managment/login_management_routes');
const LogoutManagement = require('./logout_management/logout_management_routes');
const app = express();

connectDB();

app.use(express.json());
app.use(express.urlencoded({extended: false}));

global.refreshTokenCache = {};

const store = new MongoDBSession({
    uri: config.get('mongoDBUri'),
    collection: 'sessions'
});

app.use(session({
    genid: (req) => {
        return uuidv4();
    },
    secret: config.get('sessionSecretKey'),
    saveUninitialized: true,
    resave: false,
    store: store
}));

app.use('/api/login', LoginManagement);
app.use('/api/user', UserManagment);
app.use('/api/logout', LogoutManagement);

app.get('*', (req, res) => {
    res.send('Invalid Route');
})

const PORT = process.env.PORT || config.get('port');

app.listen(PORT, () => {
    console.log(`App listening on ${PORT}`);
})