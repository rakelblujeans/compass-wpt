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

// Clients can search by
// - test label (i.e., test category)
// - start date ('from')
// - end date ('to')
router.get('/charts', function(req, res, next) {
  let filter = {};
  console.log('QUERY', req.query);
  if (!req.query || !req.query.label ||
      req.query.label === 'Consumer Search NYC - Anonymous') {
    filter.url = 'https://www.compass.com/search/sales/nyc/';
  } else {
    filter.label = req.query.label;
  }

  filter.timestamp = {
    '$gt': req.query.from,
    '$lte': req.query.to,
  };

  const cursor = req.db.collection('results').find(filter)
    .sort({
      "timestamp": 1 // asc
    });
  cursor.toArray().then((records) => {
    res.send(records);
  });
});

module.exports = router;

