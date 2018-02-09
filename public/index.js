'use strict';

const appState = {
  currentSheetId: null
};

function getCharacterSheet(callback) {
  console.log('getting character sheet');
  $.getJSON('http://localhost:8080/sheets', callback);
}

// <button class="js-save" type="submit">Save Character</button>

function renderLandingPage() {
  const html =`
    <nav id="nav-bar">
      <ul>
        <li id="home"><button id="js-home" type="submit">Home</button></li>
        <li><button id="js-new-sheet" type="submit">New</button></li>
      </ul>
    </nav>

    <header><img src="logo.gif" alt="Draconis Personae logo."></header>

    <ul id="confirm-buttons">
    </ul>
  `;

  $('body').html(html);

  getAndDisplaySavedSheets();
}

function getAndDisplaySavedSheets() {
  console.log('Getting saved sheets');
      $.ajax({
        method: 'GET',
        dataType: 'json',
        url: `http://localhost:8080/sheets`,
        success: renderSavedCharacters
      });
}

function renderSavedCharacters(data) {
  // if data.length === 0, then display 'you have no characters'
  const listElements = data.map(createListElement);

  $('#confirm-buttons').append(listElements);
}

function createListElement(sheet) {
  return `
    <li class="landing-chars">
      <button 
        class="confirm" 
        data-id="${ sheet._id }" 
        type="submit">
        ${ sheet.charName }
      </button>
    </li>
  `;
}

