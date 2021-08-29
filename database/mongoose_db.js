'use strict';

const mongoose = require('mongoose');
const config = require('config');
const mongoDBUri = config.get('mongoDBUri');

const connectDB = async () => {
    try {
        await mongoose.connect(mongoDBUri, {useNewUrlParser: true, useUnifiedTopology: true});
        console.log('MongoDB Connected')
    } catch(error) {
        console.log(error.message);
        process.exit(1)
    }
}

module.exports = connectDB;