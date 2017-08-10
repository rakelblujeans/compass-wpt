// TODO: Test different URLs

var WebPageTest = require('webpagetest');
var wpt = new WebPageTest('https://www.webpagetest.org/', 'A.5d516bf1ca465c213f41787574d5bb26');

console.log('Running test');
wpt.runTest('https://www.compass.com/search/sales/nyc/', {
  connectivity: 'Cable',
  location: 'Dulles:Chrome',
  firstViewOnly: false,
  runs: 1,
  video: true,
  // dryRun: true,
  pingback: 'https://compass-wpt.herokuapp.com/webpagetest'
}, function(err, result) {
  console.log(err || result);
});
