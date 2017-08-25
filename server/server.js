var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
require('./models/shorturl.js');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/shorturl', {useMongoClient: true});

var app = express();
app.engine('.html', require('ejs').__express);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.use(bodyParser());

require('./routes')(app);
app.listen(1754);