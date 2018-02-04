const express = require('express');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const app = express();

app.use(express.static('public'));

const { PORT, DATABASE_URL } = require('./config');

let server;

function runServer(port = PORT) {
  return new Promise((resolve, reject) => {
    server = app.listen(port, () => {
      console.log(`Your app is listening on port ${ port }`);
      resolve();
    })
      .on('error', err => {
        reject(err);
      });
  });
}

function closeServer() {
  return new Promise((resolve, reject) => {
    console.log('Closing server');
    server.close(err => {
      if(err) {
        return reject(err);
      }
      resolve();
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