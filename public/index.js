'use strict';

const appState = {
  currentUser: null,
  currentJwt: null,
  currentSheetId: null,
  exampleSheets: null
};

function renderLandingPage() {
  const html = `
    <nav id="nav-bar">
      <ul>
        <li>
          <img id="logo" src="logo.gif" alt="Draconis Personae logo.">
        </li>
        <li>
          <button id="show-login" type="submit">Log in</button>
        </li>
        <li>
          <button class="sign-up" type="submit">Sign up</button>
        </li>
      </ul>
    </nav>
    <header>
      <h1><span>D&D Character Sheets...</span>in the Cloud</h1>
      <h2>Never forget your character sheet again</h2>
    </header>
    <div id="landing-options">
      <button id="main-button" class="sign-up">Sign up</button>
      <p>Wanna see how it works?</p>
      <button id="example">See an example</button>
    </div>
  `;

  $('html').removeClass('sheet-view');
  $('body').removeClass('sheet-view');
  $('body').html(html);
}

function renderAccountCreationPage() {
  const html = `
    <nav id="nav-bar">
      <ul>
        <li>
          <img id="logo" src="logo.gif" alt="Draconis Personae logo.">
        </li>
        <li>
          <button id="show-login" type="submit">Log in</button>
        </li>
        <li>
          <button class="sign-up" type="submit">Sign up</button>
        </li>
      </ul>
    </nav>
    <form id="account-creation">
      <h2>Create your account</h2>
      <input id="new-user" type="text" placeholder="Username" required />
      <input id="new-pass" type="password" placeholder="Password" required />
      <input id="pass-confirm" type="password" placeholder="Confirm password" required />
      <button id="create" type="submit">Continue</button>
      <p id="error" aria-live="assertive"></p>
    </form>
  `;

  $('body').html(html);
}

function renderLoginPage() {
  const html = `
    <nav id="nav-bar">
      <ul>
        <li>
          <img id="logo" src="logo.gif" alt="Draconis Personae logo.">
        </li>
        <li>
          <button id="show-login" type="submit">Log in</button>
        </li>
        <li>
          <button class="sign-up" type="submit">Sign up</button>
        </li>
      </ul>
    </nav>
    <form id="login-form">
      <h2>Log in</h2>
      <input id="username" type="text" placeholder="Username" required />
      <input id="password" type="password" placeholder="Password" required />
      <button id="login" type="submit">Continue</button>
      <p id="error" aria-live="assertive"></p>
    </form>
  `;

  $('body').html(html);
}

// *** Code for finding and displaying user information *** //

function newUserLogin(jwt) {
  appState.currentUser = $('#new-user').val();
  appState.currentJwt = jwt.authToken;
  getUsersAccount();
}

function initialLogin(jwt) {
  appState.currentUser = $('#username').val();
  appState.currentJwt = jwt.authToken;
  if(appState.currentUser) {
    getUsersAccount();
  } else {
    appState.currentUser = 'guest';
    getExampleAccount();
  }
}

function getUsersAccount() {
  $.ajax({
    method: 'GET',
    contentType: 'application/json',
    dataType: 'json',
    processData: false,
    url: `/sheets`,
    headers: {'Authorization': `Bearer ${ appState.currentJwt }`},
    success: renderHomePage
  });
}

function renderHomePage(data) {
  const html =`
    <nav id="nav-bar">
      <ul>
        <li>
          <img id="logo" src="logo.gif" alt="Draconis Personae logo.">
        </li>
        <li>
          <img id="hamburger-button" src="hamburger.svg" alt="Hamburger icon.">
          <div class="menu">
            <ul>
              <li class="js-new-sheet"><button>New Character</button></li>
              <li id="js-logout"><button>Logout</button></li>
            </ul>
          </div>
        </li>
      </ul>
    </nav>
    <h2 id="home-page-header">Click to view character</h2>
    <ul id="confirm-buttons">
    </ul>
    <button id="big-new" class="js-new-sheet" type="submit">New Character</button>
  `;
 
  $('html').removeClass('sheet-view');
  $('body').removeClass('sheet-view');
  $('body').html(html);
  renderSavedCharacters(data);
  appState.currentSheetId = null;
}