function renderCharSheet(data) {
  const html = `
    <nav id="nav-bar">
      <ul>
        <li id="home"><button id="js-home" type="submit">Home</button></li>
        <li id="save"><button id="js-save" type="submit">Save</button></li>
        <li><button id="js-new-sheet" type="submit">New</button></li>
      </ul>
    </nav>

    <header><img src="logo.gif" alt="Draconis Personae logo."></header>

    <form id="macro">
      <label for="charName">Character Name</label>
      <input id="charName" type="text" required>
      <div>
        <label for="playerName">Player Name</label>
        <input id="playerName" type="text">
      </div>

      <div>
        <label for="classAndLevel">Class &amp; Level</label>
        <input id="classAndLevel" type="text">
      </div>

      <div>
        <label for="background">Background</label>
        <input id="background" type="text">
      </div>

      <div>
        <label for="race">Race</label>
        <input id="race" type="text">
      </div>

      <div>
        <label for="alignment">Alignment</label>
        <input id="alignment" type="text">
      </div>

      <div>
        <label for="experience">Exp Points</label>
        <input id="experience" type="number">
      </div>
    </form>

    <h2 id="attributes-header">Attributes</h2>
    <form id="attributes">
      <fieldset>
        <legend>Strength</legend>
        <input id="strength" class="attribute" type="number">
        <input id="strength-mod" class="modifier" type="string">
      </fieldset>

      <fieldset>
        <legend>Dexterity</legend>
        <input id="dexterity" class="attribute" type="number">
        <input id="dexterity-mod" class="modifier" type="string">
      </fieldset>

      <fieldset>
        <legend>Constitution</legend>
        <input id="constitution" class="attribute" type="number">
        <input id="constitution-mod" class="modifier" type="string">
      </fieldset>

      <fieldset>
        <legend>Intelligence</legend>
        <input id="intelligence" class="attribute" type="number">
        <input id="intelligence-mod" class="modifier" type="string">
      </fieldset>

      <fieldset>
        <legend>Wisdom</legend>
        <input id="wisdom" class="attribute" type="number">
        <input id="wisdom-mod" class="modifier" type="string">
      </fieldset>

      <fieldset>
        <legend>Charisma</legend>
        <input id="charisma" class="attribute" type="number">
        <input id="charisma-mod" class="modifier" type="string">
      </fieldset>
    </form>

    <form id="ins-prof">
      <fieldset>
        <label for="inspiration">Inspiration</label>
        <input id="inspiration" type="number">
      </fieldset>

      <fieldset>
        <label for="profBonus">Proficiency Bonus</label>
        <input id="profBonus" type="number">
      </fieldset>
    </form>

    <h2 id="throws-header">Saving Throws</h2>
    <form id="saving-throws">
      <fieldset id="strength-save">
        <legend>Strength</legend>
        <input type="checkbox">
        <input type="number">
      </fieldset>

      <fieldset id="dexterity-save">
        <legend>Dexterity</legend>
        <input type="checkbox">
        <input type="number">
      </fieldset>

      <fieldset id="constitution-save">
        <legend>Constitution</legend>
        <input type="checkbox">
        <input type="number">
      </fieldset>

      <fieldset id="intelligence-save">
        <legend>Intelligence</legend>
        <input type="checkbox">
        <input type="number">
      </fieldset>

      <fieldset id="wisdom-save">
        <legend>Wisdom</legend>
        <input type="checkbox">
        <input type="number">
      </fieldset>

      <fieldset id="charisma-save">
        <legend>Charisma</legend>
        <input type="checkbox">
        <input type="number">
      </fieldset>
    </form>

    <h2 id="combat-header">Combat</h2>
    <form id="combat">
      <fieldset class="com-one">
        <legend for="AC">Armor Class</legend>
        <input id="AC" type="number">
      </fieldset>

      <fieldset class="com-one">
        <legend for="initiative">Initiative</legend>
        <input id="initiative" type="number">
      </fieldset>

      <fieldset class="com-one"> 
        <legend for="speed">Speed</legend>
        <input id="speed" type="number">
      </fieldset>

      <fieldset class="com-one">
        <legend for="HP">Hit Point Maximum</legend>
        <input id="HP" type="number">
      </fieldset>

      <fieldset class="com-one">
        <legend for="currentHP">Current Hit Points</legend>
        <input id="currentHP" type="number">
      </fieldset>

      <fieldset class="com-one">
        <legend for="temporaryHP">Temporary Hit Points</legend>
        <input id="temporaryHP" type="number">
      </fieldset>

      <h3>Attacks &amp; Spellcasting</h3>
      <div id="attacks">
        <span>Name</span>
        <span>Atk Bonus</span>
        <span>Damage/Type</span>
        <input id="new-attack-name" class="atk-damage" type="text">
        <input id="new-attack-bonus" class="atk-bonus" type="number">
        <input id="new-attack-damage" class="atk-damage" type="text">
        <button id="js-add-attack" type="submit">Add Attack</button>
      </div>

      <fieldset>
        <legend for="hitDice">Hit Dice</legend>
        <input id="hitDice" type="text">
      </fieldset>

      <div id="death-saves">
        <h3>Death Saves</h3>
        <fieldset name="death-succ">
          <legend>Successes</legend>
          <input class="success" type="checkbox">
          <input class="success" type="checkbox">
          <input class="success" type="checkbox">
        </fieldset>

        <fieldset name="death-fail">
          <legend>Failures</legend>
          <input class="failure" type="checkbox">
          <input class="failure" type="checkbox">
          <input class="failure" type="checkbox">
        </fieldset>
      </div>
    </form>

    <h2 id="skills-header">Skills</h2>
    <form id="skills">
      <fieldset id="acrobatics">
        <legend>Acrobatics<span>(Dex)</span></legend>
        <input class="skill-prof" type="checkbox">
        <input type="number">
      </fieldset>

      <fieldset id="animalHandling">
        <legend>Animal Handling<span>(Wis)</span></legend>
        <input class="skill-prof" type="checkbox">
        <input type="number">
      </fieldset>

      <fieldset id="arcana">
        <legend>Arcana<span>(Int)</span></legend>
        <input class="skill-prof" type="checkbox">
        <input type="number">
      </fieldset>

      <fieldset id="athletics">
        <legend>Athletics<span>(Str)</span></legend>
        <input class="skill-prof" type="checkbox">
        <input type="number">
      </fieldset>

      <fieldset id="deception">
        <legend>Deception<span>(Cha)</span></legend>
        <input class="skill-prof" type="checkbox">
        <input type="number">
      </fieldset>

      <fieldset id="history">
        <legend>History<span>(Int)</span></legend>
        <input class="skill-prof" type="checkbox">
        <input type="number">
      </fieldset>

      <fieldset id="insight">
        <legend>Insight<span>(Wis)</span></legend>
        <input class="skill-prof" type="checkbox">
        <input type="number">
      </fieldset>

      <fieldset id="intimidation">
        <legend>Intimidation<span>(Cha)</span></legend>
        <input class="skill-prof" type="checkbox">
        <input type="number">
      </fieldset>

      <fieldset id="investigation">
        <legend>Investigation<span>(Int)</span></legend>
        <input class="skill-prof" type="checkbox">
        <input type="number">
      </fieldset>

      <fieldset id="medicine">
        <legend>Medicine<span>(Wis)</span></legend>
        <input class="skill-prof" type="checkbox">
        <input type="number">
      </fieldset>

      <fieldset id="nature">
        <legend>Nature<span>(Int)</span></legend>
        <input class="skill-prof" type="checkbox">
        <input type="number">
      </fieldset>

      <fieldset id="perception">
        <legend>Perception<span>(Wis)</span></legend>
        <input class="skill-prof" type="checkbox">
        <input type="number">
      </fieldset>

      <fieldset id="performance">
        <legend>Performance<span>(Cha)</span></legend>
        <input class="skill-prof" type="checkbox">
        <input type="number">
      </fieldset>

      <fieldset id="persuasion">
        <legend>Persuasion<span>(Cha)</span></legend>
        <input class="skill-prof" type="checkbox">
        <input type="number">
      </fieldset>

      <fieldset id="religion">
        <legend>Religion<span>(Int)</span></legend>
        <input class="skill-prof" type="checkbox">
        <input type="number">
      </fieldset>

      <fieldset id="sleightOfHand">
        <legend>Sleight of Hand<span>(Dex)</span></legend>
        <input class="skill-prof" type="checkbox">
        <input type="number">
      </fieldset>

      <fieldset id="stealth">
        <legend>Stealth<span>(Dex)</span></legend>
        <input class="skill-prof" type="checkbox">
        <input type="number">
      </fieldset>

      <fieldset id="survival">
        <legend>Survival<span>(Wis)</span></legend>
        <input class="skill-prof" type="checkbox">
        <input type="number">
      </fieldset>

      <fieldset id="passive-percep">
        <legend for="passiveWisdom">Passive Wisdom (Perception)</legend>
        <input id="passiveWisdom" type="number">
      </fieldset>
    </form>

    <form id="equipment">
      <div id="items-div"> 
        <h2 id="equipment-header">Equipment</h2>
        <input id="new-item" class="items" type="string">
        <button id="js-add-item" type="submit">Add Item</button>
      </div>
      <div id="coins-div">
      <h3 id="coins-header">Coins</h3>
        <fieldset>
          <label for="cp">CP</label>
          <input id="cp" class="coins" type="number">
        </fieldset>

        <fieldset>
          <label for="sp">SP</label>
          <input id="sp" class="coins" type="number">
        </fieldset>

        <fieldset>
          <label for="ep">EP</label>
          <input id="ep" class="coins" type="number">
        </fieldset>

        <fieldset>
          <label for="gp">GP</label>
          <input id="gp" class="coins" type="number">
        </fieldset>

        <fieldset>
          <label for="pp">PP</label>
          <input id="pp" class="coins" type="number">
        </fieldset>
      </div>
    </form>

    <form id="prof-and-lang">
      <h2 id="profs-header">Other Proficiencies &amp; Languages</h2>
      <div id="proficiencies">
        <input id="new-prof" class="profs" type="text">
        <button id="js-add-prof" type="submit">Add Proficiency</button>
      </div>
    </form>

    <form id="features">
      <h2 id="features-header">Features &amp; Traits</h2>
      <div id="features-div"> 
        <input id="new-trait" class="traits" type="text">
        <button id="js-add-trait" type="submit">Add Trait</button>
      </div>
    </form>

    <h2 id="story-header">Story</h2>
    <form id="story">
      <div>
        <h3>Personality Traits</h3>
        <textarea id="personality"></textarea>
      </div>
      <div>
        <h3>Ideals</h3>
        <textarea id="ideals"></textarea>
      </div>
      <div>
        <h3>Bonds</h3>
        <textarea id="bonds"></textarea>
      </div>
      <div>
        <h3>Flaws</h3>
        <textarea id="flaws"></textarea>
      </div>
    </form>
  `;

  $('body').html(html);
}

