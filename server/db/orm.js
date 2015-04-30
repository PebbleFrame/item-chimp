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


// db.knex.schema.hasTable('clicks').then(function(exists) {
//   if (!exists) {
//     db.knex.schema.createTable('clicks', function (click) {
//       click.increments('id').primary();
//       click.integer('link_id');
//       click.timestamps();
//     }).then(function (table) {
//       console.log('Created clicks Table', table);
//     });
//   }
// });

// /************************************************************/
// // Add additional schema definitions below
// /************************************************************/
// db.knex.schema.hasTable('users').then(function(exists) {
//   if (!exists) {
//     db.knex.schema.createTable('users', function (user) {
//       user.increments('id').primary();
//       user.string('username', 20);
//       user.string('password', 20);
//       user.timestamps();
//     }).then(function (table) {
//       console.log('Created User Table', table);
//     });
//   }
// });

// db.knex.schema.hasTable('userUrls').then(function(exists) {
//   if (!exists) {
//     db.knex.schema.createTable('userUrls', function (userUrl) {
//       userUrl.increments('id').primary();
//       userUrl.integer('userID');
//       userUrl.integer('urlID');
//       userUrl.timestamps();
//     }).then(function (table) {
//       console.log('Created userUrls Table', table);
//     });
//   }
// });

module.exports = orm;
