import * as firebase from 'firebase-functions'
import * as admin from 'firebase-admin';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

export interface UserModel {
    displayname: string;
  
    /* unique id generated from name */
    nameid: string;
  
    /* user or organization */
    type: string;
    photo: string;
    location: string;
    birthday: string;
    gender: string;
    timezone: string;
    bio: string;
  
    teams: string[];
    routes: string[];
    races: string[];
  
  }

admin.initializeApp(firebase.config().firebase)

export * from "./teams"

export const addNewUserToFirestore = firebase.auth.user().onCreate((event:firebase.Event<firebase.auth.UserRecord>) => {

    var u:firebase.auth.UserRecord = event.data;
    
    var model:UserModel = {
        displayname: '',
        nameid: '',
        type: '',
        photo: '',
        location: '',
        birthday: '',
        gender: '',
        timezone: '',
        bio: '',

        teams: [],
        routes: [],
        races: []
    };

    return admin.firestore().collection('users').doc(u.uid).set(model)

});
