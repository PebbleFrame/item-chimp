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

app.post('/general-query-amazon', function(req, res) {
  res.send([
    {amazon: [{amazon1: 'amazon1'}, {amazon2: 'amazon2'}]}
  ]);
});

app.post('/general-query-walmart', function(req, res) {
  res.send([
    {walmart: [{"itemId":30135922 ,"parentItemId":30135922,"name":"Apple iPod touch 32GB","msrp":249,"salePrice":229,"upc":"885909827367","categoryPath":"Electronics/iPods & MP3 Players/Apple iPods"},
    {"itemId":21805444,"parentItemId":21805444,"name":"Apple iPod nano 16GB","msrp":145,"salePrice":145,"upc":"885909564910","categoryPath":"Electronics/iPods & MP3 Players/All MP3 Players"}]}
  ]);
});

app.post('/general-query-bestbuy', function(req, res) {
  res.send([
    {bestbuy: [{bestbuy1: 'bestbuy1'}, {bestbuy2: 'bestbuy2'}]}
  ]);
});



var port = process.env.PORT || 3000;

app.listen(port, function() {
  console.log('Server listening on port ' + port);
});