function renderSavedCharacters(data) {
  let listElements;
  data.length ? 
  listElements = data.map(createListElement) : 
  listElements = `
    <li>
      <button
        class="js-new-sheet"
        type="submit">
        Make a character sheet!
      </button>
    </li>`;

  $('#confirm-buttons').append(listElements);
}

function createListElement(sheet, index) {
  if(appState.currentUser !== 'guest') {
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
  } else {
    return `
      <li class="landing-chars">
        <button
          class="confirm-ex"
          data-id="${ index }"
          type="submit">
          ${ sheet.charName }
        </button>
      </li>
    `;
  }
}

// *** Code for handling example screens *** //

function getExampleAccount() {
  $.ajax({
    method: 'GET',
    contentType: 'application/json',
    dataType: 'json',
    processData: false,
    url: `/sheets`,
    headers: {'Authorization': `Bearer ${ appState.currentJwt }`},
    success: renderExamplePage
  });
}

function renderExamplePage(data = appState.exampleSheets) {
  const html =`
    <nav id="nav-bar">
      <ul>
        <li>
          <img id="logo" src="logo.gif" alt="Draconis Personae logo.">
        </li>
        <li>
          <button id="show-login" type="submit">Log in</button>
        </li>
        <li>
          <button class="sign-up" type="submit">Sign up</button>
        </li>
      </ul>
    </nav>
    <h2 id="home-page-header">Click to view character</h2>
    <ul id="confirm-buttons">
    </ul>
    <button id="big-new" class="js-new-sheet" type="submit">New Character</button>
    <button id="main-button" class="sign-up" type="submit">Sign up</button>
  `;
 
  $('html').removeClass('sheet-view');
  $('body').removeClass('sheet-view');
  $('body').html(html);
  $('header').addClass('logged-in');
  appState.exampleSheets = data;
  renderSavedCharacters(appState.exampleSheets);
  appState.currentSheetId = null;
}

// *** Code for displaying error messages *** //

function showErrorMessage(err) {
  // NEEDS TO BE MODIFIED TO CORRECTLY FIND ERROR FROM LOGIN PAGE
  const message = `${ err.responseJSON.message }`;
  $('#error').text(message);
}

// *** Code for character sheet display and user interaction *** //

