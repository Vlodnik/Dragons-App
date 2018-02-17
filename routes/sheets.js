'use strict';

const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const router = express.Router();

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const { Sheet } = require('../models');

const jwtAuth = passport.authenticate('jwt', { session: false });

router.use(jwtAuth);

router.get('/', (req, res) => {
  Sheet
    .find({user: req.user.username})
    .then(sheets => {
      res.status(200).json(sheets);
    })
    .catch(function(err) {
      res.status(500).json({ message: 'Something went wrong with GET!' });
    });
});

router.get('/:id', (req, res) => {
  Sheet
    .findById(req.params.id)
    .then(sheet => {
      if(sheet.user === req.user.username) {
        res.status(200).json(sheet.serialize());
      } else {
        const message = 'Unauthorized';
        console.error(message);
        return res.status(401).send(message);
      }
    })
    .catch(function(err) {
      console.error(err);
      res.status(500).json({ error: 'Something went wrong with id GET!' });
    });
});

const sheetFields = [
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

router.post('/', jsonParser, (req, res) => {
  if(!(req.body.charName && req.user.username)) {
    const message = 'Request must come from a user and contain charName';
    console.error(message);
    return res.status(400).send(message);
  }

  console.log('Creating new sheet object');
  const newSheet = {};

  sheetFields.forEach(function(field) {
    newSheet[field] = req.body[field];
  });

  newSheet.user = req.user.username;

  Sheet
    .create(newSheet)
    .then(function(sheet) {
      res.status(201).json(sheet);
    })
    .catch(function(err) {
      res.status(500).json({ message: 'Failed!' });
    });
});

router.put('/:id', jsonParser, (req, res) => {
  if(req.params.id !== req.body.id) {
    const message = `Request path id ${ req.params.id } must equal request body id ${ req.body.id }`;
    console.error(message);
    return res.status(400).send(message);
  }

  console.log(`Updating sheet object '${ req.params.id }'`);
  const newData = {};

  sheetFields.forEach(function(field) {
    if(field in req.body) {
      newData[field] = req.body[field];
    }
  });

  Sheet
    .findById(req.params.id)
    .then(sheet => {
      if(sheet.user === req.user.username) {
        Sheet
          .findByIdAndUpdate(req.params.id, { $set: newData })
          .then(() => {
            res.status(200).json({ message: 'Saved!' });
          });
      } else {
        const message = 'Unauthorized';
        console.error(message);
        return res.status(401).send(message);
      }
    })
    .catch(function(err) {
      res.status(500).json({ message: 'Failed!' });
    });
});

router.delete('/:id', (req, res) => {
  Sheet
    .findById(req.params.id)
    .then(sheet => {
      if(sheet.user === req.user.username) {
        sheet.remove()
        .then(() => {
          res.status(204).json({ message: 'Deleted!' });
        });
      } else {
        const message = 'Unauthorized';
        console.error(message);
        return res.status(401).send(message);
      }
    })
    .catch(function(err) {
      res.status(500).json({ message: 'Failed!' });
    });
});

module.exports = router;