'use strict';

let MOCK_CHAR_SHEET = {
  "id": 11111,
  "charName": "Merriweather Abernethy",
  "class": "Barbarian",
  "level": 2,
  "background": "Pro-Athelete",
  "playerName": "Evan",
  "race": "Halfling",
  "alignment": "Chaotic Good",
  "experience": 500,
  "attributes": {
    "strength": 16,
    "dexterity": 16,
    "constitution": 16,
    "intelligence": 8,
    "wisdom": 8,
    "charisma": 15
  },
  "inspiration": 1,
  "profBonus": 2,
  "AC": 16,
  "initiative": null,
  "speed": 25,
  "HP": 25,
  "currentHP": 18,
  "temporaryHP": 0,
  "savingThrows": {
    "strength": [true, 4],
    "dexterity": [false, 4],
    "constitution": [true, 3],
    "intelligence": [false, 0],
    "wisdom": [false, 0],
    "charisma": [false, 1]
  },
  "skills": {
    "acrobatics": [false, 3],
    "animal-handling": [false, -1],
    "arcana": [false, -1],
    "athletics": [true, 5],
    "deception": [false, 2],
    "history": [false, -1],
    "insight": [false, -1],
    "intimidation": [true, 4],
    "investigation": [false, -1],
    "medicine": [false, -1],
    "nature": [false, -1],
    "perception": [false, -1],
    "performance": [false, 2],
    "persuasion": [false, 2],
    "religion": [false, -1],
    "sleight-of-hand": [false, 3],
    "stealth": [false, 3],
    "survival": [false, -1]
  },
  "passiveWisdom": 8,
  "otherProfAndLang": [
    "Light & Med Armor",
    "Shields",
    "Simple & Martial Weapons",
    "Common",
    "Halfling"
  ],
  "hitDice": "Eh?",
  "deathSaves": {
    "successes": 2,
    "failures": 1
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
  "castingClass": null,
  "castingAbility": null,
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
  $('#char-name').attr('value', MOCK_CHAR_SHEET.charName);
  $('#class').attr('value', MOCK_CHAR_SHEET.class);
  $('#level').attr('value', MOCK_CHAR_SHEET.level);
  $('#background').attr('value', MOCK_CHAR_SHEET.background);
  $('#player-name').attr('value', MOCK_CHAR_SHEET.playerName);
  $('#race').attr('value', MOCK_CHAR_SHEET.race);
  $('#alignment').attr('value', MOCK_CHAR_SHEET.alignment);
  $('#experience').attr('value', MOCK_CHAR_SHEET.experience);
  $('#strength').attr('value', MOCK_CHAR_SHEET.attributes.strength);
  $('#dexterity').attr('value', MOCK_CHAR_SHEET.attributes.dexterity);
  $('#constitution').attr('value', MOCK_CHAR_SHEET.attributes.constitution);
  $('#intelligence').attr('value', MOCK_CHAR_SHEET.attributes.intelligence);
  $('#wisdom').attr('value', MOCK_CHAR_SHEET.attributes.wisdom);
  $('#charisma').attr('value', MOCK_CHAR_SHEET.attributes.charisma);
  $('#inspiration').attr('value', MOCK_CHAR_SHEET.inspiration);
  $('#prof-bonus').attr('value', MOCK_CHAR_SHEET.profBonus);
  $('#AC').attr('value', MOCK_CHAR_SHEET.AC);
  $('#initiative').attr('value', MOCK_CHAR_SHEET.initiative);
  $('#speed').attr('value', MOCK_CHAR_SHEET.speed);
  $('#HP').attr('value', MOCK_CHAR_SHEET.HP);
  $('#current-HP').attr('value', MOCK_CHAR_SHEET.currentHP);
  $('#temp-HP').attr('value', MOCK_CHAR_SHEET.temporaryHP);
  $('#hit-dice').attr('value', MOCK_CHAR_SHEET.hitDice);

  assignSavingThrows();
  assignDeathSaves();
  assignSkills();
}

function assignSavingThrows() {
  for(let stat in MOCK_CHAR_SHEET.savingThrows) {
    if(MOCK_CHAR_SHEET.savingThrows[stat][0]) {
      $(`#${ stat }-save input:nth-child(2)`)
        .attr('checked', true);
    }
    $(`#${ stat }-save input:nth-child(3)`)
      .attr('value', MOCK_CHAR_SHEET.savingThrows[stat][1]);
  }
}

function assignDeathSaves() {
  for(let i = 1; i <= MOCK_CHAR_SHEET.deathSaves.successes; i++) {
    $(`#combat fieldset:first-of-type input:nth-of-type(${i})`).attr('checked', true);
  }
  for(let i = 1; i <= MOCK_CHAR_SHEET.deathSaves.failures; i++) {
    $(`#combat fieldset:nth-of-type(2) input:nth-of-type(${i})`).attr('checked', true);
  }
}

function assignSkills() {
  for(let skill in MOCK_CHAR_SHEET.skills) {
    if(MOCK_CHAR_SHEET.skills[skill][0]) {
      $(`#${ skill } input:first-of-type`).attr('checked', true)
    }
    $(`#${ skill } input:nth-of-type(2)`)
      .attr('value', MOCK_CHAR_SHEET.skills[skill][1]);
  }
}

function getAndDisplayCharacterSheet() {
  getCharacterSheet(displayCharacterSheet);
}

getAndDisplayCharacterSheet();
displayCharacterSheet();