var WebPageTest = require('WebPageTest');
var wpt = new WebPageTest('https://www.webpagetest.org/',
    process.env.WPT_KEY_API || 'A.5d516bf1ca465c213f41787574d5bb26');

// console.log('Running test');
wpt.runTest('https://www.compass.com/search/sales/nyc/', {
  connectivity: 'Cable',
  location: 'Dulles:Chrome',
  firstViewOnly: false,
  runs: 1,
  video: true,
  dryRun: true,
  pingback: 'https://kpvvlghmsx.localtunnel.me/webpagetest'
  // pollResults: 5,
  // dryRun: 'true',
}, function(err, result) {
  console.log(err || result);
});
