const express = require("express");
const bodyParser = require("body-parser");

const app = express();

// https://stackoverflow.com/a/66820098/3057066
app.use(bodyParser.json());

require('./db');
require('./models/relations');

module.exports = app;
