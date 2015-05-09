var express = require('express');
var bodyParser = require('body-parser');
//var reactify = require('reactify');
var nunjucks = require('nunjucks');
var authRouter = require('./server/auth-routes');
//var OperationHelper = require('apac').OperationHelper;
var request = require('request');

var wmAPIKey = "va35uc9pw8cje38csxx7csk8";
var bbAPIKey = "n34qnnunjqcb9387gthg8625";

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


var walmartGeneralQuery = function(req, res, next){
  var query = req.body.query;
  request({
    url: 'http://api.walmartlabs.com/v1/search',
    qs: {
      query: query,
      format: 'json',
      apiKey: wmAPIKey
    },
    json: true
  },function (error, response, walmartBody) {
    if (!error && response.statusCode === 200) {
      req.walmartResults = walmartBody.items;
     next();
    }
  });
};

var bestbuyGeneralQuery =  function(req, res, next) {
  var query = req.body.query;
  request({
    url: 'http://api.remix.bestbuy.com/v1/products(name=' + query + '*)',
    qs: {
      show: [
        'name',
        'sku',
        'salePrice',
        'customerReviewAverage',
        'customerReviewCount',
        'shortDescription',
        'upc',
        'image'
      ].join(","),
    sort: 'bestSellingRank',
    format: 'json',
    apiKey: bbAPIKey
    },
    json: true
  }, function (error, response, bestbuyBody) {
    if (!error && response.statusCode === 200) {
      req.bestbuyResults = bestbuyBody.products;
      next();
    }
  });
};

app.post('/general-query', [walmartGeneralQuery,bestbuyGeneralQuery], function (req, res) {
  res.send([
  {walmart: req.walmartResults},
  {bestbuy: req.bestbuyResults}
  ]);
});

var walmartReviews = function(req, res, next){
  if (req.body.itemId) {
    req.itemId = req.body.itemId;
  }
  if (!req.itemId) {
    return next();
  }
  request({
      url: 'http://api.walmartlabs.com/v1/reviews/' + req.itemId,
      qs: {
        format: 'json',
        apiKey: wmAPIKey
      }
    }, function (error, response, walmartReviewBody) {
      if (!error && response.statusCode === 200) {
        req.walmartReviews = walmartReviewBody;
        req.upc = JSON.parse(req.walmartReviews).upc;
        next();
      } else {
        console.log(error);
        console.log("Response status code for walmartReviews: " + response.statusCode);
      }
    }
  );
};

var bestbuyUPCToSku = function(req, res, next){
  request({
      url: 'https://api.remix.bestbuy.com/v1/products(upc=' + req.upc + ')',
      qs: {
        format: 'json',
        apiKey: bbAPIKey,
        show: [
          'sku',
          'customerReviewAverage'
        ].join(",")
      }
    }, function (error, response, bestBuySkuBody) {
      if (!error && response.statusCode === 200) {
        var json = JSON.parse(bestBuySkuBody);
        if(json.products.length > 0) {
          req.sku = json.products[0].sku;
          req.customerReviewAverage = json.products[0].customerReviewAverage;
        }
        next();
      }
    }
  );
};

var bestbuyReviews = function(req, res, next){
  if (req.body.sku) {
    req.sku = req.body.sku;
  }
  if (!req.sku) {
    return next();
  }
  request({
      url: 'http://api.remix.bestbuy.com/v1/reviews(sku='+req.sku+')',
      qs: {
        format: 'json',
        apiKey: bbAPIKey,
        pageSize: 25,
        show: [
          'id',
          'sku',
          'rating',
          'title',
          'comment',
          'reviewer.name'
        ].join(",")
      }
    }, function (error, response, bestbuyReviewBody) {
      if (!error && response.statusCode === 200) {
        req.bestbuyReviews = bestbuyReviewBody;
      }
      next();
    }
  );
};


app.post('/get-walmart-reviews', [walmartReviews,bestbuyUPCToSku,bestbuyReviews], function (req, res) {
  var strJson = "";
  if(req.bestbuyReviews) {
    var json = JSON.parse(req.bestbuyReviews);
    json.customerReviewAverage = req.customerReviewAverage;
    strJson = JSON.stringify(json);
  }
  res.send([
    {
      walmartReviews: req.walmartReviews,
      bestbuyReviews: strJson
    }
  ]);
});

var bestbuySkuToUPC = function(req, res, next){
  request({
      url: 'https://api.remix.bestbuy.com/v1/products(sku='+req.sku+')',
      qs: {
        format: 'json',
        apiKey: bbAPIKey,
        show: [
          'upc',
          'customerReviewAverage'
        ].join(",")
      }
    }, function (error, response, bestbuyReviewBody) {
      if (!error && response.statusCode === 200) {
        var json = JSON.parse(bestbuyReviewBody);
        if(json.products.length>0) {
          req.upc = json.products[0].upc;
          req.customerReviewAverage = json.products[0].customerReviewAverage;
        }
        next();
      } else {
        console.log(error);
        console.log("Response status code for bestbuySkuToUPC: " + response.statusCode);
        next();
      }
    }
  );
};

var bestbuyUPCToItemId = function(req, res, next){
  if (req.upc) {
    request({
        url: 'http://api.walmartlabs.com/v1/items',
        qs: {
          format: 'json',
          apiKey: wmAPIKey,
          upc: req.upc
        }
      }, function (error, response, cb3Body) {
        if (!error && response.statusCode === 200) {
          var json = JSON.parse(cb3Body);
          if(json.items.length>0) {
            req.itemId = json.items[0].itemId;
            }
          next();
        } else {
          console.log(error);
          console.log("Response status code for bestbuyUPCToItemId: " + response.statusCode);
          next();
        }
      }
    );
  }
  else{
    next();
  }
 };

app.post('/get-bestbuy-reviews', [bestbuyReviews,bestbuySkuToUPC,bestbuyUPCToItemId,walmartReviews], function (req, res) {
  var strJson = "";
  if(req.bestbuyReviews.length>0) {
    var json = JSON.parse(req.bestbuyReviews);
    json.customerReviewAverage = req.customerReviewAverage;
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