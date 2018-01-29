'use strict';

let MOCK_CHAR_SHEET = {
  "id": 11111,
  "charName": "Merriweather Abernethy",
  "classAndLevel": "Barbarian 2",
  "background": "Pro-Athelete",
  "playerName": "Evan",
  "race": "Halfling",
  "alignment": "Chaotic Good",
  "experience": 500,
  "attributes": {
    "strength": [16, '+3'],
    "dexterity": [16, '+3'],
    "constitution": [16, '+3'],
    "intelligence": [8, '-1'],
    "wisdom": [8, '-1'],
    "charisma": [15,'+2']
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
    "animalHandling": [false, -1],
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
    "sleightOfHand": [false, 3],
    "stealth": [false, 3],
    "survival": [false, -1]
  },
  "passiveWisdom": 8,
  "profAndLang": [
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
  "money": {
    "cp": null,
    "sp": 5,
    "ep": null,
    "gp": 20,
    "pp": null
  },
  "equipment": [
    "Greatclub",
    "Club",
    "Explorer's Pack",
    "Javelins x4",
    "Sword of Vengeance",
    "Water Mask",
    "Marauder's Map"
  ],
  "story": {
    "personality": "Merri is sassy, brassy, and Scottish as can be!",
    "ideals": "Merri came to play, and is here to stay.",
    "bonds": "Merri aspires to be a famous adventurer one day, and is bonded to courage.",
    "flaws": "Very whacky."
  },
  "features": [
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
  $('#class-level').attr('value', MOCK_CHAR_SHEET.classAndLevel);
  $('#background').attr('value', MOCK_CHAR_SHEET.background);
  $('#player-name').attr('value', MOCK_CHAR_SHEET.playerName);
  $('#race').attr('value', MOCK_CHAR_SHEET.race);
  $('#alignment').attr('value', MOCK_CHAR_SHEET.alignment);
  $('#experience').attr('value', MOCK_CHAR_SHEET.experience);
  $('#inspiration').attr('value', MOCK_CHAR_SHEET.inspiration);
  $('#prof-bonus').attr('value', MOCK_CHAR_SHEET.profBonus);
  $('#AC').attr('value', MOCK_CHAR_SHEET.AC);
  $('#initiative').attr('value', MOCK_CHAR_SHEET.initiative);
  $('#speed').attr('value', MOCK_CHAR_SHEET.speed);
  $('#HP').attr('value', MOCK_CHAR_SHEET.HP);
  $('#current-HP').attr('value', MOCK_CHAR_SHEET.currentHP);
  $('#temp-HP').attr('value', MOCK_CHAR_SHEET.temporaryHP);
  $('#hit-dice').attr('value', MOCK_CHAR_SHEET.hitDice);
  $('#percep').attr('value', MOCK_CHAR_SHEET.passiveWisdom);

  assignAttributes();
  assignSavingThrows();
  assignDeathSaves();
  assignSkills();
  assignAttacks();
  assignProf();
  assignMoney();
  assignEquip();
  assignTraits();
  assignFeatures();
}

function assignAttributes() {
  for(let stat in MOCK_CHAR_SHEET.attributes) {
    $(`#${ stat }`).attr('value', MOCK_CHAR_SHEET.attributes[stat][0]);
    $(`#${ stat }-mod`).attr('value', MOCK_CHAR_SHEET.attributes[stat][1]);
  }
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
    $(`#combat fieldset:first-of-type input:nth-of-type(${i})`)
      .attr('checked', true);
  }
  for(let i = 1; i <= MOCK_CHAR_SHEET.deathSaves.failures; i++) {
    $(`#combat fieldset:nth-of-type(2) input:nth-of-type(${i})`)
      .attr('checked', true);
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

function assignAttacks() {
  let attackElements = [];
  MOCK_CHAR_SHEET.attacks.forEach(function(attack) {
    const newAttack = generateAttack(attack[0], attack[1], attack[2]);
    attackElements.push(newAttack);
  });
  $('#attacks span:nth-of-type(3)').after(attackElements);
}

function generateAttack(name, bonus, dmg) {
  return `
    <input class="atk-name" type="text" value="${ name }">
    <input class="atk-bonus" type="number" value="${ bonus }">
    <input class="atk-damage" type="text" value="${ dmg }">
  `;
}

function assignProf() {
  let profs = [];
  MOCK_CHAR_SHEET.profAndLang.forEach(function(prof) {
    const newProf = generateProf(prof);
    profs.push(newProf);
  });
  $('#new-prof').before(profs);
}

function generateProf(prof) {
  return `
    <input class="profs" type="text" value="${ prof }">
  `;
}

function assignMoney() {
  for(let coin in MOCK_CHAR_SHEET.money) {
    $(`#${ coin }`).attr('value', MOCK_CHAR_SHEET.money[coin]);
  }
}

function assignEquip() {
  let items = [];
  MOCK_CHAR_SHEET.equipment.forEach(function(item) {
    const newItem = generateEquip(item);
    items.push(newItem);
  });
  $('#new-equip').before(items);
}

function generateEquip(item) {
  return `
    <input class="items" type="text" value="${ item }">
  `;
}

function assignTraits() {
  for(let trait in MOCK_CHAR_SHEET.story) {
    $(`#${ trait }`).val(MOCK_CHAR_SHEET.story[trait]);
  }
}

function assignFeatures() {
  let features = [];
  MOCK_CHAR_SHEET.features.forEach(function(feature) {
    const newFeature = generateFeature(feature);
    features.push(newFeature);
  });
  $('#features fieldset').append(features);
}

function generateFeature(feature) {
  return `
    <input class="traits" type="text" value="${ feature }">
  `;
}

function getAndDisplayCharacterSheet() {
  getCharacterSheet(displayCharacterSheet);
}

getAndDisplayCharacterSheet();