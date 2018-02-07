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
    strength: {
      val: Number,
      bonus: String
    },
    dexterity: {
      val: Number,
      bonus: String
    },
    constitution: {
      val: Number,
      bonus: String
    },
    intelligence: {
      val: Number,
      bonus: String
    },
    wisdom: {
      val: Number,
      bonus: String
    },
    charisma: {
      val: Number,
      bonus: String
    }
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
    strength: {
      checked: Boolean,
      bonus: Number
    },
    dexterity: {
      checked: Boolean,
      bonus: Number
    },
    constitution: {
      checked: Boolean,
      bonus: Number
    },
    intelligence: {
      checked: Boolean,
      bonus: Number
    },
    wisdom: {
      checked: Boolean,
      bonus: Number
    },
    charisma: {
      checked: Boolean,
      bonus: Number
    }
  },
  skills: {
    acrobatics: {
      checked: Boolean,
      bonus: Number
    },
    animalHandling: {
      checked: Boolean,
      bonus: Number
    },
    arcana: {
      checked: Boolean,
      bonus: Number
    },
    athletics: {
      checked: Boolean,
      bonus: Number
    },
    deception: {
      checked: Boolean,
      bonus: Number
    },
    history: {
      checked: Boolean,
      bonus: Number
    },
    insight: {
      checked: Boolean,
      bonus: Number
    },
    intimidation: {
      checked: Boolean,
      bonus: Number
    },
    investigation: {
      checked: Boolean,
      bonus: Number
    },
    medicine: {
      checked: Boolean,
      bonus: Number
    },
    nature: {
      checked: Boolean,
      bonus: Number
    },
    perception: {
      checked: Boolean,
      bonus: Number
    },
    performance: {
      checked: Boolean,
      bonus: Number
    },
    persuasion: {
      checked: Boolean,
      bonus: Number
    },
    religion: {
      checked: Boolean,
      bonus: Number
    },
    sleightOfHand: {
      checked: Boolean,
      bonus: Number
    },
    stealth: {
      checked: Boolean,
      bonus: Number
    },
    survival: {
      checked: Boolean,
      bonus: Number
    }
  },
  passiveWisdom: Number,
  profAndLang: [String],
  hitDice: String,
  deathSaves: {
    successes: Number,
    failures: Number
  },
  attacks: [
    {
      name: String,
      bonus: Number,
      damage: String
    }
  ],
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