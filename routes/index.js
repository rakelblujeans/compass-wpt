var express = require('express');
var router = express.Router();
var helpers = require('../scripts/helpers')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/webpagetest', function(req, res, next) {
  // const testId = req.query.id;
  // res.status(200).send(`Got results! ${req.query.id}`)
  helpers.lookUpTestResults(req.query.id);
});

module.exports = router;

