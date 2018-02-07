'use strict';

const bodyParser = require('body-parser');
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const { PORT, DATABASE_URL } = require('./config');
const { Sheet } = require('./models'); // Do we need this here? Not yet?

const app = express();

// const sheetsRouter = require('./sheetsRouter');

app.use(morgan('common'));
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
  next();
});
// app.use('/sheets', sheetsRouter);

app.get('/sheets', (req, res) => {
  Sheet
    .findOne()
    .then(sheet => {
      res.status(200).json(sheet);
    })
    .catch(function(err) {
      res.status(500).json({ message: 'Something went wrong with GET!' });
    });
});

app.post('/sheets', (req, res) => {
  const requiredFields = [
    'charName',
    'classAndLevel',
    'background',
    'playerName',
    'race',
    'alignment',
    'experience',
    'attributes',
    'inspiration',
    'profBonus',
    'AC',
    'initiative',
    'speed',
    'HP',
    'currentHP',
    'temporaryHP',
    'savingThrows',
    'skills',
    'passiveWisdom',
    'profAndLang',
    'hitDice',
    'deathSaves',
    'attacks',
    'money',
    'equipment',
    'story',
    'features',
    'castingClass',
    'castingAbility',
    'spellSaveDC',
    'spellAttackBonus',
    'cantrips',
    'levelOneSpells',
    'levelTwoSpells',
    'levelThreeSpells',
    'levelFourSpells',
    'levelFiveSpells',
    'levelSixSpells',
    'levelSevenSpells',
    'levelEightSpells',
    'levelNineSpells'
  ];

  
});

app.put('/sheets/:id', (req, res) => {
  if(req.params.id !== req.body.id) {
    const message = (`Request path id ${ req.params.id } must equal request body id ${ req.body.id }`);
    console.error(message);
    return res.status(400).send(message);
  }

  console.log(`Updating sheet object '${ req.params.id }'`);
  const newData = {};
  const updateableFields = [
    'charName',
    'classAndLevel',
    'background',
    'playerName',
    'race',
    'alignment',
    'experience',
    'attributes',
    'inspiration',
    'profBonus',
    'AC',
    'initiative',
    'speed',
    'HP',
    'currentHP',
    'temporaryHP',
    'savingThrows',
    'skills',
    'passiveWisdom',
    'profAndLang',
    'hitDice',
    'deathSaves',
    'attacks',
    'money',
    'equipment',
    'story',
    'features',
    'castingClass',
    'castingAbility',
    'spellSaveDC',
    'spellAttackBonus',
    'cantrips',
    'levelOneSpells',
    'levelTwoSpells',
    'levelThreeSpells',
    'levelFourSpells',
    'levelFiveSpells',
    'levelSixSpells',
    'levelSevenSpells',
    'levelEightSpells',
    'levelNineSpells'
  ];

  updateableFields.forEach(function(field) {
    if(field in req.body) {
      newData[field] = req.body[field];
    }
  });

  Sheet
    .findByIdAndUpdate(req.params.id, { $set: newData }, { new: true })
    .then(function(updatedPost) {
      res.status(200).json({message: 'Save complete!'});
    })
    .catch(function(err) {
      res.status(500).json({ message: 'Something went wrong with PUT!' });
    });
});


let server;

function runServer(databaseURL = DATABASE_URL, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseURL, err => {
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