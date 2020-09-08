const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const routes = require('./routes/api');


mongoose.connect("mongodb://127.0.0.1:27017/maxads", { useNewUrlParser: true, useUnifiedTopology: true, })
    .then(() => console.log("Connected to DB"))
    .catch((error) => console.error(error));


const app = express();

// Load routes
app.use('/content', express.static(path.join(__dirname, 'content')));
app.use('/api', routes);

module.exports = app;