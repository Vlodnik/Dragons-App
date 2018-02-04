'use strict';

const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const Sheet = require('./models');

router.put('/:id', jsonParser, (req, res) => {
  if(req.params.id !== req.body.id) {
    const message = (`Request path id ${ req.params.id } must equal`
      `request body id ${ req.body.id }`);
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
      res.status(204).end();
    })
    .catch(function(err) {
      res.status(500).json({ message: 'Something went wrong!' });
    });
});

module.exports = router;