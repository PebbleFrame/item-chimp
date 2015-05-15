var authController = require('./authController.js');
var usersController = require('./usersController.js');
var productsController = require('./productsController.js');
var authorize = authController.authorize;


module.exports = function(app) {
  app.post('/signup', authController.signup);
  app.post('/login', authController.login);
  app.get('/users/', authorize, usersController.users);
  app.get('/users/reviews', authorize, usersController.reviews);
  app.get('/users/watching', authorize,  usersController.watching);
  app.get('/users/following', authorize, usersController.following);
  app.post('/users/follow', authorize, usersController.follow);
  app.get('/products/', authorize, productsController.getProduct);
  app.post('/products/', authorize, productsController.addProduct);
  app.post('/products/review', authorize, productsController.createReview);
};
