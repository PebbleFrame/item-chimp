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

app.get('/', function(req, res) {
  res.render('index.html');
});


var walmartGeneralQuery = function(req, res,next){
  var query = req.body.query;
  request({
    url: 'http://api.walmartlabs.com/v1/search?query=' + query + '&format=json&apiKey=va35uc9pw8cje38csxx7csk8',
    json: true
  },function (error, response, walmartBody) {
    if (!error && response.statusCode == 200) {
      req.walmartResults = walmartBody.items;
     next();
    }
  });
};

var bestbuyGeneralQuery =  function(req, res,next) {
  var query = req.body.query;
  request({
    url: 'http://api.remix.bestbuy.com/v1/products(name=' + query + '*)?show=name,sku,salePrice,customerReviewAverage,customerReviewCount,shortDescription,upc,image&sort=bestSellingRank&format=json&apiKey=n34qnnunjqcb9387gthg8625',
    json: true
  }, function (error, response, bestbuyBody) {
    if (!error && response.statusCode == 200) {
      req.bestbuyResults = bestbuyBody.products;
      next();
    }
  });
};

app.post('/general-query', [walmartGeneralQuery,bestbuyGeneralQuery], function(req, res,next) {
  next();
}, function (req, res) {
  res.send([
  {walmart: req.walmartResults},
  {bestbuy: req.bestbuyResults}
  ]);
});

var bestBuySku = "";
var customerReviewAverage = '';

var walmartReviewsW = function(req, res,next){
  WalmartReviewstoSend = "";
  var itemId = req.body.itemId;
  request({
      url: 'http://api.walmartlabs.com/v1/reviews/' + itemId + '?format=json&apiKey=va35uc9pw8cje38csxx7csk8'
    }, function (error, response, walmartReviewBody) {
      if (!error && response.statusCode == 200) {
        req.walmartReviews = walmartReviewBody;
        var json = JSON.parse(walmartReviewBody);
        req.upc = (json.upc);
        next();
      }
    }
  );
};

var bestbuyUPCToSku = function(req, res,next){
  request({
      url: 'https://api.remix.bestbuy.com/v1/products(upc='+req.upc+')?format=json&apiKey=n34qnnunjqcb9387gthg8625&show=sku,upc,name,longDescription,customerReviewAverage'
    }, function (error, response, bestBuySkuBody) {
      if (!error && response.statusCode == 200) {
        var json = JSON.parse(bestBuySkuBody);
        if(json.products.length > 0) {
          req.bestBuySku = json.products[0].sku;
          req.customerReviewAverage = json.products[0].customerReviewAverage;
        }
        else {
          req.bestBuySku = undefined;
        }
        next();
      }
    }
  );
};

var bestbuyReviewsW = function(req, res,next){
  BestBuyReviewsToSend = "";
  if(bestBuySku !== undefined) {
    var bb = parseInt(bestBuySku);
    request({
        url: 'http://api.remix.bestbuy.com/v1/reviews(sku='+req.bestBuySku+')?format=json&apiKey=n34qnnunjqcb9387gthg8625&pageSize=25&show=id,sku,rating,title,comment,reviewer.name'
      }, function (error, response, bestbuyReviewBody) {
        if (!error && response.statusCode == 200) {
          req.bestbuyReviews = bestbuyReviewBody;
        }
        next();
      }
    );
  }
  else{
    next();
  }
};

app.post('/get-walmart-reviews', [walmartReviewsW,bestbuyUPCToSku,bestbuyReviewsW],function(req, res,next) {
  next();
}, function (req, res) {
  var strJson = "";
  if(req.bestbuyReviews) {
    var json = JSON.parse(req.bestbuyReviews);
    json.customerReviewAverage = req.customerReviewAverage;
    strJson = JSON.stringify(json);
  }
  res.send([
    {walmartReviews: req.walmartReviews,
    bestbuyReviews: strJson}
  ]);
});

var bestbuyReviews = function(req, res, next){
  request({
      url: 'http://api.remix.bestbuy.com/v1/reviews(sku=' + req.body.sku +')?format=json&apiKey=n34qnnunjqcb9387gthg8625&pageSize=25&show=id,sku,rating,title,comment,reviewer.name'
    }, function (error, response, bestbuyReviewBody) {
      if (!error && response.statusCode == 200) {
        req.bbReviews = bestbuyReviewBody;
        next();
      }
      else{
        next();
      }
    }
  );
};

var bestbuySkuToUPC = function(req, res, next){
  request({
      url: 'https://api.remix.bestbuy.com/v1/products(sku='+req.body.sku+')?format=json&apiKey=n34qnnunjqcb9387gthg8625&show=name,longDescription,upc,customerReviewAverage'
    }, function (error, response, bestbuyReviewBody) {
      if (!error && response.statusCode == 200) {
        var json = JSON.parse(bestbuyReviewBody);
        if(json.products.length>0) {
          req.bbUpc = json.products[0].upc;
          req.customerReviewAverage = json.products[0].customerReviewAverage;
        }
        else{
          req.bbUpc = undefined;
        }
        next();
      }
    }
  );
};

var bestbuyUPCToItemId = function(req, res,next){
  if(req.bbUpc !== undefined){
    request({
        url: 'http://api.walmartlabs.com/v1/items?apiKey=va35uc9pw8cje38csxx7csk8&upc='+req.bbUpc
      }, function (error, response, cb3Body) {
        if (!error && response.statusCode == 200) {
          var json = JSON.parse(cb3Body);
          if(json.items.length>0) {
            req.bbItemId = json.items[0].itemId;
            }
          else{
            req.bbItemId = undefined;
          }
          next();
        }
        else{
          req.bbItemId = undefined;
          next();
        }
      }
    );
  }
  else{
    req.bbItemId = undefined;
    next();
  }
 };

var walmartReviews = function(req, res,next){
  if(req.bbItemId !== undefined) {
    request({
        url: 'http://api.walmartlabs.com/v1/reviews/' + req.bbItemId + '?format=json&apiKey=va35uc9pw8cje38csxx7csk8'
      }, function (error, response, walmartReviewBody) {
        if (!error && response.statusCode == 200) {
           req.walmartReviews = walmartReviewBody;
          next();
        }
      }
    );
  }
  else{
    next();
  }
};

app.post('/get-bestbuy-reviews', [bestbuyReviews,bestbuySkuToUPC,bestbuyUPCToItemId,walmartReviews],function(req, res,next) {
  next();
}, function (req, res) {
  var strJson = "";
  if(req.bbReviews.length>0) {
    var json = JSON.parse(req.bbReviews);
    json.customerReviewAverage = customerReviewAverage;
     strJson = JSON.stringify(json);
  }
  res.send([
    {walmartReviews: req.walmartReviews,
      bestbuyReviews: strJson}
  ]);
});

app.get('*', function(req, res) {
  res.status(404)
     .send('Page not found!');
});

var port = process.env.PORT || 3000;

app.listen(port, function() {
  console.log('Server listening on port ' + port);
});

exports = module.exports = app;