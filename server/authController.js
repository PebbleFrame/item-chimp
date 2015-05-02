var db = require('./db/db.js'),
    //Q    = require('q'),
    jwt  = require('jwt-simple');


module.exports = {
  signup: function (req, res) {
    db.addUser(req.body);
  },
  login: function(req,res){
    db.login(req.body)
  },
  logout: function(){},
  checkAuth: function(){}

};