function renderCharSheet(data) {
  appState.currentSheetId = null;

  let navBarHtml;

  if(appState.currentUser !== 'guest') {
    navBarHtml = `
      <nav id="nav-bar">
        <ul>
          <li>
            <img id="logo" src="logo.gif" alt="Draconis Personae logo.">
          </li>
          <li>
            <button class="js-save">Save</button>
          </li>
          <li>
            <img id="hamburger-button" src="hamburger.svg" alt="Hamburger icon.">
            <div class="menu">
              <ul>
                <li><button class="js-save" type="submit">Save Character</button></li>
                <li><button class="js-new-sheet" type="submit">New Character</button></li>
                <li><button id="js-delete" type="submit">Delete Character</button></li>
                <li><button id="js-home" type="submit">Home</button></li>
                <li><button id="js-logout" type="submit">Logout</button></li>
              </ul>
            </div>
          </li>
        </ul>
      </nav>
    `;
  } else {
    navBarHtml = `
      <nav id="nav-bar">
        <ul>
          <li>
            <img id="logo" src="logo.gif" alt="Draconis Personae logo.">
          </li>
          <li>
            <button class="sign-up" type="submit">Sign up</button>
          </li>
          <li>
            <img id="hamburger-button" src="hamburger.svg" alt="Hamburger icon.">
            <div class="menu">
              <ul>
                <li><button class="js-save-ex" type="submit">Save Character</button></li>
                <li><button class="js-new-sheet" type="submit">New Character</button></li>
                <li><button id="js-delete-ex" type="submit">Delete Character</button></li>
                <li><button id="show-login" type="submit">Log in</button></li>
                <li><button id="js-home-ex" type="submit">Home</button></li>
                <li><button id="js-logout" type="submit">Logout</button></li>
              </ul>
            </div>
          </li>
        </ul>
      </nav>
    `;
  }

  const sheetHtml = `
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
        <legend for="HP">Max HP</legend>
        <input id="HP" type="number">
      </fieldset>

      <fieldset class="com-one">
        <legend for="currentHP">Current HP</legend>
        <input id="currentHP" type="number">
      </fieldset>

      <fieldset class="com-one">
        <legend for="temporaryHP">Temporary HP</legend>
        <input id="temporaryHP" type="number">
      </fieldset>

      <h3 id="attacks-header">Attacks &amp; Spellcasting</h3>
      <div id="attacks">
        <div id="attack-labels">
          <span>Name</span>
          <span>Atk Bonus</span>
          <span>Damage/Type</span>
        </div>
        <div id="new-atk-line" class="atk-line">
          <input id="new-attack-name" class="atk-name" type="text">
          <input id="new-attack-bonus" class="atk-bonus" type="number">
          <input id="new-attack-damage" class="atk-damage" type="text">
        </div>
        <button id="js-add-attack" type="submit">Add Attack</button>
      </div>

      <fieldset id="hit-dice-field">
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
        <div>
          <legend>Acrobatics(Dex)</legend>
          <input class="skill-prof" type="checkbox">
          <input type="number">
        </div>
      </fieldset>

      <fieldset id="animalHandling">
        <div>
          <legend>Animal Handling(Wis)</legend>
          <input class="skill-prof" type="checkbox">
          <input type="number">
        </div>
      </fieldset>

      <fieldset id="arcana">
        <div>
          <legend>Arcana(Int)</legend>
          <input class="skill-prof" type="checkbox">
          <input type="number">
        </div>
      </fieldset>

      <fieldset id="athletics">
        <div>
          <legend>Athletics(Str)</legend>
          <input class="skill-prof" type="checkbox">
          <input type="number">
        </div>
      </fieldset>

      <fieldset id="deception">
        <div>
          <legend>Deception(Cha)</legend>
          <input class="skill-prof" type="checkbox">
          <input type="number">
        </div>
      </fieldset>

      <fieldset id="history">
        <div>
          <legend>History(Int)</legend>
          <input class="skill-prof" type="checkbox">
          <input type="number">
        </div>
      </fieldset>

      <fieldset id="insight">
        <div>
          <legend>Insight(Wis)</legend>
          <input class="skill-prof" type="checkbox">
          <input type="number">
        </div>
      </fieldset>

      <fieldset id="intimidation">
        <div>
          <legend>Intimidation(Cha)</legend>
          <input class="skill-prof" type="checkbox">
          <input type="number">
        </div>
      </fieldset>

      <fieldset id="investigation">
        <div>
          <legend>Investigation(Int)</legend>
          <input class="skill-prof" type="checkbox">
          <input type="number">
        </div>
      </fieldset>

      <fieldset id="medicine">
        <div>
          <legend>Medicine(Wis)</legend>
          <input class="skill-prof" type="checkbox">
          <input type="number">
        </div>
      </fieldset>

      <fieldset id="nature">
        <div>
          <legend>Nature(Int)</legend>
          <input class="skill-prof" type="checkbox">
          <input type="number">
        </div>
      </fieldset>

      <fieldset id="perception">
        <div>
          <legend>Perception(Wis)</legend>
          <input class="skill-prof" type="checkbox">
          <input type="number">
        </div>
      </fieldset>

      <fieldset id="performance">
        <div>
          <legend>Performance(Cha)</legend>
          <input class="skill-prof" type="checkbox">
          <input type="number">
        </div>
      </fieldset>

      <fieldset id="persuasion">
        <div>
          <legend>Persuasion(Cha)</legend>
          <input class="skill-prof" type="checkbox">
          <input type="number">
        </div>
      </fieldset>

      <fieldset id="religion">
        <div>
          <legend>Religion(Int)</legend>
          <input class="skill-prof" type="checkbox">
          <input type="number">
        </div>
      </fieldset>

      <fieldset id="sleightOfHand">
        <div>
          <legend>Sleight of Hand(Dex)</legend>
          <input class="skill-prof" type="checkbox">
          <input type="number">
        </div>
      </fieldset>

      <fieldset id="stealth">
        <div>
          <legend>Stealth(Dex)</legend>
          <input class="skill-prof" type="checkbox">
          <input type="number">
        </div>
      </fieldset>

      <fieldset id="survival">
        <div>
          <legend>Survival(Wis)</legend>
          <input class="skill-prof" type="checkbox">
          <input type="number">
        </div>
      </fieldset>

      <fieldset id="passive-percep">
        <div>
          <legend for="passiveWisdom">Passive Wisdom (Perception)</legend>
          <input id="passiveWisdom" type="number">
        </div>
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
      <div id="proficiencies">
        <h2 id="profs-header">Other Proficiencies &amp; Languages</h2>
        <input id="new-prof" class="profs" type="text">
        <button id="js-add-prof" type="submit">Add Proficiency</button>
      </div>
    </form>

    <form id="features">
      <div id="features-div"> 
        <h2 id="features-header">Features &amp; Traits</h2>
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

  $('html').addClass('sheet-view');
  $('body').addClass('sheet-view');
  $('body').html(navBarHtml);
  $('body').append(sheetHtml);
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
  if(appState.currentUser !== 'guest') {
    appState.currentSheetId = data.id;
  } 
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
  $('#new-atk-line').before(attackElements);
}

function generateAttack(name, bonus, dmg) {
  return `
    <div class="atk-line">
      <input class="atk-name" type="text" value="${ name }">
      <input class="atk-bonus" type="number" value="${ bonus }">
      <input class="atk-damage" type="text" value="${ dmg }">
    </div>
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

function renderCharacterSheetMenu() {

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

  for(let i = 1; i <= $('.atk-line').length; i++) {
    if(
        $(`.atk-line:nth-child(${ i + 1 }) .atk-name`).val() !== '' ||
        $(`.atk-line:nth-child(${ i + 1 }) .atk-bonus`).val() !== '' ||
        $(`.atk-line:nth-child(${ i + 1 }) .atk-damage`).val() !== ''
      ) {
          let newAttack = {};
          newAttack.name = $(`.atk-line:nth-child(${ i + 1 }) .atk-name`).val();
          newAttack.bonus = parseInt($(`.atk-line:nth-child(${ i + 1 }) .atk-bonus`).val(), 10);
          newAttack.damage = $(`.atk-line:nth-child(${ i + 1 }) .atk-damage`).val();
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
  $('.js-save').text('Saved!');
  $('.js-save-ex').text('Saved!');
  setTimeout(() => $('.js-save').text('Save'), 2000);
  setTimeout(() => $('.js-save-ex').text('Save'), 2000);

  if(data && data._id) {
    appState.currentSheetId = data._id;
  } 
}

function renderDeletionPrompt() {
  if(window.confirm('Are you sure you want to delete this sheet?')) {
    $.ajax({
      method: 'DELETE',
      dataType: 'json',
      headers: {'Authorization': `Bearer ${ appState.currentJwt }`},
      url: `/sheets/${ appState.currentSheetId }`,
      success: renderCharSheet,
      error: showDeletionError
    });
  }
}

function showDeletionError() {
  window.alert('Deletion failed!');
}

function renderExampleDeletionPrompt() {
  if(window.confirm('Are you sure you want to delete this sheet?')) {
    appState.exampleSheets.splice(appState.currentSheetId, 1);
    renderCharSheet();
  }
}

//*** Event handlers ***//

function handleSignUpButton() {
  $('body').on('click', '.sign-up', function(ev) {
    ev.preventDefault();
    renderAccountCreationPage();
  });
}

function handleShowLoginButton() {
  $('body').on('click', '#show-login', function(ev) {
    ev.preventDefault();
    renderLoginPage();
  });
}

function handleLoginButton() {
  $('body').on('click', '#login', function(ev) {
    ev.preventDefault();
    const username = $('#username').val();
    const password = $('#password').val();
    const loginObj = { username, password };
    if(username !== 'guest') {
      $.ajax({
        method: 'POST',
        contentType: 'application/json',
        dataType: 'json',
        processData: false,
        url: `/users/login`,
        data: JSON.stringify(loginObj),
        success: initialLogin,
        error: showErrorMessage({ responseJSON: { message: 'Incorrect username or password' } })
      }); 
    } else {
      showErrorMessage({ responseJSON: { message: `Cannot login as 'guest'` } });
    }
  });
}

function handleExampleButton() {
  $('body').on('click', '#example', function(ev) {
    ev.preventDefault();
    const loginObj = { username: 'guest', password: 'exampleaccount' };
    $.ajax({
      method: 'POST',
      contentType: 'application/json',
      dataType: 'json',
      processData: false,
      url: `/users/login`,
      data: JSON.stringify(loginObj),
      success: initialLogin,
      error: showErrorMessage
    });
  });
} 

function handleNewUser() {
  $('body').on('click', '#new-account', function(ev) {
    ev.preventDefault();
    renderAccountCreationPage();
  });
}

function handleAccountCreation() {
  $('body').on('click', '#create', function(ev) {
    ev.preventDefault();
    const user = $('#new-user').val();
    const pass = $('#new-pass').val();
    const confirmPass = $('#pass-confirm').val();

    if(pass === confirmPass) {
      const newUser = {
        username: user,
        password: pass
      };
      $.ajax({
        method: 'POST',
        contentType: 'application/json',
        dataType: 'json',
        processData: false,
        url: `/users`,
        data: JSON.stringify(newUser),
        success: newUserLogin,
        error: showErrorMessage
      });
    } else if(pass !== confirmPass) {
      const message = `Passwords do not match!`;
      $('#error').text(message);
    }
  });
}

function handleHamburgerButton() {
  $('body').on('click', '#hamburger-button', function(ev) {
    $('.menu').toggleClass('expand');
  });
}

function handleConfirmButton() {
  $('body').on('click', '.confirm', function(ev) {
    ev.preventDefault();
    const selectedtId = $(this).attr('data-id');
    $.ajax({
      method: 'GET',
      contentType: 'application/json',
      dataType: 'json',
      url: `/sheets/${ selectedtId }`,
      headers: {'Authorization': `Bearer ${ appState.currentJwt }`},
      success: renderSavedSheet
    });
  });
}

function handleHomeButton() {
  $('body').on('click', '#js-home', function(ev) {
    ev.preventDefault();
    getUsersAccount(appState.currentJwt);
  });
}

function handleAddAttackButton() {
  $('body').on('click', '#js-add-attack', function(ev) {
    ev.preventDefault();
    const name = $('#new-attack-name').val();
    const bonus = $('#new-attack-bonus').val();
    const damage = $('#new-attack-damage').val();
    const newAttack = generateAttack(name, bonus, damage);
    $('#new-atk-line').before(newAttack);
    $('#new-attack-name').val('');
    $('#new-attack-bonus').val('');
    $('#new-attack-damage').val('');
  });
}

function handleAddProfButton() {
  $('body').on('click', '#js-add-prof', function(ev) {
    ev.preventDefault();
    const prof = $('#new-prof').val(); 
    const newProf = generateProf(prof);
    $('#new-prof').before(newProf);
    $('#new-prof').val('');
  });
}

function handleAddItemButton() {
  $('body').on('click', '#js-add-item', function(ev) {
    ev.preventDefault();
    const item = $('#new-item').val();
    const newItem = generateEquip(item);
    $('#new-item').before(newItem);
    $('#new-item').val('');
  });
}

function handleAddTraitButton() {
  $('body').on('click', '#js-add-trait', function(ev) {
    ev.preventDefault();
    const trait = $('#new-trait').val();
    const newTrait = generateTrait(trait);
    $('#new-trait').before(newTrait);
    $('#new-trait').val('');
  });
}

function handleSaveButton() {
  $('body').on('click', '.js-save', function(ev) {
    ev.preventDefault();
    const savedSheet = createSheetObject();

    if(appState.currentSheetId) {
      // saving an existing sheet
      $.ajax({
        method: 'PUT',
        contentType: 'application/json',
        dataType: 'json',
        processData: false,
        url: `/sheets/${ appState.currentSheetId }`,
        headers: {'Authorization': `Bearer ${ appState.currentJwt }`},
        data: JSON.stringify(savedSheet),
        success: showSaveSuccessful
      });
    } else {
      // saving a new sheet
      $.ajax({
        method: 'POST',
        contentType: 'application/json',
        dataType: 'json',
        processData: false,
        url: `/sheets`,
        headers: {'Authorization': `Bearer ${ appState.currentJwt }`},
        data: JSON.stringify(savedSheet),
        success: showSaveSuccessful
      });
    }
  });
}

function handleNewButton() {
  $('body').on('click', '.js-new-sheet', function(ev) {
    ev.preventDefault();
    renderCharSheet();
    appState.currentSheetId = null;
  });
}

function handleDeleteButton() {
  $('body').on('click', '#js-delete', function(ev) {
    ev.preventDefault();
    if(appState.currentSheetId) {
      renderDeletionPrompt();
    } else {
      window.alert('You have not yet saved this sheet.');
    }
  });
}

function handleLogoutButton() {
  $('body').on('click', '#js-logout', function(ev) {
    ev.preventDefault();
    renderLandingPage();
    appState.currentUser = null;
    appState.currentJwt = null;
    appState.currentSheetId = null;
    appState.exampleSheets = null;
  });
}

function handleExampleConfirmButton() {
  $('body').on('click', '.confirm-ex', function(ev) {
    ev.preventDefault();
    const sheetId = $(this).attr('data-id');
    renderSavedSheet(appState.exampleSheets[sheetId]);
    appState.currentSheetId = sheetId;
  });
}

function handleExampleHomeButton() {
  $('body').on('click', '#js-home-ex', function(ev) {
    ev.preventDefault();
    renderExamplePage();
  });
}

function handleExampleSaveButton() {
  $('body').on('click', '.js-save-ex', function(ev) {
    ev.preventDefault();
    const savedSheet = createSheetObject();
    if(savedSheet.charName) {
      if(appState.currentSheetId) {
        appState.exampleSheets[appState.currentSheetId] = savedSheet;
        showSaveSuccessful();
      } else {
        appState.exampleSheets.push(savedSheet);
        appState.currentSheetId = appState.exampleSheets.length - 1;
        showSaveSuccessful();
      }
    }
  });
}

function handleExampleDeleteButton() {
  $('body').on('click', '#js-delete-ex', function(ev) {
    ev.preventDefault();
    if(appState.currentSheetId) {
      renderExampleDeletionPrompt();
    } else {
      window.alert('You have not yet saved this sheet.');
    }
  });
}

function handleButtons() {
  handleSignUpButton();
  handleShowLoginButton();
  handleLoginButton();
  handleExampleButton();
  handleNewUser();
  handleAccountCreation();
  handleHamburgerButton();
  handleConfirmButton();
  handleHomeButton();
  handleAddAttackButton();
  handleAddProfButton();
  handleAddItemButton();
  handleAddTraitButton();
  handleSaveButton();
  handleNewButton();
  handleDeleteButton();
  handleLogoutButton();
  handleExampleConfirmButton();
  handleExampleHomeButton();
  handleExampleSaveButton();
  handleExampleDeleteButton();
}

renderLandingPage();
handleButtons();