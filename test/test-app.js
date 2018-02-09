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
    strength: {val: faker.random.number(), bonus: faker.random.word()},
    dexterity: {val: faker.random.number(), bonus: faker.random.word()},
    constitution: {val: faker.random.number(), bonus: faker.random.word()},
    intelligence: {val: faker.random.number(), bonus: faker.random.word()},
    wisdom: {val: faker.random.number(), bonus: faker.random.word()},
    charisma: {val: faker.random.number(), bonus: faker.random.word()}
  };

  newSheet.savingThrows = {
    strength: {checked: faker.random.boolean(), bonus: faker.random.number()},
    dexterity: {checked: faker.random.boolean(), bonus: faker.random.number()},
    constitution: {checked: faker.random.boolean(), bonus: faker.random.number()},
    intelligence: {checked: faker.random.boolean(), bonus: faker.random.number()},
    wisdom: {checked: faker.random.boolean(), bonus: faker.random.number()},
    charisma: {checked: faker.random.boolean(), bonus: faker.random.number()}
  };

  newSheet.skills = {
    acrobatics: {checked: faker.random.boolean(), bonus: faker.random.number()},
    animalHandling: {checked: faker.random.boolean(), bonus: faker.random.number()},
    arcana: {checked: faker.random.boolean(), bonus: faker.random.number()},
    athletics: {checked: faker.random.boolean(), bonus: faker.random.number()},
    deception: {checked: faker.random.boolean(), bonus: faker.random.number()},
    history: {checked: faker.random.boolean(), bonus: faker.random.number()},
    insight: {checked: faker.random.boolean(), bonus: faker.random.number()},
    intimidation: {checked: faker.random.boolean(), bonus: faker.random.number()},
    investigation: {checked: faker.random.boolean(), bonus: faker.random.number()},
    medicine: {checked: faker.random.boolean(), bonus: faker.random.number()},
    nature: {checked: faker.random.boolean(), bonus: faker.random.number()},
    perception: {checked: faker.random.boolean(), bonus: faker.random.number()},
    performance: {checked: faker.random.boolean(), bonus: faker.random.number()},
    persuasion: {checked: faker.random.boolean(), bonus: faker.random.number()},
    religion: {checked: faker.random.boolean(), bonus: faker.random.number()},
    sleightOfHand: {checked: faker.random.boolean(), bonus: faker.random.number()},
    stealth: {checked: faker.random.boolean(), bonus: faker.random.number()},
    survival: {checked: faker.random.boolean(), bonus: faker.random.number()}
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
    attacksArray.push({
        name: faker.random.word(),
        bonus: faker.random.number(),
        damage: faker.random.words()
      });
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

  describe('GET endpoint', function() {

    it('should respond with a json character sheet', function() {
      return chai.request(app)
        .get('/sheets')
        .then(function(res) {
          expect(res).to.be.json;
          expect(res).to.have.status(200);
        })
    });

    it('should retrieve object based on ID', function() {
      let sheetId;

      return chai.request(app)
        .get('/sheets')
        .then(function(data) {
          console.log(data.body[0]._id);
          sheetId = data.body[0]._id;

          return chai.request(app)
            .get(`/sheets/${ sheetId }`)
        })
        .then(function(data) {
          console.log('The data follows this log');
          console.log(data);
          expect(data.body.id).to.equal(sheetId);
          expect(data).to.be.json;
          expect(data.charName).to.not.equal(null);
        })
    });
  });

  describe('POST endpoint', function() {

    it('should create new sheet and send 201 status code', function() {
      const newSheet = generateSheetData();

      return chai.request(app)
        .post('/sheets')
        .send(newSheet)
        .then(function(res) {
          expect(res).to.be.json;
          expect(res).to.have.status(201);
          expect(res.body.charName).to.equal(newSheet.charName);
          newSheet.id = res.body._id;
          expect(res.body._id).to.not.equal(undefined);
          expect(res.body._id).to.equal(newSheet.id);
        })
    });
  });

  describe('PUT endpoint', function() {

    it('should update sheet and send 200 status code', function() {
      const updateData = {
        charName: 'etetetetetetet',
        attributes: {
          strength: {val: 9001, bonus: '+3000'},
          dexterity: {val: 9001, bonus: '+3000'},
          constitution: {val: 9001, bonus: '+3000'},
          intelligence: {val: 9001, bonus: '+3000'},
          wisdom: {val: 9001, bonus: '+3000'},
          charisma: {val: 9001, bonus: '+3000'}
        },
        levelNineSpells: [
          'Funky Chicken Dance',
          'Barbarian Rage',
          'Scottish Brogue'
        ]
      };
      return Sheet
        .findOne()
        .then(function(charSheet) {
          updateData.id = charSheet.id;

          return chai.request(app)
            .put(`/sheets/${ updateData.id }`)
            .send(updateData)
        })
        .then(function(res) {
          expect(res).to.have.status(200);

          return Sheet.findById(updateData.id);
        }) 
        .then(function(sheet) {
          expect(sheet.charName).to.equal(updateData.charName);
          expect(sheet.attributes.strength.val).to.equal(updateData.attributes.strength.val);
          expect(sheet.attributes.dexterity.val).to.equal(updateData.attributes.dexterity.val);
          expect(sheet.attributes.constitution.val).to.equal(updateData.attributes.constitution.val);
          expect(sheet.attributes.intelligence.val).to.equal(updateData.attributes.intelligence.val);
          expect(sheet.attributes.wisdom.val).to.equal(updateData.attributes.wisdom.val);
          expect(sheet.attributes.charisma.val).to.equal(updateData.attributes.charisma.val);
          expect(sheet.attributes.strength.bonus).to.equal(updateData.attributes.strength.bonus);
          expect(sheet.attributes.dexterity.bonus).to.equal(updateData.attributes.dexterity.bonus);
          expect(sheet.attributes.constitution.bonus).to.equal(updateData.attributes.constitution.bonus);
          expect(sheet.attributes.intelligence.bonus).to.equal(updateData.attributes.intelligence.bonus);
          expect(sheet.attributes.wisdom.bonus).to.equal(updateData.attributes.wisdom.bonus);
          expect(sheet.attributes.charisma.bonus).to.equal(updateData.attributes.charisma.bonus);
          expect(sheet.levelNineSpells).to.deep.equal(updateData.levelNineSpells);
        });
    });
  });
});