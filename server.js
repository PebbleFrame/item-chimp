var express = require('express');
var bodyParser = require('body-parser');
var browserify = require('browserify-middleware');
var reactify = require('reactify');
var nunjucks = require('nunjucks');
var config = require('./client/config');
var authRouter = require('./server/auth-routes');
var OperationHelper = require('apac').OperationHelper;
var request = require('request');

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

var authRouter = express.Router();
app.use('/auth', authRouter);
require('./server/auth-routes')(authRouter);

app.get('*', function(req, res) {
  res.render('index.html');
});


var opHelper = new OperationHelper({
  awsId:     'AKIAIQ27TFDH7YXONTJQ',
  awsSecret: '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',
  assocId:   'bap071-20',
  version:   '2013-08-01'});

app.post('/general-query', function(req, res) {

  var query = req.body.query;

  opHelper.execute('ItemSearch', {
    'SearchIndex': 'All',
    'Keywords': query,
    'ResponseGroup': 'ItemAttributes,Reviews,Images,ItemIds'
  }, function(err, results) { // you can add a third parameter for the raw xml response, "results" here are currently parsed using xml2js
    // console.log(results.ItemSearchResponse.Items[0].Item);

    var AmazonResultsToSend = results.ItemSearchResponse.Items[0].Item;
    console.log(AmazonResultsToSend);

    request({
        url: 'http://api.walmartlabs.com/v1/search?query=' + query + '&format=json&apiKey=va35uc9pw8cje38csxx7csk8',
        json: true
      }, function (error, response, walmartBody) {
        if (!error && response.statusCode == 200) {
          // console.log(body.items);

          var WalmartResultsToSend = walmartBody.items;



          request({
              url: 'http://api.remix.bestbuy.com/v1/products(name=' + query + '*)?show=name,sku,salePrice,customerReviewAverage,customerReviewCount,shortDescription,upc,image&format=json&apiKey=n34qnnunjqcb9387gthg8625',
              json: true
            }, function (error, response, bestbuyBody) {
              if (!error && response.statusCode == 200) {
                var BestbuyResultsToSend = bestbuyBody.products;

                res.send([
                  {walmart: WalmartResultsToSend},
                  {amazon: AmazonResultsToSend},
                  {bestbuy: BestbuyResultsToSend}
                ]);
              }
            }
          );

        }
      }
    );

  });

});

app.post('/specific-query', function(req, res) {
  var bestbuySKU = req.body.sku;
  // 'http://api.remix.bestbuy.com/v1/reviews(sku=1780275)?format=json&apiKey=n34qnnunjqcb9387gthg8625&show=id,sku,rating,title,comment,reviewer.name'

  var walmartId = req.body.itemId;
  // 'http://api.walmartlabs.com/v1/reviews/30135922?format=json&apiKey=va35uc9pw8cje38csxx7csk8'
});

var port = process.env.PORT || 3000;

app.listen(port, function() {
  console.log('Server listening on port ' + port);
});