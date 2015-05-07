(function() {
  "use strict";

  var expect = require('expect');
  var app = require('../../server');
  var request = require('supertest');

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

})();