# <a href="https://floating-ravine-29030.herokuapp.com" target="_blank">Draconis Personae</a>

## Introduction
Draconis Personae lets you create, modify, and save Dungeons &amp; Dragons
charcter sheets. After creating an account, you can create new character 
sheets by simply clicking a button and entering your character's stats 
into the appropriate fields. The app then allows you to save the character, 
create additional sheets, and navigate between your characters. If you want 
to see an example account before creating your own, pressing the "See an 
example" button on the landing page will let you see a model character
sheet and take a look at the home screen.

## Technologies
Draconis Personae is a full-stack express application using Node.js as its 
backend framework and MongoDB as its database. The app uses the Mongoose 
library to create data models for users and character sheets, then communicate
with the database. The REST API has endpoints for CRUD requests that are made 
by the client-side JavaScript file. User authentication is handled using the 
Passport.js framework, and passwords are encrypted using bcrypt and then 
stored as secure hashes on a MongoDB database hosted on mLab.

## Screenshots
Here are screenshots of the app's landing page:
![Landing Page one](https://s3.us-east-2.amazonaws.com/readme.images/DPLandingPage1.png)
![Landing Page two](https://s3.us-east-2.amazonaws.com/readme.images/DPLandingPage2.png)
Account creation page:
![Account Creation Page](https://s3.us-east-2.amazonaws.com/readme.images/DPAccountCreation.png)
Home page:
![Home Page](https://s3.us-east-2.amazonaws.com/readme.images/DPHomeScreen.png)
Login Page:
![Login Page](https://s3.us-east-2.amazonaws.com/readme.images/DPLoginScreen.png)
Screenshots of the character management page:
![Character Page](https://s3.us-east-2.amazonaws.com/readme.images/DPCharMan.png)