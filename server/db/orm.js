var Bookshelf = require('bookshelf');

//Create orm wrapper for database 
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

//Initialize user Table 
orm.db.knex.schema.hasTable('users').then(function(exists) {
  if (!exists) {
      console.log('Table users does not exist');
  }
  else{
      console.log('Initializing table users');
  }  
});

//Create user Model
orm.User = orm.db.Model.extend({
   tableName:"users"
});

//Create user Collection
orm.Users = new orm.db.Collection();
orm.Users.model = orm.User;

//Create New User --For Development Only
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

module.exports = orm;
