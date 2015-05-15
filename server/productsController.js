var db = require('./db/db.js');
jwt  = require('jwt-simple');

module.exports = {
	getProduct: function(){
		console.log("users");
	},
	addProduct:function(){
		console.log("reviews");
	},
	createReview: function(req, res){
		db.once("reviewAdded", function(review) {
      res.json({reviewText: review.get('review_text')});
    });
    var username = jwt.decode(req.headers['x-access-token'], db.secret);
    db.addReview(req.body, username);
	}
};