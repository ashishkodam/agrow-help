

const express = require('express');
const mongodb = require('mongodb');
const bodyParser = require('body-parser');
//const mySQL = require('mysql');
// const PORT = process.env.PORT || 5000;
const mongoose = require('mongoose')

const app = express();


const usersRouter = require('./router/user-router');
const cropsRouter = require('./router/crops-router');
const fourmRouter = require('./router/fourm-router');
const machineRouter = require('./router/machine-router');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use(express.static(__dirname + '/public/html'));
app.use('/css/style.css', express.static(__dirname + '/public/css/style.css'));
app.use('/js/main.js', express.static(__dirname + '/public/js/main.js'));




app.use('/api/users', usersRouter);
app.use('/api/crops', cropsRouter);
app.use('/api/forum', fourmRouter);
app.use('/api/tools', machineRouter);



mongoose
    .connect('mongodb+srv://hccproject:hccproject@cluster0.8yyn2.mongodb.net/agrowhelp' )
    .then(() =>{
        app.listen(process.env.PORT || 5000);
    })
    .catch(err => {
        console.log(err)
    });