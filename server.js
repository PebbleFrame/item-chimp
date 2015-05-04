var express = require('express');
var bodyParser = require('body-parser');
var reactify = require('reactify');
var nunjucks = require('nunjucks');
var authRouter = require('./server/auth-routes');
var OperationHelper = require('apac').OperationHelper;
var request = require('request');

var app = express();
app.use(express.static('public'));
app.use(bodyParser());

nunjucks.configure('server/templates/views', {
  express: app
});

var authRouter = express.Router();
app.use('/auth', authRouter);
require('./server/auth-routes')(authRouter);

app.get('*', function(req, res) {
  res.render('index.html');
});

var WalmartResultsToSend = "";
var BestbuyResultsToSend = "";

var walmartGeneralQuery = function(req, res,next){
  var query = req.body.query;
  request({
    url: 'http://api.walmartlabs.com/v1/search?query=' + query + '&format=json&apiKey=va35uc9pw8cje38csxx7csk8',
    json: true
  },function (error, response, walmartBody) {
    if (!error && response.statusCode == 200) {
      WalmartResultsToSend = walmartBody.items;
     next();
    }
  });
}

var bestbuyGeneralQuery =  function(req, res,next) {
  var query = req.body.query;
  request({
    url: 'http://api.remix.bestbuy.com/v1/products(name=' + query + '*)?show=name,sku,salePrice,customerReviewAverage,customerReviewCount,shortDescription,upc,image&sort=bestSellingRank&format=json&apiKey=n34qnnunjqcb9387gthg8625',
    json: true
  }, function (error, response, bestbuyBody) {
    if (!error && response.statusCode == 200) {
      BestbuyResultsToSend = bestbuyBody.products;
      next();
    }
  });
}

app.post('/general-query', [walmartGeneralQuery,bestbuyGeneralQuery], function(req, res,next) {
  next();
}, function (req, res) {
  res.send([
  {walmart: WalmartResultsToSend},
  {bestbuy: BestbuyResultsToSend}
  ]);
});

app.post('/get-walmart-reviews', function(req, res) {
  var itemId = req.body.itemId;
  // 'http://api.walmartlabs.com/v1/reviews/30135922?format=json&apiKey=va35uc9pw8cje38csxx7csk8'
  request({
      url: 'http://api.walmartlabs.com/v1/reviews/' + itemId + '?format=json&apiKey=va35uc9pw8cje38csxx7csk8'
    }, function (error, response, walmartReviewBody) {
      if (!error && response.statusCode == 200) {
        var WalmartReviewstoSend = walmartReviewBody;
        console.log(WalmartReviewstoSend);
        res.send([
          {walmartReviews: WalmartReviewstoSend}
        ]);
      }
    }
  );
});


app.post('/get-bestbuy-reviews', function(req, res) {
  var itemId = req.body.sku;
// 'http://api.remix.bestbuy.com/v1/reviews(sku=1780275)?format=json&apiKey=n34qnnunjqcb9387gthg8625&show=id,sku,rating,title,comment,reviewer.name'
  request({
      url: 'http://api.remix.bestbuy.com/v1/reviews(sku=' + itemId +')?format=json&apiKey=n34qnnunjqcb9387gthg8625&show=id,sku,rating,title,comment,reviewer.name'
    }, function (error, response, bestbuyReviewBody) {
      if (!error && response.statusCode == 200) {
        var BestBuyReviewsToSend = bestbuyReviewBody;
        res.send([
          {bestbuyReviews: BestBuyReviewsToSend}
        ]);
      }
    }
  );
});

var port = process.env.PORT || 3000;

app.listen(port, function() {
  console.log('Server listening on port ' + port);
});