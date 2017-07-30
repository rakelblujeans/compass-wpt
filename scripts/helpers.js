var https = require('https');
var MongoClient = require('mongodb').MongoClient;
var MONGO_URL = process.env.MONGODB_URI || 'mongodb://localhost:27017/wpt';

// var WebPageTest = require('WebPageTest');
// var wpt = new WebPageTest('https://www.webpagetest.org/', 'A.5d516bf1ca465c213f41787574d5bb26');

// function runTestAcknowledgement(err, result) {
//   console(err || result);
//   // Response looks like
//   // {
//   //   url: 'https://www.webpagetest.org/runtest.php?url=https%3A%2F%2Fwww.compass.com%2Fsearch%2Fsales%2Fnyc%2F&location=Dulles%3AChrome.Cable&connectivity=Cable&runs=1&video=1&pingback=https%3A%2F%2Fkpvvlghmsx.localtunnel.me%2Fwebpagetest&f=json&k=A.5d516bf1ca465c213f41787574d5bb26'
//   // }
// }

// console.log('Running test');
// wpt.runTest('https://www.compass.com/search/sales/nyc/', {
//   connectivity: 'Cable',
//   location: 'Dulles:Chrome',
//   firstViewOnly: false,
//   runs: 1,
//   video: true,
//   dryRun: true,
//   pingback: 'https://kpvvlghmsx.localtunnel.me/webpagetest'
//   // pollResults: 5,
//   //
//   // dryRun: 'true',
// }, processTestResults)
// Response:
// {
//   "statusCode": 200,
//   "statusText": "Ok",
//   "data": {
//     "testId": "160814_W7_960",
//     "ownerKey": "ad50468e0d69d1e6d0cda22f38d7511cc4284e40",
//     "jsonUrl": "https://www.webpagetest.org/jsonResult.php?test=160814_W7_960",
//     "xmlUrl": "https://www.webpagetest.org/xmlResult/160814_W7_960/",
//     "userUrl": "https://www.webpagetest.org/result/160814_W7_960/",
//     "summaryCSV": "https://www.webpagetest.org/result/160814_W7_960/page_data.csv",
//     "detailCSV": "https://www.webpagetest.org/result/160814_W7_960/requests.csv"
//   }
// }
// wpt.getTestStatus('170730_AW_1368', function processTestStatus(err, result) {
//   console.log(err || result)
// })
// Once the test is complete, you get this response:
// {
//   "statusCode": 200,
//   "statusText": "Test Complete"
// }
// Then you can fetch results
//  wpt.getTestResults('170730_YF_12QJ', function processTestResult(err, result) {
//   console.log(err || result)
// })

function storeTestResults(result) {
  // console.log(result);
  var resultFV = result.average.firstView;
  return;

  MongoClient.connect(MONGO_URL, function (err, db) {
    if (err) {
      throw err;
    }

    var collection = db.collection('results');
    collection.insert({
      testId: result.testId,
      url: result.url,
      summary: result.summary,
      firstView: {
        loadTime: resultFV.loadTime,
        ttfb: resultFV.TTFB,
        render: resultFV.render,
        SpeedIndex: resultFV.SpeedIndex,
        domElements: resultFV.domElements,
        docDompleteRequests: resultFV.requestsDoc,
        docDompleteBytesIn: resultFV.bytesInDoc,
        fullyLoadedTime: resultFV.fullyLoaded,
        fullyLoadedRequests: resultFV.requestsFull,
        fullyLoadedBytesIn: resultFV.bytesIn,
        waterfallView: runs[1].firstView.images.waterfall,
        connectionView: runs[1].firstView.images.connectionView,
      }
    });

    db.close();
    console.log('Test results stored for test ID: result.testId');
  });
}

// Get the result results in json format
function lookUpTestResults(testId) {
  const testResultsUrl = `https://www.webpagetest.org/jsonResult.php?test=${testId}`;
  https.get(testResultsUrl, function(res) {
    var body = '';
    res.setEncoding('utf8');
    res.on('data', function (d) {
      body += d;
    });
    res.on('end', function() {
      storeTestResults(JSON.parse(body).data);
    });
  }).on('error', function(e) {
    console.log("Got error: " + e.message);
  });
}

module.exports = {
  lookUpTestResults: lookUpTestResults,
};
