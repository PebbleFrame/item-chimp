var authController = require('./authController.js');

module.exports = function(app) {
  app.post('/signup', authController.signup);
  app.post('/login', authController.login);
  app.post('/logout', authController.logout);
  app.get('/loggedin', authController.checkAuth);
};