var express = require('express');
var bodyParser = require('body-parser');
var browserify = require('browserify-middleware');
var reactify = require('reactify');
var nunjucks = require('nunjucks');
var config = require('./client/config');


var app = express();
app.use(express.static('public'));
app.use(bodyParser());

nunjucks.configure('server/templates/views', {
  express: app
});

app.get('/js/' + config.common.bundle, browserify(config.common.packages, {
  cache: true,
  precompile: true
}));

app.use('/js', browserify('./client/scripts', {
  external: config.common.packages,
  transform: ['reactify']
}));

app.get('*', function(req, res) {
  res.render('index.html');
});

var OperationHelper = require('apac').OperationHelper;

var opHelper = new OperationHelper({
  awsId:     'AKIAIQ27TFDH7YXONTJQ',
  awsSecret: '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',
  assocId:   'bap071-20',
  version:   '2013-08-01'});




app.post('/general-query', function(req, res) {

  var query = req.body.query;
  
  opHelper.execute('ItemSearch', {
    'SearchIndex': 'Books',
    'Keywords': 'harry potter',
    'ResponseGroup': 'ItemAttributes,Offers'
  }, function(err, results) { // you can add a third parameter for the raw xml response, "results" here are currently parsed using xml2js
    console.log(results.ItemSearchResponse.Items[0].Item);
    var resultsToSend = results.ItemSearchResponse.Items[0].Item;
    res.send([
      {walmart: []},
      {amazon: resultsToSend},
      {bestbuy: []}
    ]);
  });

});

var port = process.env.PORT || 3000;

app.listen(port, function() {
  console.log('Server listening on port ' + port);
});