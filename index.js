require('dotenv').config();
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const axios = require('axios');
const ejs = require('ejs');
const path = require('path');
const config = require('./config/config')
const app = express();
const PORT = process.env.PORT || 3001; //3105


app.set('view engine', 'ejs'); // Set EJS as the template engine
app.set('views', path.join(__dirname, './views')); // Set the views directory
app.use(express.urlencoded())
app.use(express.json())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(require("./router/router"))
app.use(require("./router/gatewayroute"))



app.listen(process.env.PORT || PORT, (req, res) => {
  console.log("http://" + config.DB_HOST + ":" + PORT);
})