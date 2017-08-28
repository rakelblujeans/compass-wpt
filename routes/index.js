var express = require('express');
var router = express.Router();
var app = require('../app');

var helpers = require('../scripts/helpers')

router.get('/', function(req, res, next) {
  res.send('Welcome! Why don\'t you run a test by hitting /webpagetest');
});

router.get('/webpagetest', function(req, res, next) {
  helpers.fetchTestResults(req.query.id, req, res);
});

// TODO: take URL as param
router.get('/charts', function(req, res, next) {
  const cursor = req.db.collection('results').find({
    "url": "https://www.compass.com/search/sales/nyc/"
  }).sort({
    "timestamp": 1 // asc
  });
  cursor.toArray().then((records) => {
    res.send(records);
  });
});

module.exports = router;

