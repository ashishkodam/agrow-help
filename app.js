

const express =  require('express');
const bodyParser =  require('body-parser');
const mySQL = require('mysql');



const app =  express();

const restApi =  require('./router/RestApi')
const connect  =  mySQL.createConnection({
    host:"localhost",
    user:'root',
    password:'',
    database: "agrow-help"
});


app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json()); 


app.use(express.static(__dirname + '/public/html'));
app.use('/css/style.css', express.static(__dirname + '/public/css/style.css'));
app.use('/js/main.js', express.static(__dirname + '/public/js/main.js'));




app.use('/api',restApi);

connect.connect((err) => {
    if (err) return err;
    console.log("Connected!");
   
 });
   

 app.listen(5000);