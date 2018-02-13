'use strict';

const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const { Sheet } = require('../models');

router.get('/', (req, res) => {
  Sheet
    .find()
    .then(sheets => {
      res.status(200).json(sheets);
    })
    .catch(function(err) {
      res.status(500).json({ message: 'Something went wrong with GET!' });
    });
});

router.get('/:id', jsonParser, (req, res) => {
  Sheet
    .findById(req.params.id)
    .then(sheet => {
      res.status(200).json(sheet.serialize());
    })
    .catch(function(err) {
      console.error(err);
      res.status(500).json({ error: 'Something went wrong with id GET!' });
    });
});

const sheetFields = [
  'user',
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
  if(!(req.body.charName)) {
    const message = 'Request must contain charName';
    console.error(message);
    return res.status(400).send(message);
  }

  console.log('Creating new sheet object');
  const newSheet = {};

  sheetFields.forEach(function(field) {
    newSheet[field] = req.body[field];
  });

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
    .findByIdAndUpdate(req.params.id, { $set: newData }, { new: true })
    .then(function(updatedPost) {
      res.status(200).json({ message: 'Saved!' });
    })
    .catch(function(err) {
      res.status(500).json({ message: 'Failed!' });
    });
});

module.exports = router;