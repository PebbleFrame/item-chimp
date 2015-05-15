var express = require('express');
var bodyParser = require('body-parser');
//var reactify = require('reactify');
var nunjucks = require('nunjucks');
var authRouter = require('./server/auth-routes');
//var OperationHelper = require('apac').OperationHelper;
var request = require('request');
var apiConfig = require('./apiConfig.js');
var fs = require('fs');
var db = require('./server/db/db.js');

// Log any unhandled errors
process.on('uncaughtException', function(err){
  fs.appendFile(__dirname + '/server/server.log', new Date() + '  |  ' + err + '\n');
});

var wmAPIKey = apiConfig.walMartKey;
var bbAPIKey = apiConfig.bestBuyKey;

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

// Calls Walmart API for a product keyword search
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

// Calls Best Buy API for a product keyword search
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

// Handle request from client for keyword search
// Hits both Walmart and Best Buy APIs and returns search results
app.post('/general-query', [walmartGeneralQuery,bestbuyGeneralQuery], function (req, res) {
  res.send([
  {walmart: req.walmartResults},
  {bestbuy: req.bestbuyResults}
  ]);
});

// Calls Walmart API for reviews of product whose itemID is equal to
// req.body.itemId (if called directly by clicking on a Walmart product)
// or req.itemId (if called after user has clicked on a Best Buy product
//     and server is looking for identical item at Walmart)
var walmartReviews = function(req, res, next){
  // If call is coming from get-walmart-reviews, itemId will be in req.body
  // If call is coming from get-bestbuy-reviews, a previous middleware function
  // will have put the itemId in req.itemId.
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
        // pass upc to next function by storing it on req
        req.upc = JSON.parse(req.walmartReviews).upc;
        next();
      } else {
        console.log(error);
        console.log("Response status code for walmartReviews: " + response.statusCode);
      }
    }
  );
};

// Calls Best Buy PRODUCTS API to convert UPC (universal) to SKU (Best Buy internal tracking #)
// We need to use this in the Best Buy REVIEWS API call later because the Reviews API doesn't
// accept UPC as a search param, but does accept SKU.
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
          // pass sku and customerReviewAverage to next function by storing it in req
          req.sku = json.products[0].sku;
          req.customerReviewAverage = json.products[0].customerReviewAverage;
        }
        next();
      }
    }
  );
};

// Calls Best Buy REVIEWS API for reviews of product whose itemID is equal to
// req.body.sku (if called directly by clicking on a Best Buy product)
// or req.sku (if called after user has clicked on a Walmart product
//     and server is looking for identical item at Best Buy)
var bestbuyReviews = function(req, res, next){
  // If call is coming from get-walmart-reviews, sku will be in req.body
  // If call is coming from get-bestbuy-reviews, a previous middleware function
  // will have put the sku in req.sku.
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

// Calls Best Buy PRODUCTS API to convert SKU (Best Buy internal tracking #) to UPC (universal)
// We need UPC to check if Walmart has identical item, since Walmart obviously does not recognize
// Best Buy SKUs.
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
          // Pass upc and customerReviewAverage onto following middleware functions
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

var itemchimpReviews = function(req, res, next) {
  // If call is coming from get-itemchimp-reviews, upc will be in req.body
  // If call is coming from get-bestbuy-reviews or get-walmart-reviews, a previous middleware function
  // will have put the upc in req.upc.
  if (req.body.upc) {
    req.upc = req.body.upc;
  }
  if (req.upc) {
    return next();
  }
  db.Review.forge({upc: req.upc}).fetch()
    .then(function(reviews) {
      console.log(reviews);
      var itemchimpReviewBody = {};
      itemchimpReviewBody.reviews = reviews;
      itemchimpReviewBody.total = reviews.length;
      if (reviews.length > 0) {
        var sumRatings = 0;
        for(i = 0; i < reviews.length; i++) {
          sumRatings += reviews[i].rating;
        }
        itemchimpReviewBody.customerReviewAverage = sumRatings/reviews.length;
      } else {
        itemchimpReviewBody.customerReviewAverage = undefined;
      }
      req.itemchimpReviews = JSON.stringify(itemchimpReviewBody);
      next();
    });
  
}

// Handles call from client to get reviews for an item the user clicks on
// in the Walmart search results column.
// Gets the Walmart reviews first, then checks to see if there is an identical
// item at Best Buy, and gets those reviews if so.
app.post('/get-walmart-reviews', [walmartReviews,bestbuyUPCToSku,bestbuyReviews,bestbuySkuToUPC,itemchimpReviews], function (req, res) {
  if(req.bestbuyReviews) {
    // convert req.bestbuyReviews to obj so we can add customerReviewAverage property to it
    // then re stringify it
    var json = JSON.parse(req.bestbuyReviews);
    json.customerReviewAverage = req.customerReviewAverage;
    req.bestbuyReviews = JSON.stringify(json);
  }
  res.send([
    {
      walmartReviews: req.walmartReviews,
      bestbuyReviews: req.bestbuyReviews,
      itemchimpReviews: req.itemchimpReviews
    }
  ]);
});



// Calls Walmart API to convert UPC to itemID (Walmart's internal tracking #)
// We need itemID to look up Walmart reviews for that item, because Walmart's
// reviews API doesn't recognize UPC as a search term.
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
            // pass itemId to following middleware functions
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

// Handles call from client to get reviews for an item the user clicks on
// in the Best Buy search results column.
// Gets the Best Buy reviews first, then checks to see if there is an identical
// item at Walmart, and gets those reviews if so.
app.post('/get-bestbuy-reviews', [bestbuyReviews,bestbuySkuToUPC,itemchimpReviews,bestbuyUPCToItemId,walmartReviews], function (req, res) {
  if(req.bestbuyReviews.length>0) {
    // convert req.bestbuyReviews to obj so we can add customerReviewAverage property to it
    // then re stringify it
    var json = JSON.parse(req.bestbuyReviews);
    json.customerReviewAverage = req.customerReviewAverage;
    req.bestbuyReviews = JSON.stringify(json);
  }
  res.send([
    {walmartReviews: req.walmartReviews,
      bestbuyReviews: req.bestbuyReviews,
      itemchimpReviews: req.itemchimpReviews}
  ]);
});



app.post('/get-itemchimp-reviews', [itemchimpReviews, bestbuyUPCToItemId, walmartReviews, bestbuyUPCToSku,bestbuyReviews], function(req, res) {
  if(req.bestbuyReviews) {
    // convert req.bestbuyReviews to obj so we can add customerReviewAverage property to it
    // then re stringify it
    var json = JSON.parse(req.bestbuyReviews);
    json.customerReviewAverage = req.customerReviewAverage;
    req.bestbuyReviews = JSON.stringify(json);
  }
  res.send([
    {walmartReviews: req.walmartReviews,
     bestbuyReviews: req.bestbuyReviews,
     itemchimpReviews: req.itemchimpReviews}
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
