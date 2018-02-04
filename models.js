'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const sheetSchema = mongoose.Schema({
  charName: {type: String, required: true},
  classAndLevel: String,
  background: String,
  playerName: String,
  race: String,
  alignment: String,
  experience: Number,
  attributes: {
    strength: [{ any: {} }],
    dexterity: [{ any: {} }],
    constitution: [{ any: {} }],
    intelligence: [{ any: {} }],
    wisdom: [{ any: {} }],
    charisma: [{ any: {} }]
  },
  inspiration: Number,
  profBonus: Number,
  AC: Number,
  initiative: Number,
  speed: Number,
  HP: Number,
  currentHP: Number,
  temporaryHP: Number,
  savingThrows: {
    strength: [{ any: {} }],
    dexterity: [{ any: {} }],
    constitution: [{ any: {} }],
    intelligence: [{ any: {} }],
    wisdom: [{ any: {} }],
    charisma: [{ any: {} }]
  },
  skills: {
    acrobatics: [{ any: {} }],
    animalHandling: [{ any: {} }],
    arcana: [{ any: {} }],
    athletics: [{ any: {} }],
    deception: [{ any: {} }],
    history: [{ any: {} }],
    insight: [{ any: {} }],
    intimidation: [{ any: {} }],
    investigation: [{ any: {} }],
    medicine: [{ any: {} }],
    nature: [{ any: {} }],
    perception: [{ any: {} }],
    performance: [{ any: {} }],
    persuasion: [{ any: {} }],
    religion: [{ any: {} }],
    sleightOfHand: [{ any: {} }],
    stealth: [{ any: {} }],
    survival: [{ any: {} }]
  },
  passiveWisdom: Number,
  profAndLang: [String],
  hitDice: String,
  deathSaves: {
    successes: Number,
    failures: Number
  },
  attacks: [[]],
  money: {
    cp: Number,
    sp: Number,
    ep: Number,
    gp: Number,
    pp: Number
  },
  equipment: [String],
  story: {
    personality: String,
    ideals: String,
    bonds: String,
    flaws: String
  },
  features: [String],
  castingClass: String,
  castingAbility: String,
  spellSaveDC: Number,
  spellAttackBonus: String,
  cantrips: [String],
  levelOneSpells: [String],
  levelTwoSpells: [String],
  levelThreeSpells: [String],
  levelFourSpells: [String],
  levelFiveSpells: [String],
  levelSixSpells: [String],
  levelSevenSpells: [String],
  levelEightSpells: [String],
  levelNineSpells: [String]
});

sheetSchema.methods.serialize = function() {
  return {
    id: this._id,
    charName: this.charName,
    classAndLevel: this.classAndLevel,
    background: this.background,
    playerName: this.playerName,
    race: this.race,
    alignment: this.alignment,
    experience: this.experience,
    attributes: this.attributes,
    inspiration: this.inspiration,
    profBonus: this.profBonus,
    AC: this.AC,
    initiative: this.initiative,
    speed: this.speed,
    HP: this.HP,
    currentHP: this.currentHP,
    temporaryHP: this.temporaryHP,
    savingThrows: this.savingThrows,
    skills: this.skills,
    passiveWisdom: this.passiveWisdom,
    profAndLang: this.profAndLang,
    hitDice: this.hitDice,
    deathSaves: this.deathSaves,
    attacks: this.attacks,
    money: this.money,
    equipment: this.equipment,
    story: this.story,
    features: this.features,
    castingClass: this.castingClass,
    castingAbility: this.castingAbility,
    spellSaveDC: this.spellSaveDC,
    spellAttackBonus: this.spellAttackBonus,
    cantrips: this.cantrips,
    levelOneSpells: this.levelOneSpells,
    levelTwoSpells: this.levelTwoSpells,
    levelThreeSpells: this.levelThreeSpells,
    levelFourSpells: this.levelFourSpells,
    levelFiveSpells: this.levelFiveSpells,
    levelSixSpells: this.levelSixSpells,
    levelSevenSpells: this.levelSevenSpells,
    levelEightSpells: this.levelEightSpells,
    levelNineSpells: this.levelNineSpells
  };
};

const Sheet = mongoose.model('Sheet', sheetSchema);

module.exports = { Sheet };