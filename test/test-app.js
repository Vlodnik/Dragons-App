'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');

const expect = chai.expect;

const { app, runServer, closeServer } = require('../server');

chai.use(chaiHttp);

describe('Dragon-App API resource', function() {

  before(function() {
    return runServer();
  });

  after(function() {
    return closeServer();
  });

  it('should serve static assets with a 200 status code', function() {
    return chai.request(app)
      .get('/')
      .then(function(res) {
        expect(res).to.be.html;
        expect(res).to.have.status(200);
      });
  });
});