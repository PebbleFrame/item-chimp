//DECLARE GLOBAL VARIABLES ---START
  var
  fs = require('fs'),
  Bookshelf = require('bookshelf'),
  events = require('events'),
  EventEmitter = require("events").EventEmitter,
  util = require('util'),
  bcrypt   = require('bcrypt-nodejs'),
  jwt  = require('jwt-simple'),
  token;
//DECLARE GLOBAL VARIABLES ---END
//Create DataBase wrapper, includes event emitter --- START
  function DB(){
    EventEmitter.call(this);
  }

// Import the db config settings
var dbSettings = JSON.parse(fs.readFileSync(__dirname + '/config.json', 'utf8'));

  util.inherits(DB, EventEmitter);

  var db = new DB();

// Import secret from file
db.secret = String(fs.readFileSync(__dirname + '/secret'));

// Apply the dbSettings object
  var knex = require('knex')({
    client: 'mysql',
    connection: {
      host: dbSettings.host,
      user: dbSettings.user,
      password: dbSettings.password,
      database: 'pebble',
      charset: 'utf8',
    }
  });
  db.orm = require('bookshelf')(knex);
//Create DataBase wrapper, includes event emitter -- END


//-------------TABLES VERIFICATION START-----------/
  db.orm.knex.schema.hasTable('users').then(function(exists) {
    if (!exists)
        console.log('Table users does not exist');
  });

  db.orm.knex.schema.hasTable('reviews').then(function(exists) {
    if (!exists)
        console.log('Table reviews does not exist');
  });

  db.orm.knex.schema.hasTable('products').then(function(exists) {
    if (!exists)
        console.log('Table products does not exist');
  });

  db.orm.knex.schema.hasTable('followers').then(function(exists) {
    if (!exists)
        console.log('Table followers does not exist');
  });

  db.orm.knex.schema.hasTable('watchers').then(function(exists) {
    if (!exists)
        console.log('Table watchers does not exist');
  });
//-------------TABLES VERIFICATION END-------------/

//-------------ORM FOR USERS START-----------------/
  //Create user Model
  db.User = db.orm.Model.extend({
     tableName:"users"
  });

  //Create user Collection
  db.Users = new db.orm.Collection();
  db.Users.model = db.User;


//-------------ORM FOR USERS END-------------------/

//-------------ORM FOR REVIEWS START---------------/
  //Create Review Model
  db.Review = db.orm.Model.extend({
     tableName:"reviews"
  });

  //Create Review Collection
  db.Reviews = new db.orm.Collection();
  db.Reviews.model = db.Review;

//  //Create New Review (template) --For Development Only
//  var review = new db.Review({
//    user_id: 1,
//    upc: 12345678910,
//    rating: 2,
//    review_text: 'AWESOME'
//  });
//
//  //Review Save (template) to the database --For Development Only
//  review.save().then(function(newReview) {
//    db.Reviews.add(newReview);
//    console.log("Review Saved")
//  });
////-------------ORM FOR REVIEWS END-----------------/

//-------------ORM FOR PRODUCTS START--------------/
  //Create Products Model
  db.Product = db.orm.Model.extend({
     tableName:"products"
  });

  //Create product Collection
  db.Products = new db.orm.Collection();
  db.Products.model = db.Product;

  //Create New Product--For Development Only
  var product = new db.Product({
    upc: 123456789101,
    price: 400,
    review_count: 0
  });

  //Save Product to the database--For Development Only
  product.save().then(function(newProduct) {
    db.Products.add(newProduct);
    console.log("Product Saved");
  });
//-------------ORM FOR PRODUCTS END----------------/

//-------------ORM FOR FOLLOWERS START-------------/
  //Create Follower Model
  db.Follower = db.orm.Model.extend({
     tableName:"followers"
  });

  //Create user Collection
  db.Followers = new db.orm.Collection();
  db.Followers.model = db.Follower;

  // //Create New Follower--For Development Only
  // var follower = new db.Follower({
  //   user_id: 1,
  //   follower_id: 2
  // });

  // //Save follower to the database--For Development Only
  // follower.save().then(function(newFollower) {
  //   db.Followers.add(newFollower);
  //   console.log("Follower Saved")
  // });
//-------------ORM FOR FOLLOWERS END---------------/

//-------------ORM FOR WATCHERS START--------------/
  //Create Watcher Model
  db.Watcher = db.orm.Model.extend({
     tableName:"watchers"
  });

  //Create user Collection
  db.Watchers = new db.orm.Collection();
  db.Watchers.model = db.Watcher;

  //Create New Watcher--For Development Only
  // var watcher = new db.Watcher({
  //   user_id: 1,
  //   product_id: 1
  // });

  // //Save watcher to the database--For Development Only
  // watcher.save().then(function(newWatcher) {
  //   db.Watchers.add(newWatcher);
  //   console.log("Watcher Saved")
  // });
