var db = require('./db/db.js');

module.exports = {
	users : function(req,res){
		db.once("foundUser", function(user){
			res.json({username: user.get("username"),
								email: user.get("email")});
		});
		db.findUser(db.tokenUser);
	},
	reviews:function(req, res){
		res.send("reviews");
	},
	watching: function(req, res){
		res.send("watching");
	},
	following: function(req, res){
		res.send("following");
	},
	follow : function(req,res){
		db.once("foundUser", function(user){
			res.json({hello: 'Hi there! You are: ' + Object.keys(user)+ '.  Your req is: ' + req.body.username});
		});
		db.findUser(db.tokenUser);
	}
};
