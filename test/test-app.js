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

function seedSheetData() {
  console.info('seeding character sheet data');
  const seedData = [];

  for(let i = 1; i <= 10; i++) {
    seedData.push(generateSheetData());
  }

  return Sheet.insertMany(seedData);
}

function generateSheetData() {
  let newSheet = {};

  const stringValues = [
    'charName', 
    'classAndLevel', 
    'background', 
    'playerName', 
    'race',
    'alignment',
    'hitDice',
    ];

  const numValues = [
    'experience',
    'inspiration',
    'profBonus',
    'AC',
    'initiative',
    'speed',
    'HP',
    'currentHP',
    'temporaryHP',
    'passiveWisdom'
  ];

  const unusedData = [
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

  stringValues.forEach(function(field) {
    newSheet[field] = faker.random.words();
  });

  numValues.forEach(function(field) {
    newSheet[field] = faker.random.number();
  })

  unusedData.forEach(function(field) {
    if(field.indexOf('level') === 0) {
      newSheet[field] = [];
    } else if(field === 'cantrips') {
      newSheet[field] = [];
    } else {
      newSheet[field] = null;
    }
  });

  newSheet.attributes = {
    strength: [faker.random.number(), faker.random.word()],
    dexterity: [faker.random.number(), faker.random.word()],
    constitution: [faker.random.number(), faker.random.word()],
    intelligence: [faker.random.number(), faker.random.word()],
    wisdom: [faker.random.number(), faker.random.word()],
    charisma: [faker.random.number(),faker.random.word()]
  };

  newSheet.savingThrows = {
    strength: [faker.random.boolean(), faker.random.word()],
    dexterity: [faker.random.boolean(), faker.random.word()],
    constitution: [faker.random.boolean(), faker.random.word()],
    intelligence: [faker.random.boolean(), faker.random.word()],
    wisdom: [faker.random.boolean(), faker.random.word()],
    charisma: [faker.random.boolean(),faker.random.word()]
  };

  newSheet.skills = {
    acrobatics: [faker.random.boolean(), faker.random.number()],
    animalHandling: [faker.random.boolean(), faker.random.number()],
    arcana: [faker.random.boolean(), faker.random.number()],
    athletics: [faker.random.boolean(), faker.random.number()],
    deception: [faker.random.boolean(), faker.random.number()],
    history: [faker.random.boolean(), faker.random.number()],
    insight: [faker.random.boolean(), faker.random.number()],
    intimidation: [faker.random.boolean(), faker.random.number()],
    investigation: [faker.random.boolean(), faker.random.number()],
    medicine: [faker.random.boolean(), faker.random.number()],
    nature: [faker.random.boolean(), faker.random.number()],
    perception: [faker.random.boolean(), faker.random.number()],
    performance: [faker.random.boolean(), faker.random.number()],
    persuasion: [faker.random.boolean(), faker.random.number()],
    religion: [faker.random.boolean(), faker.random.number()],
    sleightOfHand: [faker.random.boolean(), faker.random.number()],
    stealth: [faker.random.boolean(), faker.random.number()],
    survival: [faker.random.boolean(), faker.random.number()]
  };

  newSheet.profAndLang = createRandomStringArray();

  newSheet.deathSaves = {
    successes: Math.floor(Math.random() * 4),
    failures: Math.floor(Math.random() * 4)
  };

  newSheet.attacks = createRandomAttacksArray();

  newSheet.money = {
    cp: faker.random.number(),
    sp: faker.random.number(),
    ep: faker.random.number(),
    gp: faker.random.number(),
    pp: faker.random.number()
  };

  newSheet.equipment = createRandomStringArray();

  newSheet.story = {
    personality: faker.lorem.paragraph(),
    ideals: faker.lorem.paragraph(),
    bonds: faker.lorem.paragraph(),
    flaws: faker.lorem.paragraph()
  };

  newSheet.features = createRandomStringArray();

  return newSheet;
}

function createRandomStringArray() {
  let stringArray = [];

  for(let i = 0; i <= Math.floor(Math.random() * 20); i++) {
    stringArray.push(faker.lorem.sentence());
  }

  return stringArray;
}

function createRandomAttacksArray() {
  let attacksArray = [];

  for(let i = 0; i <= Math.floor(Math.random() * 10); i++) {
    attacksArray.push([
        faker.random.word(),
        faker.random.number(),
        faker.random.words()
      ]);
  }

  return attacksArray;
}

function tearDownDb() {
  console.warn('tearing down database');
  mongoose.connection.dropDatabase();
}

describe('Dragon-App API resource', function() {

  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

  beforeEach(function() {
    return seedSheetData();
  });

  afterEach(function() {
    return tearDownDb();
  });

  after(function() {
    return closeServer();
  });

  describe('serving static assets', function() {

    it('should serve static assets with a 200 status code', function() {
      return chai.request(app)
        .get('/')
        .then(function(res) {
          expect(res).to.be.html;
          expect(res).to.have.status(200);
        });
    });
  });

  describe('PUT endpoint', function() {

    it('should update sheet and send 204 status code', function() {
      const updateData = generateSheetData();

      return Sheet
        .findOne()
        .then(function(charSheet) {
          updateData.id = charSheet.id;

          return chai.request(app)
            .put(`/sheets/${ updateData.id }`)
            .send(updateData)
        })
        .then(function(res) {
          expect(res).to.have.status(204);

          return Sheet.findById(updateData.id);
        }) 
        .then(function(sheet) {
          expect(sheet).to.deep.equal(updateData);
        });
    });
  });
});