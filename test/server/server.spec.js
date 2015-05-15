(function() {
  "use strict";

  var expect = require('expect');
  var app = require('../../server');
  var request = require('supertest');
  var db = require('../../server/db/db.js');
  console.log(db);

  describe('Server: routes', function() {

    it('should serve the home page', function(done) {
      request(app)
        .get('/')
        .end(function(err, res) {
          expect(res.statusCode).toEqual(200);
          done();
        });
    });

    it('should 404 for non-root get requests', function(done) {
      request(app)
        .get('/nonexistentroute')
        .end(function(err, res) {
          expect(res.statusCode).toEqual(404);
          done();
        });
    });

  });

  describe('Users', function() {
  
    // before(function(done) {
    //   new db.User({
    //     'username': 'testUserOne',
    //     'password': 'testUserOne',
    //     'email': 'testUserOne@testUserOne.com'
    //   }).save().then(function(){
    //     done();
    //   });
    // });

    // it('should have testUserOne after it is added', function(done) {
    //   db.once("foundUser", function(user){
    //     done();
    //   });
    //   db.findUser('testUserOne');
    // });

    // it('should fail when saving a duplicate user', function(done) {
    //   user.save(function() {
    //     var userDup = new User(user);
    //     userDup.save(function(err) {
    //       should.exist(err);
    //       done();
    //     });
    //   });
    // });

    // it('should fail when saving without an email', function(done) {
    //   user.email = '';
    //   user.save(function(err) {
    //     should.exist(err);
    //     done();
    //   });
    // });

    // it("should authenticate user if password is valid", function() {
    //   return user.authenticate('password').should.be.true;
    // });

    // it("should not authenticate user if password is invalid", function() {
    //   return user.authenticate('blah').should.not.be.true;
    // });

  });

})();