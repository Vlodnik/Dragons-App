'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const chaiJwt = require('chai-jwt');
const faker = require('faker');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const expect = chai.expect;

const { Sheet, User } = require('../models');
const { app, runServer, closeServer } = require('../server');
const config = require('../config');

chai.use(chaiHttp);
chai.use(chaiJwt);

function seedUserData() {
  console.info('seeding user data')
  const seedData = [];

  for(let i = 1; i <= 5; i++) {
    seedData.push(generateUserData());
  }

  return User.insertMany(seedData);
}

function generateUserData() {
  return {
    username: faker.name.firstName() + faker.name.lastName(),
    password: faker.internet.password()
  };
}

function seedSheetData() {
  console.info('seeding character sheet data');
  const seedData = [];

  // for(let i = 1; i <= 10; i++) {
  //   seedData.push(generateSheetData());
  // }

  // return Sheet.insertMany(seedData);
  return User
    .find()
    .then(function(users) {
      users.forEach(function(user) {
        for(let i = 1; i <= 5; i++) {
          seedData.push(generateSheetData(user.username))
        }
      })
    })
    .then(function() {
      return Sheet.insertMany(seedData);
    });
}

function generateSheetData(user) {
  let newSheet = {};

  newSheet.user = user;

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

function createAuthToken(user) {
  return jwt.sign({user}, config.JWT_SECRET, {
    subject: user.username,
    expiresIn: config.JWT_EXPIRY,
    algorithm: 'HS256'
  });
};

describe('Dragon-App API resource', function() {

  before(function() {
    return runServer(config.TEST_DATABASE_URL);
  });

  beforeEach(function(done) {
    seedUserData()
      .then(function() {
        return seedSheetData();
      })
      .then(function() {
        done();
      });
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

  describe('POST endpoint for new users', function() {

    it('should create a new user and send 201 status code', function() {
      const newUser = {
        username: 'tomtomtomtomtomtomtomtomtom',
        password: 'flappingaboutwildlylikeabigbirdinthebreeze'
      };

      return chai.request(app)
        .post('/users')
        .send(newUser)
        .then(function(res) {
          expect(res).to.be.json;
          expect(res).to.have.status(201);
          expect(res.body.username).to.equal(newUser.username);
        });
    });

    it('should return an error if username is taken', function() {
      const newUser = {
        password: 'manymanymonkeys'
      };

      return User
        .findOne()
        .then(function(user) {
          newUser.username = user.username;

          return chai.request(app)
            .post('/users')
            .send(newUser)
        })
        .then(function(res) {
          // this code should never run, if it does we error
          expect(1).to.equal(2, 'endpoint should not allow duplicate usernames');
        })
        .catch(function(err) {
          expect(err).to.have.status(422);
          // expect(err.message).to.equal('Username already taken');
        });
    });
  });

  describe('POST endpoint for creating jwts on login', function() {

    it('should return a jwt when given username and password', function() {
      let testUser = {};
      let userId;

      return User
        .findOne()
        .then(function(user) {
          testUser.username = user.username;
          testUser.password = user.password;
          userId = user._id;
          
          return bcrypt.hash(user.password, 10);
        })
        .then(function(encryptedPass) {
          return User
            .findByIdAndUpdate(userId, {password: encryptedPass})
        })
        .then(function() {
          return chai.request(app)
            .post('/users/login')
            .send(testUser)
        })
        .then(function(res) {
          expect(res).to.be.json;
          expect(res).to.have.status(200);
          expect(res.body.authToken).to.be.a.jwt;
        });
    });
  });

  describe('GET endpoint', function() {

    it('should respond with json character sheets matching the username', function() {
      let testJwt;

      return User
        .findOne()
        .then(function(user) {
          testJwt = createAuthToken(user.serialize());
        })
        .then(function() {
          return chai.request(app)
            .get('/sheets')
            .set('Authorization', `Bearer ${ testJwt }`)
        })
        .then(function(res) {
          expect(res).to.be.json;
          expect(res.body[0].charName).to.be.a('string');
        })
    });

    it('should retrieve object based on ID', function() {
      let testUser;
      let testJwt;
      let sheetId;

      return User
        .findOne()
        .then(function(user) {
          testUser = user.serialize();
          testJwt = createAuthToken(testUser);
        })
        .then(function() {
          return Sheet
            .findOne({user: testUser.username})
        })
        .then(function(sheet) {
          sheetId = sheet._id;
        })
        .then(function() {
          return chai.request(app)
            .get(`/sheets/${ sheetId }`)
            .set('Authorization', `Bearer ${ testJwt }`)
        })
        .then(function(res) {
          expect(res).to.be.json;
          expect(res.body.id).to.equal(`${ sheetId }`);
          expect(res.body.charName).to.be.a('string');
        });
    });

    it('should error if a user attempts to access another users sheet', function() {
      const testUserOne = {username: 'etetetetet', password: faker.internet.password()};
      const testUserTwo = {username: 'rororororo', password: faker.internet.password()};
      const newUsers = [testUserOne, testUserTwo];
      const testJwtOne = createAuthToken({username: 'etetetetet'});
      const testJwtTwo = createAuthToken({username: 'rororororo'});
      const testSheet = generateSheetData(testUserTwo.username);

      const addTestUsers = User.insertMany(newUsers);
      const addTestSheet = Sheet.create(testSheet);

      return Promise.all([addTestUsers, addTestSheet])
        .then(function(res) {
          return chai.request(app)
            .get(`/sheets`)
            .set('Authorization', `Bearer ${ testJwtTwo }`)
        })
        .then(function(res) {
          return chai.request(app)
            .get(`/sheets/${ res.body[0]._id }`)
            .set('Authorization', `Bearer ${ testJwtOne }`)
        })
        .then(function() {
          // this code should never run
          expect(1).to.equal(2, 'Endpoint gave authorization incorrectly');
        })
        .catch(function(res) {
          expect(res).to.have.status(401);
          expect(res.message).to.equal('Unauthorized');
        });
    })
  });

  describe('POST endpoint', function() {

    it('should create new sheet and send 201 status code', function() {
      let newSheet;

      return User
        .findOne()
        .then(function(user) {
          const testJwt = createAuthToken(user.serialize());
          newSheet = generateSheetData(user.username);

          return chai.request(app)
            .post('/sheets')
            .set('Authorization', `Bearer ${ testJwt }`)
            .send(newSheet)
        })
        .then(function(res) {
          expect(res).to.be.json;
          expect(res).to.have.status(201);
          expect(res.body.charName).to.equal(newSheet.charName);
          expect(res.body.user).to.equal(newSheet.user);
          expect(res.body._id).to.not.equal(undefined);
        });
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

      let testJwt;

      return User
        .findOne()
        .then(function(user) {
          testJwt = createAuthToken(user.serialize());

          return Sheet.findOne({user: user.username})
        })
        .then(function(charSheet) {
          updateData.id = charSheet._id;

          return chai.request(app)
            .put(`/sheets/${ updateData.id }`)
            .set('Authorization', `Bearer ${ testJwt }`)
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

  describe('DELETE endpoint', function() {

    it('delete sheet based on ID', function() {
      // find a sheet associated with a user
      // create a jwt for the user
      // send request to DELETE endpoint with sheet ID and jwt
      // expect 204 status code
      // check to see if sheet is still there
      // expect not to find it
      let testJwt;
      let targetSheetId;

      return User
        .findOne()
        .then(function(user) {
          testJwt = createAuthToken(user.serialize());

          return Sheet
            .findOne({user: user.username})
        })
        .then(function(sheet) {
          targetSheetId = sheet._id;

          return chai.request(app)
            .delete(`/sheets/${ targetSheetId }`)
            .set('Authorization', `Bearer ${ testJwt }`)
        })
        .then(function(res) {
          expect(res).to.have.status(204);

          return Sheet
            .findById(targetSheetId)
        })
        .then(function(sheet) {
          expect(sheet).to.be.null;
        });
    });
  });
});