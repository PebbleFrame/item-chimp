var db = require('./db/db.js'),
    //Q    = require('q'),
    jwt  = require('jwt-simple');


module.exports = {
  signup: function (req, res) {
    console.log("Hello" + req.body.username);
    db.on("userAdded", function(token){
      res.json({"token": token});
    });
    db.addUser(req.body);
  },
  login: function(req,res){
    db.login(req.body);
  },
  logout: function(){},
  checkAuth: function(){}

};

