require("dotenv").config()
const express = require("express")
const app = express()
const client= require ('./db/client')
const cors =require('cors')

client.connect();

app.use(cors())
const morgan = require('morgan');
app.use(morgan('dev'));

app.use(express.json())


const apiRouter = require('./api');
app.use('/api', apiRouter);

app.use((req, res, next) => {
    console.log("<____Body Logger START____>");
    console.log(req.body);
    console.log("<_____Body Logger END_____>");
    
    next();
  });

  

// Setup your Middleware and API Router here

module.exports = app;
