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

app.get('/general-query', function(req, res) {
  res.send('success!!!');
});

var port = process.env.PORT || 3000;

app.listen(port, function() {
  console.log('Server listening on port ' + port);
});