var db = require('./db/db.js');

module.exports = {
	users : function(req,res){
		db.on("foundUser", function(user){
			res.json({username: user.get("username"),
								email: user.get("email")});
		});
		db.findUser(db.tokenUser);
	},
	reviews:function(){
		console.log("reviews");
	},
	watching: function(){
		console.log("watching")
	},
	following: function(){
		console.log("following")
	}
};