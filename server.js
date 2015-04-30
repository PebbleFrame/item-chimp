var express = require('express');
var browserify = require('browserify-middleware');
var reactify = require('reactify');
var nunjucks = require('nunjucks');
var config = require('./client/config');

var app = express();

nunjucks.configure('server/templates/views', {
  express: app
});

app.use(express.static('public'));

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

app.post('/general-query', function(req, res) {
  res.send([
    {walmart:
      [
        {"itemId":30135922 ,"parentItemId":30135922,"name":"Apple iPod touch 32GB","msrp":249,"salePrice":229,"upc":"885909827367","categoryPath":"Electronics/iPods & MP3 Players/Apple iPods"},
        {"itemId":21805444,"parentItemId":21805444,"name":"Apple iPod nano 16GB","msrp":145,"salePrice":145,"upc":"885909564910","categoryPath":"Electronics/iPods & MP3 Players/All MP3 Players"}
      ]},
    {amazon:
      [
        {"Items": {
          "Request": {
          "IsValid": "True",
          "ItemLookupRequest": { "ItemId": "B00008OE6I" }
        },
        "Item": {
          "ASIN": "B00008OE6I",
          "ItemAttributes": {
            "Manufacturer": "Canon",
            "ProductGroup": "Photography",
            "Title": "Canon PowerShot S400 4MP Digital Camera w/ 3x Optical Zoom"
          }
        }
      }
    }]
    },
    {bestbuy:
      [
        {"products": [
          {
            "name": "Apple iPad mini Wi-Fi 16GB (Space Gray), Screen Protector, Keyboard, Stylus, Audio Cable & Headphones Package",
            "sku": 9999240600050019,
            "salePrice": 334.99
          },
          {
            "name": "Apple® - iPad Air 2 Wi-Fi + Cellular 16GB - Silver",
            "sku": 3781019,
            "salePrice": 499.99
          },
          {
            "name": "Apple® - iPad Air 2 Wi-Fi 16GB - Gold",
            "sku": 2881031,
            "salePrice": 499.99
          }
      ] }
    ]}
  ]);
});

var port = process.env.PORT || 3000;

app.listen(port, function() {
  console.log('Server listening on port ' + port);
});