//-------------ORM FOR WATCHERS END----------------/

//-------------USER API CONFIGURATION START--------/

  db.tokenUser = null;
  //This function determines whether a specific user
  //already exists in the database
  db.findUser = function(userName){
    console.log("Hello" + userName);
    db.User.where({username: userName}).fetch()
    .then(function (user) {
      if (!user) {
        user = undefined;
        console.log("User"+userName+"Does Not Exist");
        db.emit("foundUser", user);
      }
      else{
        console.log(user + "Found");
        db.emit("foundUser", user);
      }
    });
  };

  db.addUser = function(user){
    //Is listening for finduser() event
    db.once('foundUser',function(found){
      //If the user is not in the database, a user will be added after
      //there password is salted and hashed
      if(!found){
        bcrypt.genSalt(10, function(err, salt) {
          if (err) {
            return console.log("Error with Salt");
          }
          bcrypt.hash(user.password, salt, null, function(err, hash) {
            if (err) {
              return console.log("Error with hash");
            }
            user.password = hash;
            console.log(user);
            var newUser = new db.User(user);
            newUser.save().then(function(newUser) {
              db.Users.add(newUser);
              console.log("User Saved");
              token = jwt.encode(user.username, db.secret);
              db.emit("userAdded", token);
            });
          });
        });
      }
      else{
        token = undefined;
        console.log('User already exists');
        db.emit("userAdded", token);
      }
    });
    console.log("User: " + user.username);
    //Before adding user, checks to see if the user is already in database
    db.findUser(user.username);
  };

  db.login = function(candidate){
    console.log("Logging In");
    //if the user is found in the database
    //the password provided will be compared
    //to the hashed password in the database
    //if it is a match, a token will be generated
    db.once("foundUser", function(user){
      if(user){
        console.log(user.get('password'));
        var candidatePassword = candidate.password;
        var savedPassword = user.get('password');
        bcrypt.compare(candidatePassword, savedPassword, function (err, isMatch) {
            if (isMatch) {
	            token = jwt.encode(user.get('username'), db.secret);
	            db.emit('userLogin', {
		            token: token,
		            username: user.get('username'),
		            email: user.get('email')
	            });
            }
            else {
              token = undefined;
              console.log("Password Incorrect");
              db.emit('userLogin', token);
             }
          });
      }else{
        token = undefined;
        console.log("User Not Found");
        db.emit('userLogin', token);
      }
    });
    console.log(candidate);
    db.findUser(candidate.username);
  };

  db.followUser = function(follower, followedName, res) {
    db.User.where({username: followedName}).fetch()
    .then(function(followed){
      if (!followed) {
        //totes doesn't exist
        console.log("Requested to follow a user that doesn't exist");
        res.status(400).end();
      } else {
        //Create New Follower
        db.Follower.where({
          follower_id: follower.get('user_id'),
          user_id: followed.get('user_id')
        }).fetch().then(function(alreadyFollowed){

          //There is not already a follow to this user
          if(!alreadyFollowed) {
            var newFollower = new db.Follower({
              follower_id: follower.get('user_id'),
              user_id : followed.get('user_id')
            });

            //Save follower to the database
            newFollower.save().then(function(newFollowerEntry) {
              db.Followers.add(newFollowerEntry);
              console.log("Follower Saved");
            });

            //Respond to the request
            res.status(201).end();
          } else {
            // There is already a follow to this user
            console.log("already following!");
            res.status(400).end();
          }
        });
      }
    });
  };

  db.getFollowing= function(follower, res) {
    db.Follower.where({follower_id : follower.get('user_id')}).fetchAll()
    .then(function(following){
      console.log("Grabbing users being followed");
      var ids = following.pluck("user_id");
      db.User.where('user_id', 'in', ids).fetchAll()
      .then(function(followingNames){
        res.status(201);
        res.send(followingNames.pluck('username'));
      });
    });
  };




//-------------USER API CONFIGURATION END---------------/

//-------------Review API CONFIGURATION START-----------/

  db.addReview = function(review, username){
    console.log(username);
    db.orm.knex.select().from('users').where({username: username})
    .then(function (user) {
      if (!user) {
        db.emit("reviewAdded", undefined);
      }
      else{
        console.log(user);
        console.log("Adding the review");
        review.user_id = user[0].user_id;
        var newReview = new db.Review(review);
        newReview.save().then(function(newReview) {
          db.emit("reviewAdded", newReview);
        })
      }
    });
  };

//Create New Users --For Development Only
	var user = {
		username: "Gilgamesh",
		password: 1,
		email: "g@gmail.com"
	};

	//Save user to the database
	db.addUser(user);

	user = {
		username: "Enkidu",
		password: 1,
		email: "e@gmail.com"
	};
	db.addUser(user);
//Create New Users --For Development Only


module.exports = db;

