/* MAIN FILE OF THE SERVER */

/* import packages */
var mongodb = require('mongodb');
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

/* define models */
var User = require('./models/user');
var Posting = require('./models/posting');
var Feedphoto = require('./models/feedphoto');
const user = require('./models/user');

/* Create express service */
var app = express();

/* To extract the parameter from the POST request data's body */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/* Variable for connection to mongodb */
var MongoClient = mongodb.MongoClient;
var mongo_url = 'mongodb://localhost:27017/project2';

/* Confure router model */
var router = require('./routes')(app, User, Posting, Feedphoto)

/* Create WEB SERVER*/
var server = app.listen(80, function () {
    console.log("Express server has started on port 80")
});

/* Connect to the database using mongoose */
var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function () {
    console.log("Connected to mongod server");
});


mongoose.set('useUnifiedTopology', true);
mongoose.connect(mongo_url, { useNewUrlParser: true });

