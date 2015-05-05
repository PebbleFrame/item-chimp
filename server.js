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

var upc = "";
var WalmartReviewstoSend = "";
var BestBuyReviewsToSend = "";
var bestBuySku = "";
//{walmart: WalmartResultsToSend},
//{bestbuy: BestbuyResultsToSend}

var walmartReviews = function(req, res,next){
 // console.log("in walmart Reviews");
  WalmartReviewstoSend = "";
  var itemId = req.body.itemId;
  // 'http://api.walmartlabs.com/v1/reviews/30135922?format=json&apiKey=va35uc9pw8cje38csxx7csk8'
  request({
      url: 'http://api.walmartlabs.com/v1/reviews/' + itemId + '?format=json&apiKey=va35uc9pw8cje38csxx7csk8'
    }, function (error, response, walmartReviewBody) {
      if (!error && response.statusCode == 200) {
        WalmartReviewstoSend = walmartReviewBody;
  //      console.log(WalmartReviewstoSend);
        var json = JSON.parse(WalmartReviewstoSend);
        upc = (json["upc"]);
//        console.log("upc is "+upc);
        next();
      }
    }
  );
}

var bestbuyUPCToSku = function(req, res,next){
//  console.log("in bestbuyUPCToSku Reviews");
  bestBuySku = "";
//  https://api.remix.bestbuy.com/v1/products(upc=013803129113)?format=json&apiKey=n34qnnunjqcb9387gthg8625&show=sku,upc,name,longDescription
  request({
      url: 'https://api.remix.bestbuy.com/v1/products(upc='+upc+')?format=json&apiKey=n34qnnunjqcb9387gthg8625&show=sku,upc,name,longDescription'
    }, function (error, response, bestBuySkuBody) {
      if (!error && response.statusCode == 200) {
        var json = JSON.parse(bestBuySkuBody);
  //      console.log(bestBuySkuBody);
        var len = json["products"].length;
        if(len>0) {
            bestBuySku = json["products"][0].sku;
//        console.log("sku is "+bestBuySku);
        }
        else{
          bestBuySku =undefined;
        }
        next();
      }
    }
  );
}

var bestbuyReviews = function(req, res,next){
  BestBuyReviewsToSend ="";
  if(bestBuySku !== undefined) {
//    console.log("insideBB");
//    console.log(bestBuySku);
    var bb = parseInt(bestBuySku);
    request({
        url: 'http://api.remix.bestbuy.com/v1/reviews(sku='+bestBuySku+')?format=json&apiKey=n34qnnunjqcb9387gthg8625&show=id,sku,rating,title,comment,reviewer.name'
      }, function (error, response, bestbuyReviewBody) {
 //       console.log("url:"+this.url);
        if (!error && response.statusCode == 200) {
          BestBuyReviewsToSend = bestbuyReviewBody;
//          console.log(BestBuyReviewsToSend);
        }
        next();
      }
    );
  }
//  console.log(BestBuyReviewsToSend);
}

app.post('/get-walmart-reviews', [walmartReviews,bestbuyUPCToSku,bestbuyReviews],function(req, res,next) {
  next();
}, function (req, res) {
  res.send([
    {walmartReviews: WalmartReviewstoSend,
    bestbuyReviews: BestBuyReviewsToSend}
  ]);
});


/*app.post('/get-walmart-reviews', function(req, res) {
  var itemId = req.body.itemId;
  // 'http://api.walmartlabs.com/v1/reviews/30135922?format=json&apiKey=va35uc9pw8cje38csxx7csk8'
  request({
      url: 'http://api.walmartlabs.com/v1/reviews/' + itemId + '?format=json&apiKey=va35uc9pw8cje38csxx7csk8'
    }, function (error, response, walmartReviewBody) {
      if (!error && response.statusCode == 200) {
        var WalmartReviewstoSend = walmartReviewBody;
        console.log(WalmartReviewstoSend);
        var json = JSON.parse(WalmartReviewstoSend);
        upc = (json["upc"]);
        console.log("upc is "+upc);
        res.send([
          {walmartReviews: WalmartReviewstoSend}
        ]);
      }
    }
  );
});
*/

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