'use strict';

const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const { PORT, DATABASE_URL } = require('./config');
// const { Sheet } = require('./models'); Do we need this here? Not yet?

const app = express();

const sheetsRouter = require('./sheetsRouter');

app.use(morgan('common'));
app.use(express.static('public'));
app.use('/sheets', sheetsRouter);

let server;

function runServer(databaseURL, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseURL, {useMongoClient: true}, err => {
      if(err) {
        return reject(err);
      }

    server = app.listen(port, () => {
      console.log(`Dragon-App is listening on port ${ port }`);
      resolve();
    })
      .on('error', err => {
        mongoose.disconnect();
        reject(err);
      });
    });
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

// If server.js is called directly this block runs.
// We also export runServer and closeServer so our
// test code can start and close the server.
if (require.main === module) {
  runServer().catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };