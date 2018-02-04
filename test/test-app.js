'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const expect = chai.expect;

const { Sheet } = require('../models');
const { app, runServer, closeServer } = require('../server');
const { TEST_DATABASE_URL } = require('../config');

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

  it('should update on PUT request and send 201 status code', function() {
    
  });
});