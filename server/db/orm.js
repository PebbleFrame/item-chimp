var Bookshelf = require('bookshelf');

//Create orm wrapper for database to 
var orm = {}
orm.db = Bookshelf.initialize({
  client: 'mysql',
  connection: {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'pebble',
    charset: 'utf8',
  }
});

//-------------TABLES VERIFICATION START-----------/
  orm.db.knex.schema.hasTable('users').then(function(exists) {
    if (!exists) {
        console.log('Table users does not exist');
    }
    else{
        console.log('Initializing table users');
    }  
  });
//-------------TABLES VERIFICATION END-------------/

//-------------ORM FOR USERS START-----------------/
  //Create user Model
  orm.User = orm.db.Model.extend({
     tableName:"users"
  });

  //Create user Collection
  orm.Users = new orm.db.Collection();
  orm.Users.model = orm.User;

  //Create New Users --For Development Only
  var user = new orm.User({
    username: "Gilgamesh",
    password: 1,
    email: "g@gmail.com"
  });

  //Save user to the database
  user.save().then(function(newUser) {
    orm.Users.add(newUser);
    console.log("User Saved")
  });

  user = new orm.User({
    username: "Enkidu",
    password: 1,
    email: "e@gmail.com"
  });

  user.save().then(function(newUser) {
    orm.Users.add(newUser);
    console.log("User Saved")
  });

//-------------ORM FOR USERS END-------------------/

//-------------ORM FOR REVIEWS START---------------/
  //Create user Model
  orm.Review = orm.db.Model.extend({
     tableName:"reviews"
  });

  //Create Review Collection
  orm.Reviews = new orm.db.Collection();
  orm.Reviews.model = orm.Review;

  //Create New Review (Template) --For Development Only
  var review = new orm.Review({
    user_id: 1,
    upc: 12345678910,
    rating: 2,
    review_text: 'AWESOME'
  });

  //Review Save (Template) to the database --For Development Only
  review.save().then(function(newReview) {
    orm.Reviews.add(newReview);
    console.log("Review Saved")
  });
//-------------ORM FOR REVIEWS END-----------------/

//-------------ORM FOR PRODUCTS START--------------/
  //Create Products Model
  orm.Product = orm.db.Model.extend({
     tableName:"products"
  });

  //Create product Collection
  orm.Products = new orm.db.Collection();
  orm.Products.model = orm.Product;

  //Create New Product--For Development Only
  var product = new orm.Product({
    upc: 123456789101,
    price: 400,
    review_count: 0
  });

  //Save Product to the database--For Development Only
  product.save().then(function(newProduct) {
    orm.Products.add(newProduct);
    console.log("Product Saved")
  });
//-------------ORM FOR PRODUCTS END----------------/

//-------------ORM FOR FOLLOWERS START-------------/
  //Create Follower Model
  orm.Follower = orm.db.Model.extend({
     tableName:"followers"
  });

  //Create user Collection
  orm.Followers = new orm.db.Collection();
  orm.Followers.model = orm.Follower;

  //Create New Follower--For Development Only
  var follower = new orm.Follower({
    user_id: 1,
    follower_id: 2
  });

  //Save follower to the database--For Development Only
  follower.save().then(function(newFollower) {
    orm.Followers.add(newFollower);
    console.log("Follower Saved")
  });
//-------------ORM FOR FOLLOWERS END---------------/

//-------------ORM FOR WATCHERS START--------------/
  //Create Watcher Model
  orm.Watcher = orm.db.Model.extend({
     tableName:"watchers"
  });

  //Create user Collection
  orm.Watchers = new orm.db.Collection();
  orm.Watchers.model = orm.Watcher;

  //Create New Watcher--For Development Only
  var watcher = new orm.Watcher({
    user_id: 1,
    product_id: 1
  });

  //Save watcher to the database--For Development Only
  watcher.save().then(function(newWatcher) {
    orm.Watchers.add(newWatcher);
    console.log("Watcher Saved")
  });
//-------------ORM FOR WATCHERS END----------------/



module.exports = orm;