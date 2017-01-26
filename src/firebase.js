// import and configure firebase
import * as firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyBL9za_JB2vPSlumN4ROqjy9maohVWSeUc",
  authDomain: "jsapp-geosocial-app.firebaseapp.com",
  databaseURL: "https://jsapp-geosocial-app.firebaseio.com",
  storageBucket: "jsapp-geosocial-app.appspot.com",
}
export const firebaseApp = firebase.initializeApp(firebaseConfig)
