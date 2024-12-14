const express = require("express");
require('dotenv').config();
const mongoose = require("mongoose");
const cors = require(`cors`)
const PORT = process.env.PORT || 3000;
const routes = {
    admin: require('./routes/admin'),
    api: require('./routes/api'),
    main: require('./routes/main')
};

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("Connected to MongoDB");
    })

express()
    .use(express.static("public"))
    .use(express.urlencoded({ extended: true }))
    .use(express.json())
    .use('/admin',routes.admin)
    .use('/api', routes.api)
    .use('/', routes.main)
    .listen(PORT, () => {
        console.log(`Listening on port ${PORT}`);
    })