function renderSavedSheet(data) {
  renderCharSheet();

  const fieldsArray = [
    'charName', 
    'classAndLevel', 
    'background', 
    'playerName', 
    'race',
    'alignment',
    'hitDice',
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

  fieldsArray.forEach(function(field) {
    $(`#${ field }`).attr('value', data[field])
  });

  assignAttributes(data);
  assignSavingThrows(data);
  assignDeathSaves(data);
  assignSkills(data);
  assignAttacks(data);
  assignProf(data);
  assignMoney(data);
  assignEquip(data);
  assignStory(data);
  assignTraits(data);

  // Make app state aware of the current sheet
  appState.currentSheetId = data.id;

  console.log('renderCharSheet ran');
  console.log(appState.currentSheetId);
}
 
function assignAttributes(data) {
  for(let stat in data.attributes) {
    $(`#${ stat }`).attr('value', data.attributes[stat].val);
    $(`#${ stat }-mod`).attr('value', data.attributes[stat].bonus);
  }
}

function assignSavingThrows(data) {
  for(let stat in data.savingThrows) {
    if(data.savingThrows[stat].checked) {
      $(`#${ stat }-save input:nth-child(2)`)
        .attr('checked', true);
    }
    $(`#${ stat }-save input:nth-child(3)`)
      .attr('value', data.savingThrows[stat].bonus);
  }
}

function assignDeathSaves(data) {
  for(let i = 1; i <= data.deathSaves.successes; i++) {
    $(`#combat fieldset:first-of-type input:nth-of-type(${i})`)
      .attr('checked', true);
  }
  for(let i = 1; i <= data.deathSaves.failures; i++) {
    $(`#combat fieldset:nth-of-type(2) input:nth-of-type(${i})`)
      .attr('checked', true);
  }
}

function assignSkills(data) {
  for(let skill in data.skills) {
    if(data.skills[skill].checked) {
      $(`#${ skill } input:first-of-type`).attr('checked', true)
    }
    $(`#${ skill } input:nth-of-type(2)`)
      .attr('value', data.skills[skill].bonus);
  }
}

function assignAttacks(data) {
  let attackElements = [];
  data.attacks.forEach(function(attack) {
    const newAttack = generateAttack(attack.name, attack.bonus, attack.damage);
    attackElements.push(newAttack);
  });
  $('#new-attack-name').before(attackElements);
}

function generateAttack(name, bonus, dmg) {
  return `
    <input class="atk-name" type="text" value="${ name }">
    <input class="atk-bonus" type="number" value="${ bonus }">
    <input class="atk-damage" type="text" value="${ dmg }">
  `;
}

function assignProf(data) {
  let profs = [];
  data.profAndLang.forEach(function(prof) {
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

function assignMoney(data) {
  for(let coin in data.money) {
    $(`#${ coin }`).attr('value', data.money[coin]);
  }
}

function assignEquip(data) {
  let items = [];
  data.equipment.forEach(function(item) {
    const newItem = generateEquip(item);
    items.push(newItem);
  });
  $('#new-item').before(items);
}

function generateEquip(item) {
  return `
    <input class="items" type="text" value="${ item }">
  `;
}

function assignStory(data) {
  for(let item in data.story) {
    $(`#${ item }`).val(data.story[item]);
  }
}

function assignTraits(data) {
  let traits = [];
  data.features.forEach(function(trait) {
    const newTrait = generateTrait(trait);
    traits.push(newTrait);
  });
  $('#new-trait').before(traits);
}

function generateTrait(trait) {
  return `
    <input class="traits" type="text" value="${ trait }">
  `;
}

// *** Code for creating saved Character Sheet objects *** //

function createSheetObject() {
  let savedSheet = {};

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
    savedSheet[field] = $(`#${ field }`).val();
  });

  numValues.forEach(function(field) {
    savedSheet[field] = parseInt($(`#${ field }`).val(), 10);
  })

  unusedData.forEach(function(field) {
    if(field.indexOf('level') === 0) {
      savedSheet[field] = [];
    } else if(field === 'cantrips') {
      savedSheet[field] = [];
    } else {
      savedSheet[field] = null;
    }
  });

  savedSheet.attributes = createAttributesObject();
  savedSheet.savingThrows = createSavingThrowsObject();
  savedSheet.skills = createSkillsObject();
  savedSheet.profAndLang = createProfsArray();
  savedSheet.deathSaves = createDeathSavesObject();
  savedSheet.attacks = createAttacksArray();
  savedSheet.money = createMoneyObject();
  savedSheet.equipment = createEquipmentArray();
  savedSheet.story = createStoryObject();
  savedSheet.features = createFeaturesArray();
  savedSheet.id = appState.currentSheetId;

  return savedSheet;
}

function createAttributesObject() {
  let attributesObject = {};
  const attributes = [
    'strength', 
    'dexterity', 
    'constitution',
    'intelligence',
    'wisdom',
    'charisma'
  ];

  attributes.forEach(function(stat) {
    attributesObject[stat] = {
      val: parseInt($(`#${ stat }`).val(), 10), 
      bonus: $(`#${ stat }-mod`).val()
    };
  });

  return attributesObject;
}

function createSavingThrowsObject() {
  let savingThrowsObject = {};
  const attributes = [
    'strength', 
    'dexterity', 
    'constitution',
    'intelligence',
    'wisdom',
    'charisma'
  ];

  attributes.forEach(function(stat) {
    savingThrowsObject[stat] = {
      checked: findCheckedValue(`#${ stat }-save input:first-of-type`),
      bonus: parseInt($(`#${ stat }-save input:nth-of-type(2)`).val(), 10)
    };
  });

  return savingThrowsObject;
}

function createSkillsObject() {
  let skillsObject = {};
  const skills = [
    'acrobatics',
    'animalHandling',
    'arcana',
    'athletics',
    'deception',
    'history',
    'insight',
    'intimidation',
    'investigation',
    'medicine',
    'nature',
    'perception',
    'performance',
    'persuasion',
    'religion',
    'sleightOfHand',
    'stealth',
    'survival'
  ];

  skills.forEach(function(skill) {
    skillsObject[skill] = {
      checked: findCheckedValue(`#${ skill } input:first-of-type`),
      bonus: parseInt($(`#${ skill } input:nth-of-type(2)`).val(), 10)
    };
  });

  return skillsObject;
}

function createProfsArray() {
  let profsArray = [];

  for(let i = 1; i <= $('.profs').length; i++) {
    const prof = $(`.profs:nth-of-type(${ i })`).val();
    if(prof !== '') {
      profsArray.push(prof);
    }
  }

  return profsArray;
}

function createDeathSavesObject() {
  let savesObject = {
    'successes': 0,
    'failures': 0
  };

  for(let i = 1; i <= 3; i++) {
    if(findCheckedValue(`.success:nth-of-type(${ i })`)) {
      savesObject.successes++;
    }
    if(findCheckedValue(`.failure:nth-of-type(${ i })`)) {
      savesObject.failures++;
    }
  }

  return savesObject;
}

function createAttacksArray() {
  let attacksArray = [];

  for(let i = 0; i <= $('.atk-name').length; i++) {
    if(
        $(`#attacks input:nth-of-type(${ 3*i+1 })`).val() !== '' ||
        $(`#attacks input:nth-of-type(${ 3*i+2 }`).val() !== '' ||
        $(`#attacks input:nth-of-type(${ 3*i+3 }`).val() !== ''
      ) {
          let newAttack = {};
          newAttack.name = $(`#attacks input:nth-of-type(${ 3*i+1 })`).val();
          newAttack.bonus = parseInt($(`#attacks input:nth-of-type(${ 3*i+2 })`).val(), 10);
          newAttack.damage = $(`#attacks input:nth-of-type(${ 3*i+3 })`).val();
          attacksArray.push(newAttack);
    }
  }
  return attacksArray;
}

function createMoneyObject() {
  let moneyObject = {};
  const coins = ['cp', 'sp', 'ep', 'gp', 'pp'];

  coins.forEach(function(coin) {
    moneyObject[coin] = parseInt($(`#${ coin }`).val(), 10);
  });  

  return moneyObject;
}

function createEquipmentArray() {
  let equipmentArray = [];

  for(let i = 1; i <= $('.items').length; i++) {
    const item = $(`.items:nth-of-type(${ i })`).val();
    if(item !== '') {
      equipmentArray.push(item);
    }
  }

  return equipmentArray;
}

function createStoryObject() {
  let storyObject = {};
  const storyItems = ['personality', 'ideals', 'bonds', 'flaws'];

  storyItems.forEach(function(item) {
    storyObject[item] = $(`#${ item }`).val();
  });

  return storyObject;
}

function createFeaturesArray() {
  let featuresArray = [];

  for(let i = 1; i <= $('.traits').length; i++) {
    const trait = $(`.traits:nth-of-type(${ i })`).val();
    if(trait !== '') {
      featuresArray.push(trait);
    }
  }

  return featuresArray;
}
 
function findCheckedValue(element) {
  if($(element).is(':checked')) {
    return true;
  } else {
    return false;
  }
}

function showSaveSuccessful(data) {
  console.log('Save successful');
  $('#js-save').text('Saved!');
  setTimeout(() => $('#js-save').text('Save'), 2000);

 if(data.id) {
    appState.currentSheetId = data.id;
    console.log('Changed current sheet');
  } 
}

//*** Event handlers ***//

function handleConfirmButton() {
  $('body').on('click', '.confirm', function() {
    event.preventDefault();
    console.log($(this).attr('data-id'));
    const selectedtId = $(this).attr('data-id');
    console.log(selectedtId);
    $.ajax({
      method: 'GET',
      contentType: 'application/json',
      dataType: 'json',
      url: `http://localhost:8080/sheets/${ selectedtId }`,
      success: renderSavedSheet
    });
  });
}

function handleHomeButton() {
  $('body').on('click', '#js-home', function() {
    event.preventDefault();
    renderLandingPage();
    appState.currentSheetId = null;
  });
}

function handleAddAttackButton() {
  $('body').on('click', '#js-add-attack', function() {
    event.preventDefault();
    const name = $('#new-attack-name').val();
    const bonus = $('#new-attack-bonus').val();
    const damage = $('#new-attack-damage').val();
    const newAttack = generateAttack(name, bonus, damage);
    $('#new-attack-name').before(newAttack);
    $('#new-attack-name').val('');
    $('#new-attack-bonus').val('');
    $('#new-attack-damage').val('');
  });
}

function handleAddProfButton() {
  $('body').on('click', '#js-add-prof', function() {
    event.preventDefault();
    const prof = $('#new-prof').val(); 
    const newProf = generateProf(prof);
    $('#new-prof').before(newProf);
    $('#new-prof').val('');
  });
}

function handleAddItemButton() {
  $('body').on('click', '#js-add-item', function() {
    event.preventDefault();
    const item = $('#new-item').val();
    const newItem = generateEquip(item);
    $('#new-item').before(newItem);
    $('#new-item').val('');
  });
}

function handleAddTraitButton() {
  $('body').on('click', '#js-add-trait', function() {
    event.preventDefault();
    const trait = $('#new-trait').val();
    const newTrait = generateTrait(trait);
    $('#new-trait').before(newTrait);
    $('#new-trait').val('');
  });
}

function handleSaveButton() {
  $('body').on('click', '#js-save', function() {
    event.preventDefault();
    const savedSheet = createSheetObject();

    if(appState.currentSheetId) {
      console.log('Saving sheet');
      $.ajax({
        method: 'PUT',
        contentType: 'application/json',
        dataType: 'json',
        processData: false,
        url: `http://localhost:8080/sheets/${ appState.currentSheetId }`,
        data: JSON.stringify(savedSheet),
        success: showSaveSuccessful
      });
    } else {
      console.log('Saving new sheet');
      $.ajax({
        method: 'POST',
        contentType: 'application/json',
        dataType: 'json',
        processData: false,
        url: 'http://localhost:8080/sheets',
        data: JSON.stringify(savedSheet),
        success: showSaveSuccessful
      });
    }
  });
}

function handleNewButton() {
  $('body').on('click', '#js-new-sheet', function() {
    event.preventDefault();
    console.log('Providing empty sheet');
    renderCharSheet();
    appState.currentSheetId = null;
  });
}

function getAndDisplayCharacterSheet() {
  getCharacterSheet(renderSavedSheet);
}

function handleButtons() {
  handleConfirmButton();
  handleHomeButton();
  handleAddAttackButton();
  handleAddProfButton();
  handleAddItemButton();
  handleAddTraitButton();
  handleSaveButton();
  handleNewButton();
}

//getAndDisplayCharacterSheet();
renderLandingPage();
handleButtons();