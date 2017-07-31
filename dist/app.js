'use strict';

var express = require('express');
var router = express.Router();
var path = require('path');
var cors = require('cors');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cons = require('consolidate');
var MongoClient = require('mongodb').MongoClient;
var MONGO_URL = 'mongodb://compass:x3gBuKbVPaBYMDgyDgPQ@ds127963.mlab.com:27963/wpt';
// 'mongodb://localhost:27017/wpt';
var index = require('../routes/index');

var app = express();

// view engine setup
app.engine('html', cons.swig);
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var database;
MongoClient.connect(MONGO_URL, function (err, db) {
  if (err) {
    throw err;
  }

  database = db;
  // Make our db accessible to our router
  app.use(function (req, res, next) {
    req.db = db;
    next();
  });

  app.use(cors());
  app.use('/', index);

  // 404 - Page not found
  app.use(function (req, res, next) {
    res.status(404).send("Sorry can't find that!");
  });

  // 500 - Unspecified server error
  app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });

  app.listen(process.env.PORT || 8080, function () {
    console.log('Example app listening on port ' + (process.env.PORT || 8080) + '!');
  });
});

module.exports = app;