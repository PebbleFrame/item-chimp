var db = require('./db/db.js');

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
    db.addReview(req.body);
	}
};