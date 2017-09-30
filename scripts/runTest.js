var WebPageTest = require('webpagetest');
var wpt = new WebPageTest('https://www.webpagetest.org/', 'A.5d516bf1ca465c213f41787574d5bb26');

console.log('Running test');

// We fake logging in by just using a copied session variable
// 'https://www.compass.com/workspace/#/collections',
const loginSteps = wpt.scriptToString([
  {
    setCookie: [
      'https://www.compass.com',
      'session=R0MFqaJJOsWKHk+0Rxv41hdMz2Y=?_fresh=STAwCi4=&_id=UydjMDk5ZjljNWUwMTUyNjYzZDE0ZDAyMmMwZWEzN2I2YicKcDEKLg==&user_id=Uyc1OGM5ZjJjZTQxYWE2NTQ1YTgyZmYxZWMnCnAxCi4='
    ]
  },
]);

const options = {
  connectivity: 'Cable',
  location: 'Dulles:Chrome',
  firstViewOnly: true,
  runs: 1,
  video: true,
  pingback: 'https://compass-wpt.herokuapp.com/webpagetest'
};

const testRuns = [
  {
    url: 'https://www.compass.com/search/sales/nyc/',
    label: 'Consumer Search NYC - Anonymous',
    login: false,
  },
  {
    url: 'https://www.compass.com/search/sales/nyc/',
    label: 'Consumer Search NYC - Logged In',
    login: true,
  },
];

testRuns.forEach((test) => {
  const loginScript = Object.assign(loginSteps, {navigate: test.url});
  const navigateSteps = test.login ? loginScript : test.url;

  wpt.runTest(
    navigateSteps,
    Object.assign(options, {
      label: test.label,
    }),
    function(err, result) {
      console.log(err || result);
    });
});
