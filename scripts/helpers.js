var https = require('https');

function storeTestResults(result, req) {
  var resultFV = result.average.firstView;

  var collection = req.db.collection('results');
  collection.insert({
    testId: result.id,
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
      waterfallView: result.runs[1].firstView.images.waterfall,
      connectionView: result.runs[1].firstView.images.connectionView,
    }
  });

  // console.log('Test results stored for test ID: result.testId');
}

// Get the result results in json format
function fetchTestResults(testId, req, res) {
  // console('Looking up test results...');
  const testResultsUrl = `https://www.webpagetest.org/jsonResult.php?test=${testId}`;
  https.get(testResultsUrl, function(res) {
    var body = '';
    res.setEncoding('utf8');
    res.on('data', function (d) {
      body += d;
    });
    res.on('end', function() {
      storeTestResults(JSON.parse(body).data, req);
    });
  }).on('error', function(e) {
    res.send("Got error: " + e.message);
    // console.log("Got error: " + e.message);
  });
}

function fetchAllData() {
  MongoClient.connect(MONGO_URL, function (err, db) {
    if (err) {
      throw err;
    }

  });
}

module.exports = {
  fetchTestResults: fetchTestResults,
  fetchAllData: fetchAllData,
};
