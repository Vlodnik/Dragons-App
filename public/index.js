'use strict';

let MOCK_CHAR_SHEET = {
  "id": 11111,
  "characterName": "Merriweather Abernethy"
  "class": "Barbarian",
  "level": 2,
  "background": "Pro-Athelete",
  "playerName": "Evan",
  "race": "Halfling",
  "alignment": "Chaotic Good",
  "experiencePoints": 500,
  "attributes": {
    "strength": 16,
    "dexterity": 16,
    "constitution": 16,
    "intelligence": 8,
    "wisdom": 8,
    "charisma": 15
  },
  "inspiration": 1,
  "proficiencyBonus": 2,
  "AC": 16,
  "initiative": null,
  "speed": 25,
  "HP": 25,
  "currentHP": 18,
  "temporaryHP": 0,
  "savingThrows": {
    "strength": null,
    "dexterity": null,
    "constitution": null,
    "intelligence": null,
    "wisdom": null,
    "charisma": null
  },
  "skills": {
    "acrobatics": false,
    "animalHandling": false,
    "arcana": false,
    "athletics": true,
    "deception": false,
    "history": false,
    "insight": false,
    "intimidation": true,
    "investigation": false,
    "medicine": false,
    "nature": false,
    "perception": false,
    "performance": false,
    "persuasion": false,
    "religion": false,
    "sleightOfHand": false,
    "stealth": false,
    "survival": false
  },
  "passiveWisdom": 8,
  "otherProfAndLang": [
    "Light & Med Armor",
    "Shields",
    "Simple & Martial Weapons",
    "Common",
    "Halfling"
  ],
  "hitDice": null,
  "deathSaves": {
    "successes": 0,
    "failures": 0
  },
  "attacks": [
    [
      "Greataxe",
      5,
      "1d12 + 3 slashing"
    ],
    [
      "Greatclub",
      5,
      "1d8 slashing"
    ]
  ],
  "equipment": [
    {
      "cp": null,
      "sp": null,
      "ep": null,
      "gp": null,
      "pp": null
    },
    "Greatclub",
    "Club",
    "Explorer's Pack",
    "Javelins x4",
    "Sword of Vengeance",
    "Water Mask",
    "Marauder's Map"
  ],
  "personalityTraits": null,
  "ideals": null,
  "bonds": null,
  "flaws": null,
  "featuresAndTraits": [
    "Lucky",
    "Brave",
    "Halfling Nimbleness",
    "RAGE",
    "Reckless Attack",
    "Danger Sense"
  ],
  "spellcastingClass": null,
  "spellcastingAbility": null,
  "spellSaveDC": null,
  "spellAttackBonus": null,
  "cantrips": [],
  "levelOneSpells": [],
  "levelTwoSpells": [],
  "levelThreeSpells": [],
  "levelFourSpells": [],
  "levelFiveSpells": [],
  "levelSixSpells": [],
  "levelSevenSpells": [],
  "levelEightSpells": [],
  "levelNineSpells": []
};

function getCharacterSheet(callback) {
  setTimeout(function() {
    callback(MOCK_CHAR_SHEET)
  }, 100);
}

function displayCharacterSheet() {

}

function getAndDisplayCharacterSheet() {
  getCharacterSheet(displayCharacterSheet);
}

getAndDisplayCharacterSheet();


